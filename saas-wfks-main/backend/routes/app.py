from flask import Blueprint, session, jsonify, request
import requests
from utils import make_api_request,basic_auth
import json
import urllib3
from models.domain import Domain,datetime
from models.log import Log
from models.user_application import UserApplication
from models.security_policy import SecurityPolicy
from models.domain import Domain
import base64
from models import *
from datetime import timedelta,timezone
from collections import Counter
from sqlalchemy import func
from flask_jwt_extended import jwt_required,get_jwt_identity
from sqlalchemy.orm import joinedload
import logging
app = Blueprint('app', __name__, url_prefix='/api/v1/app')



urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

@app.route('/<int:app_id>/dashboard', methods=['GET'])
#@jwt_required()
def dashboard(app_id):
    existing_logs = Log.get_app_by_logs(app_id)
    if existing_logs:
        response_data = fetch_dashboard_data(app_id)

        if response_data:
            return jsonify(response_data), 200

        return jsonify({"error": "데이터를 가져오지 못했습니다."}), 500
    else:
        # Fetch logs from the external API if no existing logs are present
        return {},200
    

def fetch_dashboard_data(app_id):
    current_time = datetime.datetime.now()
    start_time_1hour_interval = current_time - timedelta(hours=1)
    log_1hour = get_logs_by_time_range(start_time_1hour_interval, current_time,app_id)
    data_timeline_response = count_occurrences_in_intervals(log_1hour,app_id)
    data_pie_response =  count_category_occurrences(log_1hour,app_id)
    start_time_1years_interval = current_time - timedelta(days=365)
    log_1year = get_logs_by_year_range(start_time_1years_interval, current_time,app_id)
    response_data = {"detect_attack": data_timeline_response,
                     "attack_name": data_pie_response,
                     "tarffic":log_1year}
    return response_data

def count_category_occurrences(logs,app_id):
    # Extract category values from logs
    categories = [log.category for log in logs if log.app_id == app_id]

    # Use Counter to count occurrences of each category
    category_counts = Counter(categories)

    return category_counts
def get_logs_by_time_range(start_time, end_time,app_id):
    # Retrieve all logs within the time range
    logs = db.session.query(Log).filter(
        Log.app_id == app_id,
        # Log.timestamp >= start_time,
        # Log.timestamp < end_time
    ).all()
    return logs

def get_logs_by_year_range(start_time, end_time,app_id):
    result = db.session.query(
    func.DATE_FORMAT(Log.timestamp, '%Y-%m').label('month'),
    func.count().label('count')
    ).filter(
        Log.app_id == app_id,
        # Log.timestamp >= start_time
    ).group_by(func.DATE_FORMAT(Log.timestamp, '%Y-%m')).all()

    # Create a dictionary to store month-wise log counts
    month_counts = [{"interval": month, "count": count} for month, count in result]
    def extract_date(interval):
        return datetime.datetime.strptime(interval, '%Y-%m')

    month_counts_sorted = sorted(month_counts, key=lambda x: extract_date(x["interval"]))

    return month_counts_sorted

def count_occurrences_in_intervals(logs, app_id):
    current_time = datetime.datetime.now() + timedelta(hours=9)  # Adding 9 hours to the current time
    hours_to_count = 24  # Count occurrences for the past 24 hours

    # Calculate start and end time for the past 24 hours
    end_time = current_time
    start_time = current_time - timedelta(hours=hours_to_count)

    # Create a list to store counts for each 1-hour interval
    interval_counts = []

    # Iterate over each hour in the past 24 hours
    while current_time >= start_time:
        interval_start = current_time - timedelta(hours=1)
        interval_end = current_time

        count = sum(1 for log in logs if interval_start <= log.timestamp <= interval_end and log.app_id == app_id)
        interval_counts.append({"interval": f"{interval_start} - {interval_end}", "count": count})

        current_time = interval_start

    return interval_counts


