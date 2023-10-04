from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pymongo import MongoClient
import re, string, random

from db.users import TokenData

client = MongoClient(
    "mongodb+srv://mif:VmkdZIBpqco1MPQ4@cluster0.htxrp.mongodb.net/?retryWrites=true&w=majority"
)
users_db = client.foodle.users

SECRET_KEY = "60920b13f960a2b2ced106a9224180f3b646569443dcebabdc96ee6dc63e3e8c"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_hashed_password(password):
    return pwd_context.hash(password)

def create_token(data: dict):
    dup = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    dup.update({"exp": expire})
    dup_jwt = jwt.encode(dup, SECRET_KEY, algorithm=ALGORITHM)
    return dup_jwt

def verify_password(password, hashed_password):
    return pwd_context.verify(password, hashed_password)

def verify_email(address):
    regex = r'^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'
    if re.search(regex, address):
        if users_db.count_documents({'email': address}) == 0:
            return True
    return False

def verify_username(name):
    if users_db.count_documents({'user_name': name}) == 0:
        return True
    return False

def verify_token(token:str,credentials_exception):
 try:
     payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
     username: str = payload.get("name")
     if username is None:
         raise credentials_exception
     token_data = TokenData(username=username)
     return token_data
 except JWTError:
     raise credentials_exception

def get_current_user(token: str = Depends(oauth2_scheme)):
 credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalide credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
 return verify_token(token,credentials_exception)

def check_email(email):
    if users_db.count_documents({'email': email}) == 0:
        return False
    # Generate password reset code and email it to the user
    code = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(10))
    users_db.update_one({'email': email}, {'$set': {'reset_code': code}})
    return code

def check_code(code, new_password):
    if users_db.count_documents({'reset_code': code}) == 0:
        return False
    new_hashed = get_hashed_password(new_password)
    users_db.update_one({'reset_code': code}, {'$set': {'hashed_password': new_hashed}})
    return True

def change_username(current_username, new_username):
    users_db.update_one({'user_name': current_username}, {'$set': {'user_name': new_username}})

def change_email(username, new_email):
    users_db.update_one({'user_name': username}, {'$set': {'email': new_email}})

def change_password(username, old_password, new_password):
    user = users_db.find_one({'user_name': username}, {'hashed_password': 1, '_id': 0})
    if not verify_password(old_password, user['hashed_password']):
        return False
    new_hashed = get_hashed_password(new_password)
    users_db.update_one({'user_name': username}, {'$set': {'hashed_password': new_hashed}})
    return True