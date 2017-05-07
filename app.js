var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var path = require("path");
var http = require("http");

var index = require("./routers/index");
var login = require("./routers/login");
var sendArticle = require("./routers/sendArticle");
var detailArticle = require("./routers/detailArticle");
var category = require("./routers/category");
var author = require("./routers/author");

var comment=require("./routers/comment")

var sqlServer=require("./routers/sqlServer")

var mongodb = require("./mongoose");
var socket = require("./websocket/socket");

var app = express();
var server = http.createServer(app); //use app application to create server
server.listen(1337, "127.0.0.1", function(err) {
	if (err) {
		console.log("server listening error");
		return;
	}
	console.log("server is listenning on 127.0.0.1:1337");
});
socket.serverSocket(server); //pass server object to socket.io

mongodb.connectToMongoDB();

//app.set("views",__dirname+"/views");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", require("ejs-mate"));
app.locals._layoutFile = "layout.ejs"; //所有的views界面下的ejs都使用这个布局文件

app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	secret: "miaomiao",
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true
	}
}));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);
app.use("/", login);
app.use("/", sendArticle);
app.use("/", detailArticle);
app.use("/", category);
app.use("/", author);
app.use("/",comment)
app.use("/",sqlServer)
