import json
from flask import Blueprint, jsonify, request
import requests
from response.dto.block_ip_dto import BlockIPDto
from response.headers import create_response
from utils import make_api_request,basic_auth
from flask_jwt_extended import jwt_required

security_policy_ = Blueprint('security_policy', __name__, url_prefix='/api/v1/security_policy')
base_url = 'https://wf.awstest.piolink.net:8443/api/v3'

headers = basic_auth()

# @security_policy_.before_request
# def before_request():
#     jwt_required()  # Call jwt_required directly within the before_request function

policy_names = ["sql_injection",
"buffer_overflow",
"request_flood",
"evasion",
"cookie_protection",
"directory_listing",
"download",
"url_regex",
"xss",
"shellcode",
"upload",
"access_control",
"credential_stuffing"]

@security_policy_.route('/<int:security_policy_id>/exception_url_list', methods=['GET', 'POST', 'PUT', 'DELETE'])
@jwt_required()
def exception_url(security_policy_id):
    
    headers = basic_auth()
    try:
        if request.method == 'GET':
            url = f'{base_url}/security_policy/{security_policy_id}/buffer_overflow/exception_url_list'
            response = make_api_request(url, method='GET', headers=headers)
            return create_response(data=response.json())

        elif request.method == 'POST':
            data = request.json
            for policy_name in policy_names:
                url = f'{base_url}/security_policy/{security_policy_id}/{policy_name}/exception_url_list'
                post_data = [
                    {
                        "status": "enable",
                        "url": data.get('url'),
                        "desc": data.get('desc')
                    }
                ]
                response = make_api_request(url, method='POST', data=post_data, headers=headers)
                print(f"Policy: {policy_name}, Success: {response.content}")
            return response.json()
        
        elif request.method == 'PUT':
            data = request.json
            for policy_name in policy_names:
                url = f'{base_url}/security_policy/{security_policy_id}/{policy_name}/exception_url_list'
                put_data = [
                    {
                        "status": "enable",
                        "id": item.get('id'),
                        "url": item.get('url'),
                        "desc": item.get('desc')
                    } for item in data
                ]
                print(put_data)
                response = make_api_request(url, method='PUT', data=put_data, headers=headers)
                print(f"Policy: {policy_name}, Success: {response.content}")
            return response.json()
        
        elif request.method == 'DELETE':
            data = request.json
            delete_data = [{'id': item.get('id')} for item in data]
            for policy_name in policy_names:

                url = f'{base_url}/security_policy/{security_policy_id}/{policy_name}/exception_url_list'
                response = make_api_request(url, method='DELETE', data=delete_data, headers=headers)
                print(f"Policy: {policy_name}, Success: {response.content}")
            return response.json()
    except requests.exceptions.RequestException as e:
        # API 요청 중에 오류가 발생한 경우 처리
        error_message = f"API 요청 중 오류 발생: {str(e)}"
        return jsonify({'error': error_message}), 500

    except Exception as e:
        # 기타 예외가 발생한 경우 처리
        error_message = f"알 수 없는 오류 발생: {str(e)}"
        return jsonify({'error': error_message}), 500
    
@security_policy_.route('/<int:security_policy_id>/exception_ip_list', methods=['GET', 'POST', 'PUT', 'DELETE'])
@jwt_required()
def exception_ip_list(security_policy_id):
    headers = basic_auth()

    try:
        if request.method == 'GET':
            url = f'{base_url}/security_policy/{security_policy_id}/sql_injection/exception_ip_list'
            response = make_api_request(url, method='GET', headers=headers)
            return create_response(data=response.json())

        elif request.method == 'POST':
            data = request.json
            post_data = [
                        {
                            "status": "enable",
                            "version": item.get('version'),
                            "client_ip": item.get('client_ip'),
                            "server_ip": '172.31.0.194',
                            "desc": item.get('desc')
                        } for item in data
                ]
            for policy_name in policy_names:
                url = f'{base_url}/security_policy/{security_policy_id}/{policy_name}/exception_ip_list'
                
                response = make_api_request(url, method='POST', data=post_data, headers=headers)
                print(f"Policy: {policy_name}, Success: {response.content}")
            return response.json()
        elif request.method == 'PUT':
            data = request.json
            put_data = [
                    {
                        "id": item.get('id'),
                        "status": "enable",
                        "version": item.get('version'),
                        "client_ip": item.get('client_ip'),
                        "client_mask": item.get('client_mask'),
                        "server_ip": '172.31.0.194',
                        "server_mask": '32',
                        "desc": item.get('desc')
                    } for item in data
                ]
            for policy_name in policy_names:
                url = f'{base_url}/security_policy/{security_policy_id}/{policy_name}/exception_ip_list'
               
                response = make_api_request(url, method='PUT', data=put_data, headers=headers)
                print(f"Policy: {policy_name}, Success: {response.content}")
            return response.json()
        elif request.method == 'DELETE':
            data = request.json
            delete_data = [{'id': item.get('id')} for item in data]

            for policy_name in policy_names:
                url = f'{base_url}/security_policy/{security_policy_id}/{policy_name}/exception_ip_list'                
                response = make_api_request(url, method='DELETE', data=delete_data, headers=headers)
                print(f"Policy: {policy_name}, Success: {response.content}")
            return response.json()
    except requests.exceptions.RequestException as e:
        # API 요청 중에 오류가 발생한 경우 처리
        error_message = f"API 요청 중 오류 발생: {str(e)}"
        return jsonify({'error': error_message}), 500

    except Exception as e:
        # 기타 예외가 발생한 경우 처리
        error_message = f"알 수 없는 오류 발생: {str(e)}"
        return jsonify({'error': error_message}), 500
    
