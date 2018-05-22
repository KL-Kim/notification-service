/**
 * Notification gRPC server
 */
import grpc from 'grpc';
import _ from 'lodash';

import config from '../config/config';
import { addNotification } from './server.methods.js'

const PROTO_PATH = __dirname + '/../config/protos/notification.proto';
const notificationProto = grpc.load(PROTO_PATH).notification;

const server = new grpc.Server();
server.addService(notificationProto.NotificationService.service, {
  addNotification: addNotification,
});

// server.bind('0.0.0.0:' + config.grpcServer.port, grpc.ServerCredentials.createSsl(null, [{
//   cert_chain: config.grpcPublicKey,
//   private_key: config.grpcPrivateKey
// }], false));

server.bind(config.notificationGrpcServer.host + ':' + config.notificationGrpcServer.port, grpc.ServerCredentials.createInsecure());

export default server;
