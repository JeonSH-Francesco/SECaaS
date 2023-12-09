from flask import jsonify

class SecurityPolicyDto:
    def __init__(self, status, sig_list=None, adv_options=None):
        self.status = status
        self.sig_list = sig_list
        self.adv_options = adv_options

    def jsonify(self):
        return jsonify({
            "status" : self.status,
            "sig_list" : self.sig_list,
            "policy_name" : self.adv_options
        })
