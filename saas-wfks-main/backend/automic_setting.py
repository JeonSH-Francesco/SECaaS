import requests
import urllib3
from decouple import config
from models.user_application import UserApplication
from models.security_policy import SecurityPolicy
from models.domain import Domain
import base64
import json
import ipaddress
from urllib.parse import urlparse

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def print_result(operation, response):
    if response.status_code == 200:
        print(f"{operation} - Success")
    else:
        print(f"{operation} - Failed. Status code: {response.status_code}, Response content: {response.content}")

def determine_ip_version(ip):
    try:
        ip_obj = ipaddress.ip_address(ip)
        return "ipv4" if ip_obj.version == 4 else "ipv6"
    except ValueError:
        return None

def calculate_new_priority(existing_priorities):
    new_priority = 1
    while new_priority in existing_priorities:
        new_priority += 1
    return new_priority

def update_user_app_data(user_app_data, company_name, existing_priorities, security_policy_id, protocol, port, version, ip_address, domain_address):
    user_app_data["name"] = company_name
    user_app_data["desc"] = company_name
    user_app_data["priority"] = calculate_new_priority(existing_priorities)
    user_app_data["general"]["status"] = "enable"
    user_app_data["general"]["security_policy"]["id"] = security_policy_id
    user_app_data["general"]["info"]["protocol_type"] = protocol
    user_app_data["general"]["ssl_info"]["http_port"] = int(port)
    user_app_data["general"]["apply_ip_list"][0]["port"] = int(port)
    user_app_data["general"]["apply_ip_list"][0]["version"] = version
    user_app_data["general"]["apply_ip_list"][0]["ip"] = ip_address
    user_app_data["general"]["domain_list"][0]["domain"] = domain_address

    user_app_data['general']['apply_ip_list'] = [user_app_data['general']['apply_ip_list'][0]]
    user_app_data['general']['domain_list'] = [user_app_data['general']['domain_list'][0]]

def update_security_policy_settings(external_url, headers, security_policy_json, setting_name, status):
    try:
        if setting_name == 'sig_list':
            updated_data = [{"id": item.get("id"), "status": status, "block_id": item.get("block_id")} for item in security_policy_json]
        elif isinstance(security_policy_json, dict):
            updated_data = {key: status for key, value in security_policy_json.items() if key.endswith("_status") and isinstance(value, str)}
        else:
            raise ValueError("Unsupported security_policy_json type")

        response = make_api_request(external_url, "PUT", headers=headers, data=updated_data)

        if response:
            response.raise_for_status()
            print(f"Settings updated successfully for {setting_name}")
        else:
            print(f"Failed to update settings for {setting_name}. Status code: {response.status_code}, Response content: {response.content}")
    except ValueError as ve:
        print(f"Error in update_security_policy_settings: {ve}")
    except requests.exceptions.RequestException as e:
        print(f"Error in API request: {e}")

def basic_auth():
    credentials = f"{config('NAME')}:{config('PASSWORD')}"
    base64_credentials = base64.b64encode(credentials.encode('utf-8')).decode('utf-8')
    return {'Authorization': f'Basic {base64_credentials}'}

def make_api_request(url, method="GET", headers=None, data=None):
    try:
        if method == "GET":
            response = requests.get(url, headers=headers, verify=False)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data, verify=False)
        elif method == "PUT":
            response = requests.put(url, headers=headers, json=data, verify=False)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")

        response.raise_for_status()
        return response
    except requests.exceptions.RequestException as e:
        print(f"Error in API request: {e}")
        return None
def get_existing_priorities(url, headers):
    try:
        response = requests.get(url, headers=headers, verify=False)
        return set(item["priority"] for item in response.json())
    except requests.exceptions.RequestException as e:
        print(f"Error in get_existing_priorities: {e}")
        
