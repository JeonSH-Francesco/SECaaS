# 정책별 데이터 추출 로직
def sig_list(data): #sql_injection,directory_listing,download,url_regex,xss,shellcode,upload,access_control,
    extracted_data = {
        "status": data.get("status"),
        "sig_list": [
            {
                "status": item.get("status"),
                "block_id": item.get("block_id"),
                "ko_desc": item.get("ko_desc"),
                "warning": item.get("warning"),
                "id": item.get("id")
            }
            for item in data.get("sig_list", [])
        ]
    }
    return extracted_data

def adv_options(data): #buffer_overflow,evasion,cookie_protection
    extracted_data = {
        "status": data["status"],
        "adv_options": data["adv_options"]
    }
    return extracted_data

def request_flood(data):
    extracted_data = {
        "status": data["status"],
        "adv_options": data["adv_options"],
        "adv_ssl_options": data["adv_ssl_options"]
    }
    return extracted_data

def credential_stuffing(data):
    extracted_data = {
        "status": data["status"],
        "success_rule": data["success_rule"],
        "fail_rule": data["fail_rule"]
    }
    return extracted_data
