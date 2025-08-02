import os
from dotenv import load_dotenv
import datetime
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    JWT_HEADER_NAME = 'x-token'
    JWT_HEADER_TYPE = ''
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(days=1)
    WTF_CSRF_ENABLED = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