def create_security_policy(data):
    security_policy_url = "https://wf.awstest.piolink.net:8443/api/v3/security_policy"
    headers = basic_auth()
    post_data = {"name": data.get('companyName'),"status": "enable","create_type": "sync","vendor_policy": "standard", "vendor_policy_block_status": "disable","sync_id": 4}
    response = make_api_request(security_policy_url, "POST", headers, post_data)
    if response:
        if response.status_code == 200:
            print("Security policy created successfully.")
        else:
            print(f"Failed to create security policy. Status code: {response.status_code}, Response content: {response.content}")
            raise Exception("보안 정책 생성 실패")

def get_security_policy_id(company_name):
    get_security_policy_url = "https://wf.awstest.piolink.net:8443/api/v3/security_policy?depth=1"
    headers = basic_auth()

    response = make_api_request(get_security_policy_url, "GET", headers)

    if response:
        if response.status_code == 200:
            security_policy_data = response.json()
            return next((item["id"] for item in security_policy_data["security_policy_list"] if item["name"] == company_name), None)
        else:
            print(f"Failed to get security policy. Status code: {response.status_code}, Response content: {response.content}")
            raise Exception("보안 정책 불러오기 실패")
    return None

### 보안 정책 설정
def configure_security_policies(data, headers):
    create_security_policy(data)
    security_policy_id = get_security_policy_id(data.get('companyName'))
    if security_policy_id:
        print(f"Security policy ID: {security_policy_id}")
        status = 'block'
        # filename = './json/security_policy_name.json'
        # with open(filename, 'r') as json_file:
        #     policy_data_extractors = json.load(json_file)

        # for policy_name, setting_names in policy_data_extractors.items():
        
            
        #     if isinstance(setting_names, list):
        #         for setting_name in setting_names:
                    
        #             policy_url = f"https://wf.awstest.piolink.net:8443/api/v3/security_policy/{security_policy_id}/{policy_name}"
        #             response = make_api_request(policy_url, "GET", headers)
        #             security_policy_json = response.json()
        #             update_security_policy_settings(policy_url, headers, security_policy_json, setting_name, status)
        #     else:
        #         policy_url = f"https://wf.awstest.piolink.net:8443/api/v3/security_policy/{security_policy_id}/{policy_name}/{setting_names}"
        #         response = make_api_request(policy_url, "GET", headers)
        #         security_policy_json = response.json()
        #         update_security_policy_settings(policy_url, headers, security_policy_json, setting_names, status)
        
        security_policy_data = {"wf_security_policy_id":security_policy_id,"request_flood":status,"sql_injection":status,"url_regex":status,"xss":status,"directory_listing":status,"shellcode":status,"download":status,"uploadfile":status,"access_control":status,"evasion":status,"credential_stuffing":status,"cookie_protection":status,"buffer_overflow":status}
        security_policy = SecurityPolicy.create(**security_policy_data)
        
        return security_policy.id,security_policy_id
    else:
        print("Security policy ID None")
        return None,None


def create_user_application(data, headers, security_policy_id, protocol, port, ip_version, domain_parsed, ip_address,companyName):
    user_application_url = "https://wf.awstest.piolink.net:8443/api/v3/app"

    response = make_api_request(user_application_url, "GET", headers)

    if response:
        existing_priorities = get_existing_priorities(user_application_url, headers)
        filename = './json/application.json'

        with open(filename, 'r') as json_file:
            user_app_data = json.load(json_file)

        update_user_app_data(
            user_app_data, 
            companyName,
            existing_priorities, 
            security_policy_id, 
            protocol, 
            port, 
            ip_version,
            "172.31.0.194", 
            domain_parsed
        )
        
        user_app_data = json.dumps(user_app_data, indent=4)
        response = make_api_request(user_application_url, "POST", headers, json.loads(user_app_data))

        if response and response.status_code == 200:
            print('Application created successfully.')
        else:
            print(f"Failed to create user application. Status code: {response.status_code}, Response content: {response.content}")
            raise Exception("애플리게이션 생성 실패")