@app.route('/<int:app_id>/logs', methods=['GET'])
#@jwt_required()
def security_logs(app_id):
    # Check if logs are already present in the database
    existing_logs = Log.get_app_by_logs(app_id)

    if existing_logs:

        log_s = [
                    {
                        'no': log.no,
                        'timestamp': log.timestamp,
                        'category': log.category,
                        'app_name': log.app_name,
                        'risk_level': log.risk_level,
                        'sig_level': log.sig_level,
                        'host': log.host,
                        'url': log.url,
                        'attacker_ip': log.attacker_ip,
                        'server_ip_port': log.server_ip_port,
                        'country': log.country,
                        'action': log.action,
                        'app_id': log.app_id,
                        "total_duplicates":log.total_duplicates
                    }
                    for log in existing_logs
                ]
        
        
            
        # Return filtered logs from the database with pagination and unique hosts
        return jsonify({
            "database_logs": log_s,
            "hosts": list(set(log.host for log in existing_logs)),

        }), 200
    else:
        # Fetch logs from the external API
        url = 'https://wf.awstest.piolink.net:8443/cgi-bin/logviewer/'
        headers = {'Cookie': 'PB_LANG=ko; UI=wafwaf'}
        encoded_string = "eyJhY3Rpb24iOiJzZWxlY3QiLCJmaWx0ZXIiOnsiZGV0YWlsIjp7fSwiYmFzaWMiOnsiYXBwX2lkIjpbIjEiXX0sInBlcmlvZCI6IjI1OTIwMDAifSwibGltaXQiOjEwMCwicGFnZVBhcmFtIjpudWxsfQ="

        # Decode the Base64 string
        decoded_bytes = base64.urlsafe_b64decode(encoded_string + '=' * (-len(encoded_string) % 4))

        # Decode the bytes to UTF-8 string
        decoded_string = decoded_bytes.decode('utf-8')
        # JSON 문자열을 파이썬 객체로 변환
        decoded_data = json.loads(decoded_string)

        # app_id 업데이트
        decoded_data['filter']['basic']['app_id'] = [app_id]

        # 다시 JSON 문자열로 변환
        updated_encoded_string = json.dumps(decoded_data)
        
        # Encode the UTF-8 string to bytes
        encoded_bytes = decoded_string.encode('utf-8')

        # Encode the bytes to Base64
        encoded_string = base64.urlsafe_b64encode(encoded_bytes).decode()

   
        data = {
            'log_type': 'security',
            'param': encoded_string
        }


        response = requests.post(url, data=data, verify=False, headers=headers)

        if response.status_code == 200:
            data = response.json()
            app_name = request.args.get('app_name', 'pweb')  # 일단 테스트용

            # 'logs' 키 확인 추가
            logs_data = data.get('result', {}).get('logs', [])

            # 'rows' 안에 있는 데이터에서 "Application"이 주어진 `app_name`과 일치하는 로그를 추출
            app_logs = [log for log_data in logs_data for log in log_data.get("rows", []) if log[3] == app_name]

            # Save logs to the database
            for log_data in app_logs:
                timestamp_epoch = log_data[1]
                timestamp_datetime = datetime.datetime.utcfromtimestamp(timestamp_epoch).replace(tzinfo=timezone.utc)
                decoded_url = base64.b64decode(log_data[6]).decode('utf-8')
                host = base64.b64decode(log_data[7])
                formatted_log = {
                    'no': log_data[0],
                    'timestamp': timestamp_datetime,  
                    'category': log_data[2]['text'], 
                    'app_name': log_data[3],
                    'risk_level': log_data[4]['text'], 
                    'sig_level': log_data[5]['text'], 
                    'host': host,
                    'url': decoded_url,
                    'attacker_ip': log_data[8],
                    'server_ip_port': log_data[9],
                    'country': log_data[10]['text'], 
                    'action': log_data[11]['text'],
                    'app_id' : app_id
                }
                Log.add_log(formatted_log)
            
            existing_logs = Log.get_app_by_logs(app_id)
            
            log_s = [
                    {
                        'no': log.no,
                        'timestamp': log.timestamp,
                        'category': log.category,
                        'app_name': log.app_name,
                        'risk_level': log.risk_level,
                        'sig_level': log.sig_level,
                        'host': log.host,
                        'url': log.url,
                        'attacker_ip': log.attacker_ip,
                        'server_ip_port': log.server_ip_port,
                        'country': log.country,
                        'action': log.action,
                        'app_id': log.app_id,
                        "total_duplicates":log.total_duplicates
                    }
                    for log in existing_logs
                ]
        
        
            
            # Return both logs from the database and external API with pagination and unique hosts
            return jsonify({
                "database_logs": log_s,
                "hosts": list(set(log.host for log in existing_logs)),
            }), 200
        else:
            return jsonify({"error": "데이터를 가져오지 못했습니다."}), 500


