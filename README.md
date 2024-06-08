# icd0006-23-24-s

Authors:  

``jupetr`` : ``Jüri Petrotšenko 223166IABD``\
``jepole`` : `` Jegor Poletaev 223294IADB``


## Run from command line
~~~sh
http-server -c-1
cd ts
npm run dev
~~~
P.S. use Node.js server for navigation. It has links for both implementations.

## http-server

Files are served from `./public` if the folder exists, and `./` otherwise.

### Install server
~~~sh
npm install --global http-server
~~~

### Allow user to execute
From PowerShell (as admin)
~~~sh
Set-ExecutionPolicy Unrestricted -Scope CurrentUser
~~~

docs:  
[npm http-server](https://www.npmjs.com/package/http-server)

## Favicon

[Favicon creator](https://www.favicon.cc/)

## Win custom git function

Lazy git... 

~~~bat
rem disable showing lines in terminal
@echo off

rem check if message exists
if "%~1"=="" (
    echo Enter message for commit.
    exit /b
)

rem Add all to commit. Commit. Push
git add .
git commit -a -m "%~1"
git push
~~~

Usage:
~~~sh
lgit "Commit message"
~~~

## Ball detection zones

~~~
    ___
  /  1  \
 / 2    2\
|7       3|
 \ 6    4/
  \  5  /    
    ‾‾‾
~~~