def get_created_app_id(headers, company_name):
    try:
        user_application_url = "https://wf.awstest.piolink.net:8443/api/v3/app"
        response = make_api_request(user_application_url, "GET", headers)

        # app_id를 찾아 반환합니다.
        app_id = next((item["app_id"] for item in response.json() if item.get("name") == company_name), None)

        if app_id is not None:
            print(f"Application created successfully. App_id: {app_id}")
        else:
            print("Failed to retrieve app_id.")
            raise Exception("애플리게이션 불러오기 실패")

        return app_id

    except requests.exceptions.RequestException as e:
        print(f"Error in get_created_app_id: {e}")

    return None

def automic_setting(data,userId):
    try:
        # 데이터 관련 정보들 변수에 저장
        protocol = "https" if data["domain_address"].startswith('https') == "https" else "http"
        port = 443 if protocol == "https" else 80
        ip_version = determine_ip_version(data["IP_address"])
        parsed_url = urlparse(data["domain_address"])
        domain_parsed = parsed_url.netloc.split(".")[-2] + "." + parsed_url.netloc.split(".")[-1]
        companyName = data.get('companyName')
        ip_address = data.get('IP_address')
        
        headers = basic_auth()
        security_policy_table_id,security_policy_id = configure_security_policies(data, headers)
        
        if security_policy_table_id:
            create_user_application(data, headers, security_policy_id, protocol, port, ip_version, domain_parsed, ip_address,companyName)
            app_id = get_created_app_id(headers, companyName)
            
            # Source NAT Status
            source_nat_status_url = f'https://wf.awstest.piolink.net:8443/api/v3/app/{app_id}/load_balance/source_nat_status'
            source_nat_status_data = {"status": "enable"}
            source_nat_status_response = requests.post(source_nat_status_url, headers=headers, json=source_nat_status_data, verify=False)
            print_result("Source NAT Status", source_nat_status_response)
            
            # Source NAT IP List
            source_nat_ip_list_url = f'https://wf.awstest.piolink.net:8443/api/v3/app/{app_id}/load_balance/source_nat_ip_list'
            source_nat_ip_list_data = {"status": "enable", "client_ip": "172.31.0.194", "version": ip_version, "desc": companyName}
            source_nat_ip_list_response = requests.post(source_nat_ip_list_url, headers=headers, json=source_nat_ip_list_data, verify=False)
            print_result("Source NAT IP List", source_nat_ip_list_response)

            # Server List
            server_list_url = f'https://wf.awstest.piolink.net:8443/api/v3/app/{app_id}/load_balance/server_list'
            server_list_data = [{"status": "enable", "version": ip_version, "server_name": companyName, "server_ip": ip_address, "server_port": int(port), "priority": 1, "desc": companyName}]
            server_list_response = requests.post(server_list_url, headers=headers, json=server_list_data, verify=False)
            print_result("Server List", server_list_response)

            # Group List
            group_list_url = f'https://wf.awstest.piolink.net:8443/api/v3/app/{app_id}/load_balance/group_list'
            group_list_data = [{"status": "enable", "group_name": companyName+'_group', "lb_algorithm": "round-robin", "server_id": "1", "desc": companyName+'_group'}]
            group_list_response = requests.post(group_list_url, headers=headers, json=group_list_data, verify=False)
            print_result("Group List", group_list_response)

            # Rule List
            rule_list_url = f'https://wf.awstest.piolink.net:8443/api/v3/app/{app_id}/load_balance/rule_list'
            rule_list_data = [{"status": "enable", "priority": 100, "pattern_id": 0, "group_id": 1, "desc": companyName+'_rule'}]
            rule_list_response = requests.post(rule_list_url, headers=headers, json=rule_list_data, verify=False)
            print_result("Rule List", rule_list_response)
            
            #database create
            app_data = {"wf_app_id":app_id,"security_policy_id":security_policy_table_id,"user_id":userId,"protocol":protocol,"ip_ver":ip_version,"ip_addr":ip_address,"port":port,"server_name":companyName,"status":"enable"}
            user_application = UserApplication.create(**app_data)
            domain_data = {"name":domain_parsed,"user_application_id":user_application.id,"desc":companyName}
            domain = Domain.create(**domain_data)
    except Exception as e:
        print(f"An error occurred: {e}")

        

