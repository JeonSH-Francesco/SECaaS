from flask import jsonify

class BlockIPDto:
    def __init__(self, id, ip, subnetmask, desc=None):
        self.id = id
        self.ip = ip
        self.subnetmask = subnetmask
        self.desc = desc

    def jsonify(self):
        return jsonify({
            "id" : self.id,
            "ip" : self.ip,
            "subnetmask" : self.subnetmask,
            "desc" : self.desc
        })
