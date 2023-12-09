from flask import Flask, jsonify, request
import json
from flask import Blueprint
import requests
import urllib3
from automic_setting import basic_auth, make_api_request
from response.dto.security_policy_dto import SecurityPolicyDto
from response.headers import create_response
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging
import os
security_policy_detail_ = Blueprint('security_policy_detail', __name__, url_prefix='/api/v1/security_policy')
base_url = 'https://wf.awstest.piolink.net:8443/api/v3'



def update_poc_examples(data,policy_name):
    file_path = f'./json/sig_list/{policy_name}.json'    
    
    logging.debug(f"Reading file: {file_path}")
    logging.debug(os.getcwd())
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            sig_list = json.load(file)
        # 여기서 sig_list를 사용할 수 있습니다.
    except FileNotFoundError:
        logging.debug(f"파일이 존재하지 않습니다: {file_path}")
    except json.JSONDecodeError:
        logging.debug(f"JSON 디코딩 오류: {file_path}")
    except Exception as e:
        logging.debug(f"오류 발생: {e}")
    for sig_entry in sig_list:
        sig_id = sig_entry["sig_id"]
        poc_example = sig_entry["poc_example"]
        if policy_name != "up_download":
            for item in data.get("sig_list", []):
                if item.get("id") == sig_id:
                    # If the "poc_examples" key doesn't exist, create it as a list
                    item["poc_examples"] = poc_example
        else:
            for item in data:
                if item.get("id") == sig_id:
                    # If the "poc_examples" key doesn't exist, create it as a list
                    item["poc_examples"] = poc_example
                    
    return data

"""
정책 상세 관리 - 시그니처 기반
"""
"""
GET SQL injection
"""
@security_policy_detail_.route('/<int:security_policy_id>/sql_injection', methods=['GET'])
@jwt_required()
def get_policy_sql_injection(security_policy_id) : 
    try : 
        response = make_api_request(f"{base_url}/security_policy/{security_policy_id}/sql_injection", method='GET', headers=basic_auth())
        
        data = json.loads(response.content.decode('utf-8'))
        logging.debug(f"data: {data}")
        update_poc_examples(data,"sql_injection")

        spDto = SecurityPolicyDto(status=data['sig_list'][0]['status'], sig_list=data['sig_list'])
        return create_response(data=spDto.__dict__)
    except Exception as e:
        return create_response(success=True, message=e, status_code = 500)
    
"""
GET url 정규식 검사
"""
@security_policy_detail_.route('/<int:security_policy_id>/url_regex', methods=['GET'])
@jwt_required()
def get_policy_url_regex(security_policy_id) : 
    try : 
        response = make_api_request(f"{base_url}/security_policy/{security_policy_id}/url_regex", method='GET', headers=basic_auth())
        data = json.loads(response.content.decode('utf-8'))
        update_poc_examples(data,"url_regex")
        spDto = SecurityPolicyDto(status=data['sig_list'][0]['status'], sig_list=data['sig_list'])
        return create_response(data=spDto.__dict__)
    except Exception as e:
        return create_response(success=True, message=e, status_code = 500)

"""
GET xss
"""
@security_policy_detail_.route('/<int:security_policy_id>/xss', methods=['GET'])
@jwt_required()
def get_policy_xss(security_policy_id) : 
    try : 
        response = make_api_request(f"{base_url}/security_policy/{security_policy_id}/xss", method='GET', headers=basic_auth())
        data = json.loads(response.content.decode('utf-8'))
        update_poc_examples(data,"xss")
        spDto = SecurityPolicyDto(status=data['sig_list'][0]['status'], sig_list=data['sig_list'])
        return create_response(data=spDto.__dict__)
    except Exception as e:
        return create_response(success=True, message=e, status_code = 500)

"""
GET 디렉토리 리스팅
"""
@security_policy_detail_.route('/<int:security_policy_id>/directory_listing', methods=['GET'])
@jwt_required()
def get_policy_directory_listing(security_policy_id) : 
    try : 
        response = make_api_request(f"{base_url}/security_policy/{security_policy_id}/directory_listing", method='GET', headers=basic_auth())
        data = json.loads(response.content.decode('utf-8'))
        update_poc_examples(data,"directory_listing")
        spDto = SecurityPolicyDto(status=data['sig_list'][0]['status'], sig_list=data['sig_list'])
        return create_response(data=spDto.__dict__)
    except Exception as e:
        return create_response(success=True, message=e, status_code = 500)
    
"""
GET 쉘코드
"""
@security_policy_detail_.route('/<int:security_policy_id>/shellcode', methods=['GET'])
@jwt_required()
def get_policy_shellcode(security_policy_id) : 
    try : 
        response = make_api_request(f"{base_url}/security_policy/{security_policy_id}/shellcode", method='GET', headers=basic_auth())
        data = json.loads(response.content.decode('utf-8'))
        update_poc_examples(data,"shellcode")
        spDto = SecurityPolicyDto(status=data['sig_list'][0]['status'], sig_list=data['sig_list'])
        return create_response(data=spDto.__dict__)
    except Exception as e:
        return create_response(success=True, message=e, status_code = 500)
    
