# utils.py
from flask import jsonify, session
from flask_bcrypt import Bcrypt
from decouple import config as config_
import requests
import urllib3
import json
import policy_data
from urllib.parse import urlparse
import ipaddress
import base64

bcrypt = Bcrypt()
invalid_tokens = set()

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning) #지우시요 나중에

def hash_password(password):
    return bcrypt.generate_password_hash(password).decode('utf-8')

def make_api_request(url, method="GET", headers=None, data=None):
    try:
        if method == "GET":
            response = requests.get(url, headers=headers, verify=False)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data, verify=False)
        elif method == "PUT":
            response = requests.put(url, headers=headers, json=data, verify=False)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers, json=data, verify=False)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")

        response.raise_for_status()
        return response
    except requests.exceptions.RequestException as e:
        print(f"Error in API request: {e}")
        return None

def basic_auth():
    credentials = f"{config_('NAME')}:{config_('PASSWORD')}"
    base64_credentials = base64.b64encode(credentials.encode('utf-8')).decode('utf-8')
    return {'Authorization': f'Basic {base64_credentials}'}
    


# def generate_token():
#     post_data = {
#         "username": config_('NAME'),
#         "password": config_('PASSWORD'),
#         "otp_code": config_('OTP_CODE')
#     }
#     external_url = "https://wf.awstest.piolink.net:8443/api/v3/system/token"
#     headers = {}
    
#     response = make_api_request(external_url, "POST", headers, post_data)
    
#     if response:
#         try:
#             response.raise_for_status()
#             response_data = response.json()
#             token = response_data.get('information', [{}])[0].get('token')
#             if token:
#                 print(f"Token retrieved successfully")
#                 return token
#             else:
#                 print("Token not found in the response.")
#                 return None
#         except requests.exceptions.RequestException as e:
#             print(f"Error in API request: {e}")
#             return None
#     else:
#         print("Failed to make API request.")
#         return None




def determine_ip_version(ip):
    try:
        ip_obj = ipaddress.ip_address(ip)
        return "ipv4" if ip_obj.version == 4 else "ipv6"
    except ValueError:
        return None




#### 수정 혹은 제거 코드들######
# 요청을 보내고 응답 받는 함수
# def send_request(url, method, headers, data=None):
#     try:
#         if method == 'GET':
#             response = requests.get(url, headers=headers, verify=False)
#         elif method == 'POST':
#             response = requests.post(url, headers=headers, json=data, verify=False)
#         elif method == 'PUT':
#             response = requests.put(url, headers=headers, json=data, verify=False)
#         elif method == 'DELETE':
#             response = requests.delete(url, headers=headers, json=data, verify=False)
#         return response
#     except Exception as e:
#         print(f"Error sending request: {str(e)}")
#     return None


# 정책 데이터 추출 함수
# def get_policy_data(policy_name,method,data=None ):
#     # 정책별 데이터 추출 로직을 관리하는 딕셔너리
#     policy_data_extractors = {
#         "sql_injection": "sig_list",
#         "buffer_overflow": "adv_options",
#         "request_flood": "request_flood",
#         "evasion": "adv_options",
#         "cookie_protection": "adv_options",
#         "directory_listing": "sig_list",
#         "download": "sig_list",
#         "url_regex": "sig_list",
#         "xss": "sig_list",
#         "shellcode": "sig_list",
#         "upload": "sig_list",
#         "access_control": "sig_list",
#         # 다른 정책에 대한 추출 로직 추가
#     }
#     if method == 'GET':
#         external_url = "https://wf.awstest.piolink.net:8443/api/v3/security_policy/" + session['id'] + "/" + policy_name
#         headers = {'Authorization': 'token ' + session['token']}
#         response = send_request(external_url,method, headers)

#         if response is not None and response.status_code == 200:
#             data = response.json()
#             extracted_data = policy_data.policy_data_extractors[policy_name](data)
#             return jsonify(extracted_data)
#         return jsonify({"error": "데이터를 가져오지 못했습니다."}), 500
#     elif method == 'PUT':
#         external_url = "https://wf.awstest.piolink.net:8443/api/v3/security_policy/" + session['id'] + "/" + policy_name + "/" + policy_data_extractors[policy_name]
#         headers = {'Authorization': 'token ' + session['token']}
#         if policy_data_extractors[policy_name] == 'sig_list':
#             response = send_request(external_url,method, headers, data)
#             sig_list = response.json()
#             for item in sig_list:
#                 item["status"] = data['status']
#             response = send_request(external_url,method, headers, sig_list)
#         else:
#             response = send_request(external_url,method, headers, data)
        
        
# def send_policy_data(policy_name, json_file_path):
#     # JSON 파일 불러오기
#     with open(json_file_path, "r") as json_file:
#         post_data = json.load(json_file)
    
    
#     # 나머지 로직 작성

# def get_policy_information(policy_name):
#     external_url = "https://wf.awstest.piolink.net:8443/api/v3/security_policy/" + session['id'] + "/" + policy_name
#     headers = {'Authorization': 'token ' + session['token']}
#     response = send_request(external_url, 'GET', headers)

#     if response is not None and response.status_code == 200:
#         data = response.json()
#         extracted_data = [
#             {
#                 "origin_sig_id": item.get("origin_sig_id"),
#                 "severity": item.get("severity"),
#                 "ko_description": item.get("ko_description"),
#                 "poc_example": item.get("poc_example")
#             }
#             for item in data
#         ]
#         return jsonify(extracted_data)
#     return jsonify({"error": "데이터를 가져오지 못했습니다."}), 500


