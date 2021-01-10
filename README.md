# Recall knowledge for MERN stack with jwt for API auth

*** (Just for knowledge recall purpose only) ***

### How ro run?

```js
// Create a .env file, and setup variables: 
MONGODB_CONNECTION_STRING && JWT_SECRET

// Then, run commands
npm i && node index.js

// Finally open the postman to run the following APIs:
1. http://localhost:6285/user/test

2. http://localhost:6285/user/register
// set body
{
    "email": "test@test.co",
    "password": "test123",
    "passwordCheck": "test123"
}

3. http://localhost:6285/user/login
// set body
{
    "email": "test@test.co",
    "password": "test123"
}

4. http://localhost:6285/user/delete
// set header
{
  x-auth-token: "get the token from /user/login request response and put in here"
}

5. http://localhost:6285/user/tokenIsValid
// set header
{
  x-auth-token: "get the token from /user/login request response and put in here"
}

6. http://localhost:6285/user
// set header
{
  x-auth-token: "get the token from /user/login request response and put in here"
}
```
