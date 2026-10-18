import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

// @WebSocketGateway(port of socket,{cors})  // websocket decorater
@WebSocketGateway(4000, {
  cors: {
    origin: 'http://localhost:3000', // Specify your frontend URL here (*-all)
    methods: ['GET', 'POST'],
    credentials: true,
  }
})
export class ChatGateway {
  // @WebSocketServer() 
  // server: Server;
  @SubscribeMessage('alert') // eventname which is received from client

  // this method handle the above eventname.
  handleMessage(client: any, payload: any) {
    console.log("payload:", payload)

    // this.server.emit('alert', { name: 'Nest' }); // return to client
    return { event: 'alert', data: payload }; // return to client
  }
}