"""
GET access_control
"""
@security_policy_detail_.route('/<int:security_policy_id>/access_control', methods=['GET'])
@jwt_required()
def get_policy_access_control(security_policy_id) : 
    try : 
        response = make_api_request(f"{base_url}/security_policy/{security_policy_id}/access_control", method='GET', headers=basic_auth())
        data = json.loads(response.content.decode('utf-8'))
        update_poc_examples(data,"access_control")
        spDto = SecurityPolicyDto(status=data['sig_list'][0]['status'], sig_list=data['sig_list'])
        return create_response(data=spDto.__dict__)
    except Exception as e:
        return create_response(success=True, message=e, status_code = 500)

"""
GET 파일 업/다운로드
"""
@security_policy_detail_.route('/<int:security_policy_id>/up_download', methods=['GET'])
@jwt_required()
def get_policy_updownload(security_policy_id) : 
    try : 
        response_down = make_api_request(f"{base_url}/security_policy/{security_policy_id}/download", method='GET', headers=basic_auth())
        response_up = make_api_request(f"{base_url}/security_policy/{security_policy_id}/upload", method='GET', headers=basic_auth())
        data_down = json.loads(response_down.content.decode('utf-8'))
        data_up = json.loads(response_up.content.decode('utf-8'))
        data = data_down['sig_list'] + data_up['sig_list']
        update_poc_examples(data,"up_download")
        spDto = SecurityPolicyDto(status=data_down['sig_list'][0]['status'], sig_list=data)
        return create_response(data=spDto.__dict__)
    except Exception as e:
        return create_response(success=True, message=e, status_code = 500)
    
"""
정책 상세 관리 - 옵션 기반
"""
"""
GET 과다 요청 제어
"""
@security_policy_detail_.route('/<int:security_policy_id>/request_flood', methods=['GET'])
@jwt_required()
def get_policy_request_flood(security_policy_id) : 
    try : 
        response = make_api_request(f"{base_url}/security_policy/{security_policy_id}/request_flood", method='GET', headers=basic_auth())
        data = json.loads(response.content.decode('utf-8'))
        spDto = SecurityPolicyDto(status=data['adv_options']['proxy_status'], adv_options=data['adv_options'])
        return create_response(data=spDto.__dict__)
    except Exception as e:
        return create_response(success=True, message=e, status_code = 500)

"""
GET 검사 회피
"""
@security_policy_detail_.route('/<int:security_policy_id>/evasion', methods=['GET'])
@jwt_required()
def get_policy_evasion(security_policy_id) : 
    try : 
        response = make_api_request(f"{base_url}/security_policy/{security_policy_id}/evasion", method='GET', headers=basic_auth())
        data = json.loads(response.content.decode('utf-8'))
        spDto = SecurityPolicyDto(status=data['adv_options']['enable_tildotslash'], adv_options=data['adv_options'])
        return create_response(data=spDto.__dict__)
    except Exception as e:
        return create_response(success=True, message=e, status_code = 500)

"""
GET 크리덴셜 스터프
"""
@security_policy_detail_.route('/<int:security_policy_id>/credential_stuffing', methods=['GET'])
@jwt_required()
def get_policy_credential_stuffing(security_policy_id) : 
    try : 
        response = make_api_request(f"{base_url}/security_policy/{security_policy_id}/credential_stuffing", method='GET', headers=basic_auth())
        data = json.loads(response.content.decode('utf-8'))
        adv_options = { "success_rule": data['success_rule'], "fail_rule" : data['fail_rule']}
        spDto = SecurityPolicyDto(status=data['success_rule']['action'], adv_options=adv_options)
        return create_response(data=spDto.__dict__)
    except Exception as e:
        return create_response(success=True, message=e, status_code = 500)

"""
GET 쿠키 보호
"""
@security_policy_detail_.route('/<int:security_policy_id>/cookie_protection', methods=['GET'])
@jwt_required()
def get_policy_cookie_protection(security_policy_id) : 
    try : 
        response = make_api_request(f"{base_url}/security_policy/{security_policy_id}/cookie_protection", method='GET', headers=basic_auth())
        data = json.loads(response.content.decode('utf-8'))
        spDto = SecurityPolicyDto(status=data['adv_options']['hijack_status'], adv_options=data['adv_options'])
        return create_response(data=spDto.__dict__)
    except Exception as e:
        return create_response(success=True, message=e, status_code = 500)

