from flask import Blueprint, request, jsonify, redirect, url_for
from response.headers import create_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils import bcrypt
from models.log import Log
from models.user import User
from models.domain import Domain
from models.user_application import UserApplication
from datetime import datetime, timedelta
from collections import Counter
from sqlalchemy import func
from models import *
from itertools import groupby

from utils import basic_auth,make_api_request
Pi5neer = Blueprint('pi5neer', __name__, url_prefix='/kui/api/v1/Pi5neer')
base_url = 'https://wf.awstest.piolink.net:8443/api/v3'




@Pi5neer.route('/dashboard/basic', methods=['GET'])
@jwt_required()
def dashboardAdmin():
    userId = get_jwt_identity()
    
    user = User.query.get(userId)
    if user.level != 2:
        return jsonify({"error": "Insufficient privileges."}), 403
    
    existing_logs = Log.query.all()
    if existing_logs:
        grouped_logs = {key: list(group) for key, group in groupby(existing_logs, key=lambda log: log.app_id)}
        response_data = {}
        for app_id, logs in grouped_logs.items():
            app_response = fetch_dashboard_data_admin(logs, app_id)
            response_data[app_id] = app_response
        return jsonify(response_data), 200
    return jsonify({"error": "데이터를 가져오지 못했습니다."}), 500


@Pi5neer.route('/dashboard/traffic', methods=['GET'])
@jwt_required()
def dashboardAdmin2():
    userId = get_jwt_identity()
    
    user = User.query.get(userId)
    if user.level != 2:
        return jsonify({"error": "Insufficient privileges."}), 403
    existing_logs = Log.query.all()
    if existing_logs:
        grouped_logs = {key: list(group) for key, group in groupby(existing_logs, key=lambda log: log.app_id)}
        response_data = {}
        total_traffic = {"traffic": []}

        for app_id, logs in grouped_logs.items():
            app_response = fetch_dashboard_data2(logs, app_id)
            response_data[str(app_id)] = app_response
            total_traffic["traffic"] += app_response["traffic"]

        for app_id, app_response in response_data.items():
            app_response["traffic"] = sorted(app_response["traffic"], key=lambda x: x["interval"])

        total_count_per_interval = {}
        for entry in total_traffic["traffic"]:
            interval = entry["interval"]
            count = entry["count"]
            if interval in total_count_per_interval:
                total_count_per_interval[interval] += count
            else:
                total_count_per_interval[interval] = count

        total_traffic_response = {"total": {"traffic": []}}
        for interval, count in sorted(total_count_per_interval.items(), key=lambda x: datetime.datetime.strptime(x[0], '%Y-%m')):
            total_traffic_response["total"]["traffic"].append({"count": count, "interval": interval})

        combined_response = response_data.copy()
        combined_response.update(total_traffic_response)
        return create_response(data=combined_response)

    return jsonify({"error": "데이터를 가져오지 못했습니다."}), 500


@Pi5neer.route('/dashboard/resource', methods=['GET'])
@jwt_required()
def getUsage() :
    userId = get_jwt_identity()
    
    user = User.query.get(userId)
    if user.level != 2:
        return jsonify({"error": "Insufficient privileges."}), 403
    url = base_url + '/system/monitoring/resource_info'
    response = make_api_request(url, method='GET', headers=basic_auth())
    return create_response(data=response.json()) 

@Pi5neer.route('/management/users', methods=['GET'])
@jwt_required()
def get_users():
    userId = get_jwt_identity()
    
    user = User.query.get(userId)
    if user.level != 2:
        return jsonify({"error": "Insufficient privileges."}), 403
    existing_users = User.query.all()
    if existing_users:
        user_list = [
            {'id': user.id, 'companyName': user.companyName} for user in existing_users
        ]
        return jsonify({'users': user_list}), 200
    return jsonify({"error": "Failed to retrieve user data."}), 500

@Pi5neer.route('/management/<int:user_id>/user_app', methods=['GET'])
@jwt_required()
def get_user_apps(user_id):
    userId = get_jwt_identity()
    
    user = User.query.get(userId)
    if user.level != 2:
        return jsonify({"error": "Insufficient privileges."}), 403
    existing_user_apps = UserApplication.get_apps_by_user_id(user_id)
    domain_list = []
    if existing_user_apps:
        for user_app in existing_user_apps:
            domains = Domain.get_domains_by_app2_id(user_app.id,user_app.wf_app_id)
            domain_list.extend(domains)
        return jsonify({'domain_list': domain_list}), 200
    return jsonify({"error": "Failed to retrieve user application data."}), 500

@Pi5neer.route('/management/<int:app_id>/user_app_log', methods=['GET'])
@jwt_required()
def get_user_logs(app_id):
    userId = get_jwt_identity()
    
    user = User.query.get(userId)
    if user.level != 2:
        return jsonify({"error": "Insufficient privileges."}), 403
    existing_logs = Log.query.filter_by(app_id=app_id).all()

    if existing_logs:
        #logs_data = [log.serialize() for log in existing_logs]
        dashboard_data = fetch_dashboard_data_admin(existing_logs, app_id)
        return dashboard_data, 200
    return jsonify({"error": f"Failed to retrieve log data for app_id={app_id}."}), 500


def fetch_dashboard_data_admin(logs, app_id):
    current_time = datetime.datetime.now()
    start_time_1hour_interval = current_time - timedelta(days=7)
    
    log_1hour = get_logs_by_time_range(start_time_1hour_interval, current_time, app_id)
    
    data_timeline_response = count_occurrences_in_intervals_admin(log_1hour, app_id)
    data_pie_response = count_category_occurrences_admin(log_1hour, app_id)
    response_data = {"detect_attack": data_timeline_response, "attack_name": data_pie_response}
    return response_data

def fetch_dashboard_data2(logs, app_id):
    current_time = datetime.datetime.now()
    start_time_1years_interval = current_time - timedelta(days=365)
    log_1year = get_logs_by_year_range_admin(start_time_1years_interval, current_time, app_id)
    response_data = {"traffic": log_1year}
    return response_data

def count_category_occurrences_admin(logs, app_id):
    categories = [log.category for log in logs]

    category_counts = Counter(categories)

    return category_counts

def get_logs_by_time_range(start_time, end_time, app_id):
    logs = db.session.query(Log).filter(
        Log.app_id == app_id,
    ).all()
    return logs

def get_logs_by_year_range_admin(start_time, end_time, app_id):
    result = db.session.query(
        func.DATE_FORMAT(Log.timestamp, '%Y-%m').label('month'),
        func.count().label('count')
    ).filter(
        Log.app_id == app_id,
    ).group_by(func.DATE_FORMAT(Log.timestamp, '%Y-%m')).all()

    month_counts = [{"interval": month, "count": count} for month, count in result]
    
    def extract_date(interval):
        return datetime.datetime.strptime(interval, '%Y-%m')

    month_counts_sorted = sorted(month_counts, key=lambda x: extract_date(x["interval"]))
    return month_counts_sorted

def count_occurrences_in_intervals_admin(logs, app_id):
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


