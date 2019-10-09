# Splurt

## Dependecies

* mongodb

## Getting started

* ```yarn install```
* Create a database with a collection named ```changelog```
* ```cp .env.example .env``` and edit
* ```yarn migrate```
* ```node index.js```

## API

### Register new user
```
POST /users/register HTTP/1.1
{
    "name": "marco",
    "pwd": "12345"
}
```

### Login user
```
POST /users/login HTTP/1.1
{
    "name": "marco",
    "pwd": "12345"
}
```
Returns token

### Register new service
```
POST /services/register HTTP/1.1
{
    "name": "service_1",
    "pwd": "12345"
}
```

### Login service
```
POST /services/login HTTP/1.1
{
    "name": "service_1",
    "pwd": "12345"
}
```
Returns token

### Send push notification to user
* Put in the autorization the token received from the login service,
* Chage [USER_ID] with the user id of the user you want to send the notification
```
POST /push/[USER_ID] HTTP/1.1
Authorization: Bearer XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

{
	"title": "test"
}
```