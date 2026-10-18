# Nestjs installation
(1) Install the Nest CLI in your pc (if alredy, ignore this)
  npm install -g @nestjs/cli
(2) Create New nestjs project
  nest new my-nest-app


# Nestjs installation Websocket/socket.io  
(1) npm i --save @nestjs/websockets @nestjs/platform-socket.io
(2) nest g gateway chat  //generate a gateway (chat)
(3) Sets the cors and port for websocket in gateway decorater
(4) SubscribeMessage decorater to receive events name

## From POSTMAN to Nextjs (client side websocket) is not testable. Because POSTMAN websocket/socket is client side, it can test the backend websocket/socket real time communication
