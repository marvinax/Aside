'use strict';

// Koa fundamentals
var compress = require('koa-compress');
var logger = require('koa-logger');
var serve = require('koa-static');
var route = require('koa-route');
var koa = require('koa');
var path = require('path');
var views = require('co-views');
var parse = require('co-busboy');
var fs = require('fs');
var app = module.exports = koa();
var loki = require('lokijs');
var uuid = require('node-uuid');

app.use(logger());
app.use(compress());
// DB
var db = new loki('./data.json',
	{autosave: true, autosaveInterval: 10000}),
docs = db.addCollection('docs');

var render = views(path.join(__dirname, 'views'), {map:{html:'swig'}});

app.use(route.get('/stats', function *(){
	var res = docs.find({});
	console.log(res);
	this.body = yield render('stats', {data : res});
}));

app.use(route.get('/like', function *(){

	docs.insert({
		like: this.request.query,
		user: {
			type: this.request.header["user-agent"],
			host: this.request.header.host
		}
	});
	if(docs.data.length % 15 == 0){
		db.save();
	}

	this.body = {
		ok: docs.where(function(item){
			return item.like.index === this.request.query.index;
		}.bind(this))
	};
}))

app.use(route.get('/', function *(){
	this.body = yield render('index');
}));


app.use(route.post("/upload", function *(){

	// multipart upload
	var parts = parse(this);
	var part;

	while (part = yield parts) {
		var id = uuid.v1();
		var stream = fs.createWriteStream(path.join(__dirname, "public/user_uploaded/"+ id));
		part.pipe(stream);
		console.log('uploading %s -> %s', part.filename, stream.path);
	}

	this.body = id;
}));

app.use(serve(path.join(__dirname, 'public/')));

if (!module.parent) {
	app.listen(3000);
	console.log('listening on port 3000');
}
