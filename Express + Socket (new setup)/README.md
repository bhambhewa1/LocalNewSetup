## Below are the steps to create a new application in Express.js:
<!-- 
# Create a package.json file for dependencies
  npm init -y

# Install Modules
  npm install express
  npm install -D nodemon

# Connection of socket.io
  npm install socket.io
  Check the connection in app.js (main file)
  
# Install vitest for unit test case:
(1) npm install -D vitest
(2) Package.json --- "start": "nodemon app.js","test": "vitest run"
(3) Create a name.test.mjs (mjs extress provide a module imported js file, which allowed both reuire and import statement)
(4) import request from 'supertest'; and  import { describe, it, expect } from 'vitest'; -->


## Steps to run backend application
(1) cd api
(2) npm install
(3) npm run start

## Steps to run test cases
(1) cd api
(2) npm install
(3) npm run test


## Task-3 connection of socket in task-1(backend)
(1) Websocket connection for backend is setup in (app.js file) which is root server file.
(2) From a socket.io module by creating a new server for socket ()
(3) Message and severities have arrays of string from which random string shows by the Math.Random (Math Global Class)
(4) io.on tells the about the connection is created on backend or not and after that
(5) Set a Interval for 5 seconds, inside the callback function io.emit method share the alert message to all clients.