from . import db
from datetime import datetime
class Log(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    no = db.Column(db.Integer)  # 추가: No.
    timestamp = db.Column(db.DateTime, index=True)
    category = db.Column(db.String(50))  # 추가: 분류
    app_name = db.Column(db.String(50))  # 추가: 애플리케이션 이름
    risk_level = db.Column(db.String(50))  # 추가: 공격 위험도
    sig_level = db.Column(db.String(50))  # 추가: SIG 위험도
    host = db.Column(db.String(255))  # 추가: 호스트
    url = db.Column(db.String(255))  # 추가: URL
    attacker_ip = db.Column(db.String(50))  # 추가: 공격자 IP
    server_ip_port = db.Column(db.String(50))  # 추가: 서버 IP/PORT
    country = db.Column(db.String(50))  # 추가: 국가
    action = db.Column(db.String(50))  # 추가: 대응
    total_duplicates = db.Column(db.Integer, default=1)  # 추가: 중복된 로그 개수
    
    app_id = db.Column(db.Integer)
    
    @classmethod
    def add_log(cls, log_data):
        existing_log = cls.query.filter_by(
            timestamp=log_data['timestamp'],
            app_name=log_data['app_name'],
            host=log_data['host'],
            attacker_ip=log_data['attacker_ip'],
            server_ip_port=log_data['server_ip_port'],
            url=log_data['url'],
            country=log_data['country'],
            category=log_data['category'],
            app_id=log_data['app_id']
        ).first()

        if existing_log:
            # Update the existing log
            existing_log.total_duplicates += 1
            db.session.commit()
        else:
            # Create a new log entry
            new_log = cls(
                no=log_data['no'],
                timestamp=log_data['timestamp'],
                category=log_data['category'],
                app_name=log_data['app_name'],
                risk_level=log_data['risk_level'],
                sig_level=log_data['sig_level'],
                host=log_data['host'],
                url=log_data['url'],
                attacker_ip=log_data['attacker_ip'],
                server_ip_port=log_data['server_ip_port'],
                country=log_data['country'],
                action=log_data['action'],
                app_id=log_data['app_id']
            )
            db.session.add(new_log)
            db.session.commit()

    @classmethod
    def get_logs(cls, app_name, page=1, limit=10):
        paginated_logs = cls.query.filter_by(app_name=app_name).paginate(page, limit, False)
        return paginated_logs.items
    @classmethod
    def delete_logs_id(cls, app_id):
        cls.query.filter_by(app_id=app_id).delete()
        db.session.commit()
    @classmethod
    def delete_logs(cls, app_name):
        cls.query.filter_by(app_name=app_name).delete()
        db.session.commit()
    @classmethod
    def get_app_by_logs(cls, app_id) : 
        return cls.query.filter_by(app_id=app_id).all()

    def serialize(self):
        return {
            'no': self.no,
            'timestamp': self.timestamp,
            'category': self.category,
            'app_name': self.app_name,
            'risk_level': self.risk_level,
            'sig_level': self.sig_level,
            'host': self.host,
            'url': self.url,
            'attacker_ip': self.attacker_ip,
            'server_ip_port': self.server_ip_port,
            'country': self.country,
            'action': self.action
            
        }

    def __str__(self):
        return (
            f"<Log {self.no}, timestamp={self.timestamp}, category={self.category}, "
            f"app_name={self.app_name}, risk_level={self.risk_level}, sig_level={self.sig_level}, "
            f"host={self.host}, url={self.url}, attacker_ip={self.attacker_ip}, "
            f"server_ip_port={self.server_ip_port}, country={self.country}, action={self.action}, "
            f"app_id={self.app_id}>"
        )