"""
GET 버퍼 오버 플로우
"""
@security_policy_detail_.route('/<int:security_policy_id>/buffer_overflow', methods=['GET'])
@jwt_required()
def get_policy_buffer_overflow(security_policy_id) : 
    try : 
        response = make_api_request(f"{base_url}/security_policy/{security_policy_id}/buffer_overflow", method='GET', headers=basic_auth())
        data = json.loads(response.content.decode('utf-8'))
        spDto = SecurityPolicyDto(status=data['adv_options']['header_length_status'], adv_options=data['adv_options'])
        return create_response(data=spDto.__dict__)
    except Exception as e:
        return create_response(success=True, message=e, status_code = 500)



"""
정책 상세 설정 상태 변경
"""
"""
PUT 파일 업/다운로드 상태 수정
"""
@security_policy_detail_.route('/<int:security_policy_id>/up_download', methods=['PUT'])
@jwt_required()
def update_policy_up_download(security_policy_id) : 
    data = request.json
    status, sig_list = data.get('status'), data.get('sig_list')

    url_upload = f'{base_url}/security_policy/{security_policy_id}/upload'
    url_download = f'{base_url}/security_policy/{security_policy_id}/up_download'
    update_upload = [{"id": item["id"], "status": status} for item in sig_list if item["id"].startswith("1111")]
    update_download = [{"id": item["id"], "status": status} for item in sig_list if item["id"].startswith("1112")]

    make_api_request(url_upload, method='PUT', headers=basic_auth(), data=update_upload)
    make_api_request(url_download, method='PUT', headers=basic_auth(), data=update_download)
    return create_response()

"""
PUT 과다 요청 제어 옵션 횟수 수정
"""
@security_policy_detail_.route('/<int:security_policy_id>/request_flood/adv_options', methods=['PUT'])
@jwt_required()
def update_policy_request_flood_option(security_policy_id) :
    data = request.json
    url = f'{base_url}/security_policy/{security_policy_id}/request_flood/adv_options'
    make_api_request(url, method='PUT', headers=basic_auth(), data=data)
    return create_response()

"""
PUT 상태 변경
TODO : front 에서 sig_list 받아와서 상태 처리하는 시간 빨라지도록
"""
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning) #지우시요 나중에
policy_names = ["buffer_overflow","request_flood","evasion","cookie_protection","credential_stuffing"]
@security_policy_detail_.route('/<int:security_policy_id>/<policy_name>', methods=['PUT'])
@jwt_required()
def get_policy_details(security_policy_id, policy_name):

    url = f'{base_url}/security_policy/{security_policy_id}/{policy_name}'
    filename = './json/security_policy_name.json'
    
    with open(filename, 'r') as json_file:
        policy_data_extractors = json.load(json_file)
    
    setting_names = policy_data_extractors[policy_name]
    headers = basic_auth()

    try:

        if request.method == 'PUT':

            data = request.json
            status = data.get('status')

            if isinstance(setting_names, list):
                for setting_name in setting_names:
                    ex_url = f'{url}/{setting_name}'
                    response = make_api_request(ex_url, "GET", headers)
                    security_policy_json = response.json()

                    if policy_name == 'credential_stuffing':
                        security_policy_json['action'] = status
                        response = make_api_request(ex_url, method='PUT', headers=headers, data=security_policy_json)
                    else:
                        if setting_name == "adv_options":
                            keys_to_include = ["session_user_define_time", "proxy_request_count", "session_request_count", "proxy_user_define_time"]
                            updated_data = {key: int(request.args.get(key)) for key in keys_to_include if request.args.get(key) is not None}
                            updated_data.update({key: status for key, value in security_policy_json.items() if key.endswith("_status") and isinstance(value, str)})
                            response = make_api_request(ex_url, method='PUT', headers=headers, data=updated_data)
                        else:
                            updated_data = {key: status for key, value in security_policy_json.items() if key.endswith("_status") and isinstance(value, str)}
                            response = make_api_request(ex_url, method='PUT', headers=headers, data=updated_data)
            else:
                ex_url = f'{url}/{setting_names}'
                response = make_api_request(ex_url, "GET", headers)
                security_policy_json = response.json()

                if setting_names == 'sig_list':
                    updated_data = [{"id": item.get("id"), "status": status, "block_id": item.get("block_id")} for item in security_policy_json]
                    response = make_api_request(ex_url, method='PUT', headers=headers, data=updated_data)
                elif isinstance(security_policy_json, dict):
                    updated_data = {key: status for key, value in security_policy_json.items() if key.endswith("_status") and isinstance(value, str)}
                    response = make_api_request(ex_url, method='PUT', headers=headers, data=updated_data)

            # sp = SecurityPolicy.update_security_policy_by_wf_id(security_policy_id, policy_name=status)
            return response.json()

    except requests.exceptions.RequestException as e:
        # API 요청 중에 오류가 발생한 경우 처리
        error_message = f"API 요청 중 오류 발생: {str(e)}"
        print(f"Error: {error_message}")
        return jsonify({'error': error_message}), 500

    except Exception as e:
        # 기타 예외가 발생한 경우 처리
        error_message = f"알 수 없는 오류 발생: {str(e)}"
        print(f"Error: {error_message}")
        return jsonify({'error': error_message}), 500