@app.route('/<int:app_id>/logs/refresh', methods=['GET'])
#@jwt_required()
def logs_refresh(app_id):
    log_s = refresh_logs(app_id)
    return jsonify({
            "database_logs": log_s,
        }), 200

@app.route('/<int:app_id>/domain-list', methods=['GET', 'PUT', 'POST','DELETE'])
#@jwt_required()
def manage_domain_settings(app_id):

    domain_url = f"https://wf.awstest.piolink.net:8443/api/v3/app/{app_id}/general/domain_list"
    server_list_url = f'https://wf.awstest.piolink.net:8443/api/v3/app/{app_id}/load_balance/server_list'
        

    headers = basic_auth()
    user_id = request.args.get('user_id')

    try:
        if request.method == 'GET':
            
            user_app = UserApplication.get_apps_by_user_id(user_id=user_id)
    
            
            apps = [
                {
                    "id": item.id,
                    "ip": item.ip_addr,
                    "version": item.ip_ver,
                    "port": item.port,
                    "status": item.status,
                    "server_name": item.server_name,
                    "domain_list" : Domain.get_domains_by_app_id(item.id),
                } for item in user_app
            ]
            
            response = make_api_request(server_list_url, method='GET', headers=headers)
            data = response.json()

            if response and response.status_code == 200:
                data = response.json()
                for app in apps:
                    for server_list_data in data:
                        if app['ip'] == server_list_data['server_ip']:
                            app['server_id'] = server_list_data['id']

                        
            else:
                return jsonify({"error": "Failed to retrieve domain data."}), 500
            
            response = make_api_request(domain_url, method='GET', headers=headers)
            data = response.json()
            if response and response.status_code == 200:
                data = response.json()
                for app in apps:
                    for domain_data in data:
                        for domain_app in app['domain_list']:
                            if domain_app['domain'] == domain_data['domain']:
                                domain_app['id'] = domain_data['id']

                return jsonify(apps), 200
            else:
                return jsonify({"error": "Failed to retrieve domain data."}), 500

        elif request.method == 'PUT':
            app_data = request.json
            server_name = app_data.get("servername")

            # Extracting information from the nested dictionary
            app_info = {
                "id": app_data.get("server_id"),
                "server_ip": app_data.get("ip"),
                "server_port": int(app_data.get("port")),
                "status": app_data.get("status"),
                "version":app_data.get("version"),
                "priority": 1,
                "desc":app_data.get("servername")
            }
            # Extracting information from the nested list of dictionaries
            domain_list = []

            for domain_data in app_data.get("domain_list", []):
                domain_info = {
                    "domain": domain_data.get("domain"),
                    "id": domain_data.get("id"),
                    "desc": domain_data.get("desc", ""),  # Assuming "desc" might not always be present
                }
                domain_list.append(domain_info)
                response = make_api_request(domain_url, method='PUT', data=domain_info, headers=headers)
                if response.status_code == 200:
                    Domain.update_domain_by_id(domain_data.get("table_id"), name=domain_data.get("domain"), desc=domain_data.get("desc", ""))
                    
                else:
                    return {"Failed to domain_list."},500   
            server_list_url = f'https://wf.awstest.piolink.net:8443/api/v3/app/{app_id}/load_balance/server_list'
         
            response = make_api_request(server_list_url, method='PUT', headers=headers,data=app_info)
            
            if response and response.status_code == 200:
                app_data = {"ip_ver": app_data.get("version"), "ip_addr": app_data.get("ip"), "port": app_data.get("port"), "status": app_data.get("status"), "server_name": server_name}
                UserApplication.update_app_by_id(Domain.user_application_id, app_data)
                return response.json(), 200
            else:
                return {"Failed to update server_list."}, 500
                    

        elif request.method == 'POST':
            data = request.json
            status = data.get("status")
            domain_list = data.get("domain_list")
            port = data.get("port")
            ip_ver = "ipv4" if ":" not in data.get("ip") else "ipv6"
            domains = [item.get("domain") for item in domain_list]
            descs = [item.get("desc") for item in domain_list]
            
            app_database = UserApplication.get_app_by_wf_app_id(app_id)
            
            if app_database:
                security_policy_id = app_database.security_policy_id
                server_list_data = [{"status": status, "version":ip_ver , "server_name": data.get("server_name"), "server_ip": data.get("ip"), "server_port": str(data.get('port')),  "desc": ""}]
                print(server_list_data)
                server_list_response = make_api_request(server_list_url,method="POST", headers=headers, data=server_list_data)
                if server_list_response and server_list_response.status_code == 200:
                    protocol = "https" if isinstance(port, list) and 443 in port else "http"
                    app_data = {"wf_app_id":app_id,"security_policy_id":security_policy_id,"user_id":user_id,"protocol":protocol,"ip_ver": ip_ver,"ip_addr":data.get("ip"),"port":data.get("port"),"server_name":data.get("server_name"),"status":status}
                    
                    # # Group List
                    # group_list_url = f'https://wf.awstest.piolink.net:8443/api/v3/app/{app_id}/load_balance/group_list'
                    # group_list_data = [{"status": "enable", "group_name": companyName+'_group', "lb_algorithm": "round-robin", "server_id": "1", "desc": companyName+'_group'}]
                    # group_list_response = requests.post(group_list_url, headers=headers, json=group_list_data, verify=False)
                    # print_result("Group List", group_list_response)

                    # # Rule List
                    # rule_list_url = f'https://wf.awstest.piolink.net:8443/api/v3/app/{app_id}/load_balance/rule_list'
                    # rule_list_data = [{"status": "enable", "priority": 100, "pattern_id": 0, "group_id": 1, "desc": companyName+'_rule'}]
                    # rule_list_response = requests.post(rule_list_url, headers=headers, json=rule_list_data, verify=False)
                    # print_result("Rule List", rule_list_response)
                    
                    user_application = UserApplication.create(**app_data)
                    
                    for domain,desc in zip(domains,descs):
                        data = {
                            "status": status,
                            "domain": domain,
                            "desc": desc
                        }
                        response = make_api_request(domain_url, method='POST', headers=headers,data=data)
                        
                        if response and response.status_code == 200:
                            new_domain = Domain.create(
                                name=domain,
                                user_application_id=user_application.id,
                                updated_at=datetime.datetime.utcnow(),
                                desc=desc,
                            )
                        else:
                            return {'error : domain_url response failure'},500
                    return response.json(), 200
                else:        
                    return jsonify({"error": "server_list_response."}), 500# Server List
            else:
                return {"Error : app_database"}, 500

        elif request.method == 'DELETE':
            data = request.json
            id = data.get("server_id")
            post_data = [{"id": id}]

            if 'domain_list' in data:
                domain_list = data['domain_list']
            else:
                print("'domain_list' not found in data")
            domain_table_ids = [item.get('table_id') for item in domain_list]
            domain_ids = [item.get('id') for item in domain_list]
    
            for domain_id,domain_table_id in zip(domain_ids,domain_table_ids):
                domain_data = [{"id":domain_id}]
                print(domain_data)
                response = make_api_request(domain_url, method='DELETE', data=domain_data,headers=headers)

                if response and response.status_code == 200:
                    # 1. user_application_id에 해당하는 Domain 모델들을 조회
                    domain_to_delete = Domain.query.filter_by(id=domain_table_id).first()
                    db.session.delete(domain_to_delete)
                    db.session.commit()
                
                    
                else:
                    return jsonify({"error": "도메인 삭제에 실패하셨습니다.."}), 500
  
            print(post_data)
            response = make_api_request(server_list_url, method='DELETE', data=post_data,headers=headers)
            
            if response.status_code == 200:
                user_application_to_delete = UserApplication.get_app_by_id(data.get('id'))
                
                db.session.delete(user_application_to_delete)
                db.session.commit()
                
                return response.json()  
            else:
                return jsonify({"error": "도메인 삭제에 실패하셨습니다.."}), 500

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