@security_policy_.route('/<int:security_policy_id>/apply_url_list', methods=['GET', 'POST', 'PUT', 'DELETE'])
@jwt_required()
def apply_url_list(security_policy_id):
    headers = basic_auth()

    try:
        if request.method == 'GET':
            url = f'{base_url}/security_policy/{security_policy_id}/sql_injection/apply_url_list'
            response = make_api_request(url, method='GET', headers=headers)
            return create_response(data=response.json())

        elif request.method == 'POST':
            data = request.json
            print(data)
            post_data = [
                    {
                        "status": "enable",
                        "url": item.get('url'),
                        "desc": item.get('desc')
                    } for item in data ]
            for policy_name in policy_names:
                url = f'{base_url}/security_policy/{security_policy_id}/{policy_name}/apply_url_list'
                
                response = make_api_request(url, method='POST', data=post_data, headers=headers)
                print(f"Policy: {policy_name}, Success: {response.content}")
            return response.json()
        elif request.method == 'PUT':
            data = request.json
            put_data = [
                    {
                        "status": "enable",
                        "id": item.get('id'),
                        "url": item.get('url'),
                        "desc": item.get('desc')
                    } for item in data ]
            for policy_name in policy_names:
                url = f'{base_url}/security_policy/{security_policy_id}/{policy_name}/apply_url_list'
                
                response = make_api_request(url, method='PUT', data=put_data, headers=headers)
                print(f"Policy: {policy_name}, Success: {response.content}")
            return response.json()
    
        elif request.method == 'DELETE':
            data = request.json
            id_list = [{"id": item.get('id')} for item in data]
            for policy_name in policy_names:
                url = f'{base_url}/security_policy/{security_policy_id}/{policy_name}/apply_url_list'

                response = make_api_request(url, method='DELETE', data=id_list, headers=headers)
                print(f"Policy: {policy_name}, Success: {response.content}")
            return response.json()
    except requests.exceptions.RequestException as e:
        # API 요청 중에 오류가 발생한 경우 처리
        error_message = f"API 요청 중 오류 발생: {str(e)}"
        return jsonify({'error': error_message}), 500

    except Exception as e:
        # 기타 예외가 발생한 경우 처리
        error_message = f"알 수 없는 오류 발생: {str(e)}"
        return jsonify({'error': error_message}), 500
    
    
@security_policy_.route('/<int:security_policy_id>/apply_ip_list', methods=['GET', 'POST', 'PUT', 'DELETE'])
@jwt_required()
def apply_ip_list(security_policy_id):
    headers = basic_auth()

    try:
        if request.method == 'GET':
            url = f'{base_url}/security_policy/{security_policy_id}/sql_injection/apply_ip_list'
            response = make_api_request(url, method='GET', headers=headers)
            return create_response(data=response.json())

        elif request.method == 'POST':
            data = request.json
            print(data)
            post_data = [
                        {
                            "status": "enable",
                            "version": item.get('version'),
                            "client_ip": item.get('client_ip'),
                            "server_ip": '172.31.0.194',
                            "desc": item.get('desc')
                        } for item in data
                ] 
            for policy_name in policy_names:
                url = f'{base_url}/security_policy/{security_policy_id}/{policy_name}/apply_ip_list'
                
                response = make_api_request(url, method='POST', data=post_data, headers=headers)
                print(f"Policy: {policy_name}, Success: {response.content}")
            return response.json()
        elif request.method == 'PUT':
            data = request.json
            put_data = [
                    {
                        "id": item.get('id'),
                        "status": "enable",
                        "version": item.get('version'),
                        "client_ip": item.get('client_ip'),
                        "client_mask": item.get('client_mask'),
                        "server_ip": '172.31.0.194',
                        "server_mask": '32',
                        "desc": item.get('desc')
                    } for item in data
                ]
            for policy_name in policy_names:
                url = f'{base_url}/security_policy/{security_policy_id}/{policy_name}/apply_ip_list'
                
                response = make_api_request(url, method='PUT', data=put_data, headers=headers)
                print(f"Policy: {policy_name}, Success: {response.content}")
            return response.json()
        
        elif request.method == 'DELETE':
            data = request.json
            id_list = [{"id": item.get('id')} for item in data]
            for policy_name in policy_names:
                url = f'{base_url}/security_policy/{security_policy_id}/{policy_name}/apply_ip_list'
                response = make_api_request(url, method='DELETE', data=id_list, headers=headers)
                print(f"Policy: {policy_name}, Success: {response.content}")
            return response.json()
    except requests.exceptions.RequestException as e:
        # API 요청 중에 오류가 발생한 경우 처리
        error_message = f"API 요청 중 오류 발생: {str(e)}"
        return jsonify({'error': error_message}), 500

    except Exception as e:
        # 기타 예외가 발생한 경우 처리
        error_message = f"알 수 없는 오류 발생: {str(e)}"
        return jsonify({'error': error_message}), 500
    


