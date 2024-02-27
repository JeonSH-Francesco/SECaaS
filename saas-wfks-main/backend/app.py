from flask import Flask
from config import Config
from routes.users import users
from routes.app import app as route_app
from routes.pi5neer import Pi5neer
from routes.security_policy.security_policy import security_policy_
from routes.security_policy.detail_setting import security_policy_detail_
from flask_cors import CORS
from models import db, bcrypt
from models import *  
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from datetime import timedelta
from decouple import config as config_
import socket
import os
import os
app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = config_('key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)  # 30분으로 설정
jwt = JWTManager(app)
app.config.from_object(Config)


db.init_app(app)
bcrypt.init_app(app)


# Import and register routes
app.register_blueprint(users)
app.register_blueprint(route_app)
app.register_blueprint(Pi5neer)
app.register_blueprint(security_policy_detail_)
app.register_blueprint(security_policy_)


# Configure CORS    
CORS(app, origins='*', supports_credentials=True)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

root_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(root_dir)

@app.route('/')
def asdas():
    return os.chdir(root_dir)

if __name__ == '__main__':
    # Remove the app.run() and replace it with the following block
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0",port=5000)
