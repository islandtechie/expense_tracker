from manage import db, app
from datetime import datetime, date
from werkzeug.security import generate_password_hash, check_password_hash
import jwt

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    registered_date = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    modified_at = db.Column(db.DateTime, nullable=False)

    def __init__(self, first_name, last_name, email, password):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = generate_password_hash(password ,method='pbkdf2:sha256', salt_length=10)
        self.registered_date = datetime.now()
        self.created_at = datetime.now()
        self.modified_at = datetime.now()

    def encode_auth_token(self):
        try:
            payload = {
                'exp': datetime.utcnow() + datetime.timedelta(days=0, seconds=5),
                'iat': datetime.utcnow(),
                'sub': self.id
            }
            return jwt.encode(
                payload,
                app.config.get('SECRET_KEY'),
                algorithm='HS256'
            )
        except Exception as e:
            return e
    
    def decode_auth_token(self, auth_token):
        try:
            payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'))
            return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'
class Expenses(db.Model):
    __tablename__ = "expenses"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    payee = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    modified_at = db.Column(db.DateTime, nullable=False)

    def __init__(self, user_id, payee, description, amount, date):
        self.user_id = user_id
        self.payee = payee
        self.description = description
        self.amount = amount
        self.date = date
        self.created_at = datetime.now()
        self.modified_at = datetime.now()
    
    def serialize(self):
        return {
            'id' : self.id,
            'payee': self.payee,
            'description' : self.description,
            'amount' : self.amount,
            'date' : self.date
        }
class Auth(db.Model):
    __tablename__ = "auth"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    session = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    modified_at = db.Column(db.DateTime, nullable=False)

    def __init__(self, user_id, token):
        self.user_id = user_id
        self.session = token
        self.created_at = datetime.datetime.now()
        self.modified_at = datetime.datetime.now()