"""
GET 차단 IP 불러오기
"""
@security_policy_.route('/<int:security_policy_id>/block_ip_filter/ip_list', methods=['GET'])
@jwt_required()
def get_block_ip_filter(security_policy_id) :
    headers = basic_auth()
    try : 
        url = f'{base_url}/security_policy/{security_policy_id}/request_user_define_filter/filter_list/1/inspection_list'
        response = make_api_request(url, method='GET', headers=headers)
        data = json.loads(response.content.decode('utf-8'))

        datalist = []
        for item in data :
            if(item['data_type'] == 'ip') :
                datalist.append(BlockIPDto(id=item['id'], ip=item['value'].split('/')[0], subnetmask=item['value'].split('/')[1], desc=item['variable']).__dict__)
        return create_response(data=datalist)
    except Exception as e:
            return create_response(success=True, message=e, status_code = 500)


"""
POST 차단 IP 추가하기
"""
@security_policy_.route('/<int:security_policy_id>/block_ip_filter/ip_list', methods=['POST'])
@jwt_required()
def create_block_ip_filter(security_policy_id) :
    try : 
        url = f'{base_url}/security_policy/{security_policy_id}/request_user_define_filter/filter_list/1/inspection_list'
        data = request.json

        post_data = [{
            "data_type" : "ip",
            "variable": "def",
            "value": data.get('ip') + "/" + str(data.get('subnetmask')),
            "condition": "include"
        }]
        response = make_api_request(url, method='POST', data=post_data, headers=headers)
        print(response)
        return response.json()
    except Exception as e:
        return create_response(success=True, message=e, status_code = 500)
    

"""
PUT 차단 IP 수정하기
"""
@security_policy_.route('/<int:security_policy_id>/block_ip_filter/ip_list', methods=['PUT'])
@jwt_required()
def update_block_ip_filter(security_policy_id) :
    try :
        url = f'{base_url}/security_policy/{security_policy_id}/request_user_define_filter/filter_list/1/inspection_list'
        data = request.json
        post_data = [{
            "id": data.get('id'),
            "data_type" : "ip",
            "value": data.get('ip') + "/" + data.get('subnetmask'),
            "condition": "include",
        }]
        response = make_api_request(url, method='PUT', data=post_data, headers=headers)
        return response.json()
    except Exception as e:
        return create_response(success=True, message=e, status_code = 500)


"""
DELETE 차단 IP 삭제하기
"""
@security_policy_.route('/<int:security_policy_id>/block_ip_filter/ip_list', methods=['DELETE'])
@jwt_required()
def delete_block_ip_filter(security_policy_id) :
    try : 
        url = f'{base_url}/security_policy/{security_policy_id}/request_user_define_filter/filter_list/1/inspection_list'
        data = request.json
        id_list = [{"id": item.get('id')} for item in data]
        response = make_api_request(url, method='DELETE', data=id_list, headers=headers)
        return response.json()
    except Exception as e:
        return create_response(success=True, message=e, status_code = 500)

    

@security_policy_.route('/security-settings/policy-details/<policy_name>/information', methods=['GET'])
@jwt_required()
def get_policy_infomation_signature(policy_name):
    external_url = "https://wf.awstest.piolink.net:8443/api/kui/api/v3/information/signature"
    headers = basic_auth()
    response = make_api_request(external_url, 'GET', headers)

    if response is not None and response.status_code == 200:
        data = response.json()
        print(data)
        # extracted_data = [
        #     {
        #         "origin_sig_id": item.get("origin_sig_id"),
        #         "severity": item.get("severity"),
        #         "ko_description": item.get("ko_description"),
        #         "poc_example": item.get("poc_example")
        #     }
        #     for item in data
        # ]
        return data
    return jsonify({"error": "데이터를 가져오지 못했습니다."}), 500
    