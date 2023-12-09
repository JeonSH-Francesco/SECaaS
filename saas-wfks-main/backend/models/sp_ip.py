# sp_ip.py
from MySQLdb import IntegrityError
from . import db
from datetime import datetime

class SpIp(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    security_policy_id = db.Column(db.Integer, db.ForeignKey('security_policy.id'), nullable=False)
    version = db.Column(db.Enum('ipv4', 'ipv6'))
    client_ip_addr = db.Column(db.String(40))
    client_mask = db.Column(db.String(40))
    classification = db.Column(db.Enum('block', 'apply', 'exception'))
    server_ip_addr = db.Column(db.String(40))
    server_ip_mask = db.Column(db.String(40))
    desc = db.Column(db.String(32))
    updated_at = db.Column(db.TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)

    @classmethod
    def create(cls, **kwargs):
        try:
            spip = cls(**kwargs)
            db.session.add(spip)
            db.session.commit()
            return spip
        except Exception as e:
            db.session.rollback()
            db.session.close()
            print(f"An error occurred while creating a user application: {str(e)}")
            raise  # Re-raise the exception after logging
    @classmethod
    def find_id_by_ip(cls, ip):
        try:
            sp_ip = cls.query.filter_by(ip=ip).first()
            return str(sp_ip.id) if sp_ip else None
        except Exception as e:
            print(f"An error occurred while finding id by URL: {str(e)}")
            raise  # Re-raise the exception after logging
    @classmethod
    def update_sp_ip_by_id(cls, id, **kwargs):
        spurl = cls.query.filter_by(id=id).first()
        if spurl:
            try:
                for key, value in kwargs.items():
                    setattr(spurl, key, value)
                db.session.commit()
                return spurl
            except IntegrityError as e:
                db.session.rollback()
                db.session.close()
                print(f"An error occurred while updating sp_Url: {str(e)}")
                raise  # Re-raise the exception after logging
        else:
            print(f"No security policy found with id: {id}")
            return None
        
    @classmethod
    def get_app_by_sp_ip_id(cls, sp_ip_id) : 
        return cls.query.filter_by(sp_ip_id=sp_ip_id).first()