def fetch_logs_from_external_api(app_id):
    url = 'https://wf.awstest.piolink.net:8443/cgi-bin/logviewer/'
    headers = {'Cookie': 'PB_LANG=ko; UI=wafwaf'}
    encoded_string = "eyJhY3Rpb24iOiJzZWxlY3QiLCJmaWx0ZXIiOnsiZGV0YWlsIjp7fSwiYmFzaWMiOnsiYXBwX2lkIjpbIjEiXX0sInBlcmlvZCI6IjI1OTIwMDAifSwibGltaXQiOjEwMCwicGFnZVBhcmFtIjpudWxsfQ="

    # Decode the Base64 string
    decoded_bytes = base64.urlsafe_b64decode(encoded_string + '=' * (-len(encoded_string) % 4))

    # Decode the bytes to UTF-8 string
    decoded_string = decoded_bytes.decode('utf-8')
    # JSON 문자열을 파이썬 객체로 변환
    decoded_data = json.loads(decoded_string)

    # app_id 업데이트
    decoded_data['filter']['basic']['app_id'] = [app_id]

    # 다시 JSON 문자열로 변환
    updated_encoded_string = json.dumps(decoded_data)

    # Encode the UTF-8 string to bytes
    encoded_bytes = decoded_string.encode('utf-8')

    # Encode the bytes to Base64
    encoded_string = base64.urlsafe_b64encode(encoded_bytes).decode()

    data = {
        'log_type': 'security',
        'param': encoded_string
    }

    response = requests.post(url, data=data, verify=False, headers=headers)

    if response.status_code == 200:
        data = response.json()
        app_name = request.args.get('app_name', 'pweb')  # 일단 테스트용

        # 'logs' 키 확인 추가
        logs_data = data.get('result', {}).get('logs', [])

        # 'rows' 안에 있는 데이터에서 "Application"이 주어진 `app_name`과 일치하는 로그를 추출
        app_logs = [log for log_data in logs_data for log in log_data.get("rows", []) if log[3] == app_name]

        # Save logs to the database
        for log_data in app_logs:
            decoded_url = base64.b64decode(log_data[6]).decode('utf-8')
            host = base64.b64decode(log_data[7])
            formatted_log = {
                'no': log_data[0],
                'timestamp': log_data[1],  # 수정된 부분
                'category': log_data[2]['text'],  # 수정된 부분
                'app_name': log_data[3],
                'risk_level': log_data[4]['text'],  # 수정된 부분
                'sig_level': log_data[5]['text'],  # 수정된 부분
                'host': host,
                'url': decoded_url,
                'attacker_ip': log_data[8],
                'server_ip_port': log_data[9],
                'country': log_data[10]['text'],  # 수정된 부분
                'action': log_data[11]['text'],  # 수정된 부분
                'app_id': app_id
            }
            Log.add_log(formatted_log)

        existing_logs = Log.get_app_by_logs(app_id)

        log_s = [
            {
                'no': log.no,
                'timestamp': log.timestamp,
                'category': log.category,
                'app_name': log.app_name,
                'risk_level': log.risk_level,
                'sig_level': log.sig_level,
                'host': log.host,
                'url': log.url,
                'attacker_ip': log.attacker_ip,
                'server_ip_port': log.server_ip_port,
                'country': log.country,
                'action': log.action,
                'app_id': log.app_id,
                "total_duplicates":log.total_duplicates
            }
            for log in existing_logs
        ]

        response_data = fetch_dashboard_data("data_timeline")
        if response_data:
            return jsonify(response_data),200
        


