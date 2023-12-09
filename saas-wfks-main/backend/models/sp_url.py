# sp_url.py
from MySQLdb import IntegrityError
from . import db
from datetime import datetime
class SpUrl(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    security_policy_id = db.Column(db.Integer, db.ForeignKey('security_policy.id'), nullable=False)
    url = db.Column(db.String(256))
    classification = db.Column(db.Enum('apply', 'exception'))
    desc = db.Column(db.String(32))
    updated_at = db.Column(db.TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)

    @classmethod
    def create(cls, **kwargs):
        try:
            spurl = cls(**kwargs)
            db.session.add(spurl)
            db.session.commit()
            return spurl
        except Exception as e:
            db.session.rollback()
            db.session.close()
            print(f"An error occurred while creating a user application: {str(e)}")
            raise  # Re-raise the exception after logging
    @classmethod
    def find_id_by_url(cls, url):
        try:
            sp_url = cls.query.filter_by(url=url).first()
            return str(sp_url.id) if sp_url else None
        except Exception as e:
            print(f"An error occurred while finding id by URL: {str(e)}")
            raise  # Re-raise the exception after logging
    @classmethod
    def update_sp_url_by_id(cls, id, **kwargs):
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
    def get_app_by_sp_url_id(cls, sp_url_id) : 
        return cls.query.filter_by(sp_url_id=sp_url_id).first()