from flask import jsonify

def create_response(success=True, message="ok", data=None, status_code=200):
    response = {
        "header": {
            "isSuccessful": success,
            "resultMessage": message,
            "resultCode": status_code
        },
        "result": data if data is not None else {}
    }
    return jsonify(response), status_code