def refresh_logs(app_id):
    url = 'https://wf.awstest.piolink.net:8443/cgi-bin/logviewer/'
    headers = {'Cookie': 'PB_LANG=ko; UI=wafwaf'}
    encoded_string = "eyJhY3Rpb24iOiJzZWxlY3QiLCJmaWx0ZXIiOnsiZGV0YWlsIjp7fSwiYmFzaWMiOnsiYXBwX2lkIjpbIjEiXX0sInBlcmlvZCI6IjI1OTIwMDAifSwibGltaXQiOjEwMCwicGFnZVBhcmFtIjpudWxsfQ="

    # Decode the Base64 string
    decoded_bytes = base64.urlsafe_b64decode(encoded_string + '=' * (-len(encoded_string) % 4))

    # Decode the bytes to UTF-8 string
    decoded_string = decoded_bytes.decode('utf-8')
    # JSON 문자열을 파이썬 객체로 변환
    decoded_data = json.loads(decoded_string)

    # app_id 업데이트
    decoded_data['filter']['basic']['app_id'] = [app_id]

    # 다시 JSON 문자열로 변환
    updated_encoded_string = json.dumps(decoded_data)

    # Encode the UTF-8 string to bytes
    encoded_bytes = decoded_string.encode('utf-8')
    
    # Encode the bytes to Base64
    encoded_string = base64.urlsafe_b64encode(encoded_bytes).decode()

    data = {
        'log_type': 'security',
        'param': encoded_string
    }

    response = requests.post(url, data=data, verify=False, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        app_name = request.args.get('app_name', 'pweb')  # 일단 테스트용

        # 'logs' 키 확인 추가
        logs_data = data.get('result', {}).get('logs', [])

        # 'rows' 안에 있는 데이터에서 "Application"이 주어진 `app_name`과 일치하는 로그를 추출
        app_logs = [log for log_data in logs_data for log in log_data.get("rows", []) if log[3] == app_name]

        Log.delete_logs_id(app_id=app_id)
        # Save logs to the database
        for log_data in app_logs:
            timestamp_epoch = log_data[1]
            timestamp_datetime = datetime.utcfromtimestamp(timestamp_epoch)
            decoded_url = base64.b64decode(log_data[6]).decode('utf-8')
            host = base64.b64decode(log_data[7])
            formatted_log = {
                'no': log_data[0],
                'timestamp': timestamp_datetime,  # 수정된 부분
                'category': log_data[2]['text'],  # 수정된 부분
                'app_name': log_data[3],
                'risk_level': log_data[4]['text'],  # 수정된 부분
                'sig_level': log_data[5]['text'],  # 수정된 부분
                'host': host,
                'url': decoded_url,
                'attacker_ip': log_data[8],
                'server_ip_port': log_data[9],
                'country': log_data[10]['text'],  # 수정된 부분
                'action': log_data[11]['text'],  # 수정된 부분
                'app_id': app_id
            }
            Log.add_log(formatted_log)

        existing_logs = Log.get_app_by_logs(app_id)

        log_s = [
            {
                'no': log.no,
                'timestamp': log.timestamp,
                'category': log.category,
                'app_name': log.app_name,
                'risk_level': log.risk_level,
                'sig_level': log.sig_level,
                'host': log.host,
                'url': log.url,
                'attacker_ip': log.attacker_ip,
                'server_ip_port': log.server_ip_port,
                'country': log.country,
                'action': log.action,
                'app_id': log.app_id,
                "total_duplicates":log.total_duplicates
            }
            for log in existing_logs
        ]

        if log_s:
            return log_s
        
