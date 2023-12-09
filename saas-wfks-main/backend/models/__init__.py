from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import datetime

# SQLAlchemy 로그 활성화
# import logging
# logging.basicConfig()
# logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)


db = SQLAlchemy()
bcrypt = Bcrypt()

