import os, json
from datetime import datetime, date
from flask import Flask, render_template, request, jsonify, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] =  os.environ.get('DATABASE_URL')
#app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://{}:{}@{}/{}".format(os.environ.get('PGUSER'), os.environ.get('PGPASSWORD'), os.environ.get('PGHOST'), os.environ.get('PGDATABASE'))
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
api = Api(app)

from models import User, Expenses, Auth


app.config['SECRET_KEY'] = os.environ.get('S_KEY')

class Expense(Resource):
    def post(self):
        data = request.json
        expense = Expenses(
                user_id = data['user_id'],
                payee = data['payee'],
                description = data['description'],
                amount= data['amount'],
                date = data['date']
            )
        try:
            db.session.add(expense)
            db.session.commit()

            return jsonify(expense.serialize())
        except:
            db.session.rollback()
            raise
    
    def delete(self, expense_id):
        Expenses.query.filter_by(id=expense_id).delete()
        db.session.commit()
        userExpenses = Expenses.query.filter_by(user_id=request.args['user_id']).all()
        expenses = []
        if userExpenses != None:
            for item in userExpenses:
                expenses.append(item.serialize())

        return {'expenses' : expenses};

    def put(self, expense_id):
        data = request.json
        expense = Expenses.query.filter_by(id=expense_id).first()

        expense.date = data['date']
        expense.payee = data['payee']
        expense.description = data['description']
        expense.amount = data['amount']

        try:
            db.session.commit()
            userExpenses = Expenses.query.filter_by(user_id=expense.user_id).all()
            expenses = []
            if userExpenses != None:
                for item in userExpenses:
                    expenses.append(item.serialize())

            return {'expenses' : expenses};
        except:
            db.session.rollback()
            pass

class Register(Resource):
    def post(self):
        data = request.json
        
        user = User.query.filter_by(email=data['email']).first()
        
        if user is not None:
            return {'error' : 'User already exists. Please login.'}
        else:
            user = User(
                first_name = data['firstName'],
                last_name = data['lastName'],
                email = data['email'],
                password =data['password']
            )
            try:
                db.session.add(user)
                db.session.commit()
                return {
                    'success': 'User created successfully',
                    'user_id' : user.id
                    }, 201
            except:
                db.session.rollback()
                raise
class Login(Resource):
    def post(self):

        data = request.json

        if data == {} or not data['email'] == '' and not data['password'] == '':
            user = User.query.filter_by(email=data['email']).first()

            if (user != None and check_password_hash(user.password, data['password'])):

                userExpenses = Expenses.query.filter_by(user_id=user.id).all()

                expenses = []

                if userExpenses != None:
                    for item in userExpenses:
                        expenses.append(item.serialize())

                return {
                    'user' : {
                        'id' : user.id,
                        'fname' : user.first_name,
                        'lname' : user.last_name,
                        'email' : user.email,
                        'registered_date' : str(user.registered_date)
                    },
                    'expenses' : expenses
                }
            else:
                return {'error' : 'Please check your credentials or register for an account'}, 401

        else:
            return {'error' : 'Please enter your credentials'}  
class Logout(Resource):
    def post(self):
        data = request.json
        
        user = Auth.query.filter_by(user_id=data['uid']).first()
        if (user != None):
            user.session = ''
            db.session.commit()
            return {"success" : " Log out Successful"}


api.add_resource(Expense, '/api/expense', '/api/expense/<expense_id>')
api.add_resource(Register, '/api/register')
api.add_resource(Login, '/api/login')
api.add_resource(Logout, '/api/logout')

@app.route('/')
def index():
    return render_template('index.html')