import * as dgram from 'dgram';
import {
  createBindingRequest,
  isStunMessage,
  parseAttributes,
} from '../stun';

const socket = dgram.createSocket({ type: 'udp4' });
socket.on('message', (msg: Buffer) => {
  if (!isStunMessage(msg)) {
    console.log('not a stun packet', msg.toString('hex'));
    socket.close();
    return;
  }

  console.log('recv:', msg.toString('hex'));
  console.log(parseAttributes(msg));
  socket.close();
});
socket.bind(12345);

const packet = createBindingRequest();
// console.log(parseAttributes(packet));
socket.send(packet, 19302, 'stun.l.google.com');