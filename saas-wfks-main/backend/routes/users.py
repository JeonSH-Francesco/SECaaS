from flask import Blueprint, request, jsonify, session
from response.headers import create_response
from models.domain import Domain
from models.security_policy import SecurityPolicy
from models.user import User
from models import *
from models.user_application import UserApplication
from utils import *
import urllib3
import automic_setting
from urllib.parse import urlparse   
from flask_jwt_extended import jwt_required,create_access_token,unset_jwt_cookies


users = Blueprint('users', __name__, url_prefix='/api/v1/users')
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning) #지우시요 나중에

def jwt_generate_token(identity, level):
    # identity: 사용자 식별자 (일반적으로 사용자의 ID)
    # level: 사용자의 권한 레벨

    # 토큰에 포함할 추가적인 정보를 dictionary로 정의
    additional_claims = {"level": level}

    # create_access_token 함수를 사용하여 JWT 토큰 생성
    jwt_token = create_access_token(identity=identity, additional_claims=additional_claims)

    return jwt_token

@users.route('/signup', methods=['POST'])
def register():
    try : 
        data = request.get_json()
        user_data = {
            "companyName":data.get('companyName'),
            "email":data.get('email'),
            "password":data.get('password'),
            "membership":data.get('membership')
        }
        user = User.create(**user_data)

        parsed_url = urlparse(data["domain_address"])
        domain_parsed = parsed_url.netloc.split(".")[-2] + "." + parsed_url.netloc.split(".")[-1]
        if Domain.check_domain_by_name(domain_parsed) :
            raise Exception("")
        
        automic_setting.automic_setting(data, user.id)
        
        return jsonify({"message": "User registered successfully.", "user_id": user.id}), 201
    except Exception as e :
        print(e)
        return create_response(success=False, message="기존에 가입된 회사이름, 도메인 또는 이메일이 존재합니다.", status_code=400)
    
@users.route('/signin', methods=['POST'])
def login():
    data = request.get_json()
    companyName = data.get('companyName')
    password = data.get('password')

    user = User.query.filter_by(companyName=companyName).first()

    if user and bcrypt.check_password_hash(user.password, password):
        try:
            user_app = UserApplication.get_app_by_user_id(user.id)
            sp = SecurityPolicy.get_security_policy_by_id(user_app.security_policy_id)
            level = user.level

            user_app_id = user_app.wf_app_id
            security_policy_id = sp.wf_security_policy_id
            jwt_token = jwt_generate_token(identity=user.id, level=user.level)
            return jsonify({"id": user.id, "message": "Login successful.", "access_token": jwt_token, "app_id":user_app_id,"security_policy_id":security_policy_id,"level":level,"app_name":companyName}), 200

        except Exception as e:
                # 예외 처리: 원격 서버와의 통신에 문제가 있을 경우
            return jsonify({"message": f"Login failed. {str(e)}"}), 401
    else:
        return jsonify({"message": "Login failed. Invalid credentials."}), 401

@users.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    users = User.query.all()
    user_list = [
        {
            'id': user.id,
            'companyName': user.companyName,
            'email': user.email,
            'password': user.password,
            'membership': user.membership
        } for user in users
    ]
    return jsonify({'users': user_list}), 200

@users.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        user_data = {
            'id': user.id,
            'companyName': user.companyName,
            'email': user.email,
            'password': user.password,
            'membership': user.membership
        }
        return jsonify(user_data), 200
    else:
        return jsonify({'message': 'User not found.'}), 404

@users.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    data = request.get_json()
    user = User.query.get(user_id)
    if user:
        user.update(**data)
        return jsonify({'message': 'User updated successfully.'}), 200
    else:
        return jsonify({'message': 'User not found.'}), 404

@users.route('/<int:user_id>/change_password', methods=['POST'])
def change_password(user_id):
    data = request.get_json()
    new_password = data.get('new_password')
    user = User.query.get(user_id)
    if user:
        user.change_password(new_password)
        return jsonify({'message': 'Password changed successfully.'}), 200
    else:
        return jsonify({'message': 'User not found.'}), 404

@users.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    response = jsonify({"message": "로그아웃 성공."})
    session.pop('user_id', None)
    unset_jwt_cookies(response)
    return response, 200

@users.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": f"User {user_id} deleted successfully."}), 200
    else:
        return jsonify({"error": "User not found."}), 404
    

@users.route('/<int:user_id>/forgot_password', methods=['POST'])
def forgot_password(user_id):
    data = request.get_json()
    email = data.get('email')

    user = User.query.filter((User.id == user_id) & (User.email == email)).first()

    if user:
        user.send_temporary_password()
        return jsonify({"message": "Temporary password sent successfully."}), 200
    else:
        return jsonify({"message": "User not found."}), 404
    
