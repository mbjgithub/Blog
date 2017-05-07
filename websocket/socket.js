var sio=require("socket.io");
function serverSocket(server){
   var io=sio.listen(server);
   io.sockets.on("connection",function(socket){
      //当有人访问127.0.0.1:1337时,就会连接上，并返回和该客户端相连接的服务器端socket，相对的，客户端也会得到一个
      //与服务器端相连接的客户端socket，以此，客户端和服务器端通信
   });
}
exports.serverSocket=serverSocket;