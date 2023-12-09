# domain.py
from . import db
from datetime import datetime

# domain.py
class Domain(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(256), unique=True)
    user_application_id = db.Column(db.Integer, db.ForeignKey('user_application.id'), nullable=False)
    desc = db.Column(db.String(256), nullable=True)
    updated_at = db.Column(db.TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)


    
    @classmethod
    def create(cls, **kwargs):
        domin = cls(**kwargs)
        db.session.add(domin)
        db.session.commit()
        return domin
    
    def update(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def get_all_domains(cls):
        return cls.query.all()
    
    @classmethod
    def get_domain_by_id(cls, domain_id):
        return cls.query.get(domain_id)
    
    @classmethod
    def get_domains_by_app_id(cls, app_id):
        domains = cls.query.filter_by(user_application_id = app_id).all()
        domain_list = [{
                "table_id" : item.id,
                "domain" : item.name,
                "desc" : item.desc } for item in domains]
        return domain_list
    
    @classmethod
    def get_domains_by_app2_id(cls, app_id,wf_app_id):
        domains = cls.query.filter_by(user_application_id = app_id).all()
        domain_list = [{
                "table_id" : item.id,
                "user_application_id":wf_app_id,
                "domain" : item.name,
                "desc" : item.desc } for item in domains]
        return domain_list
    @classmethod
    def update_domain_by_id(cls, domain_id, name=None, desc=None):
        domain = cls.get_domain_by_id(domain_id)

        if domain:
            # Update the fields if the new values are provided
            if name is not None:
                domain.name = name

            if desc is not None:
                domain.desc = desc

            # Update the 'updated_at' field
            domain.updated_at = datetime.utcnow()

            # Commit the changes to the database
            db.session.commit()
    
    @classmethod
    def check_domain_by_name(cls, new_name):
        existing_domain = Domain.query.filter_by(name=new_name).first()
        return existing_domain is not None
    
    @classmethod
    def delete_by_id(cls, domain_id):
        domain = cls.get_domain_by_id(domain_id)

        if domain:
            db.session.delete(domain)
            db.session.commit()
