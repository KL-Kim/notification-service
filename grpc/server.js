/**
 * Notification service gRPC server
 *
 * @export {Object}
 * @version 0.0.1
 *
 * @author KL-Kim (https://github.com/KL-Kim)
 * @license MIT
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

if (process.env.NODE_ENV === 'development') {
  server.bind(config.notificationGrpcServer.host + ':' + config.notificationGrpcServer.port, grpc.ServerCredentials.createInsecure());
} else {
  server.bind('0.0.0.0:' + config.grpcServer.port, grpc.ServerCredentials.createSsl(null, [{
    cert_chain: config.grpcPublicKey,
    private_key: config.grpcPrivateKey
  }], false));
}

export default server;
