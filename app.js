'use strict';

// Koa fundamentals
var compress = require('koa-compress');
var logger = require('koa-logger');
var serve = require('koa-static');
var route = require('koa-route');
var koa = require('koa');
var path = require('path');
var views = require('co-views');
var parse = require('co-body');
var fs = require('fs');
var app = module.exports = koa();
var loki = require('lokijs');
var uuid = require('node-uuid');

app.use(logger());
app.use(compress());

// DB
var db = new loki('./data.json', {
	autosave: true,
	autosaveInterval: 5000,
	autoload: true,
	autoloadCallback : function(){
		if (db.getCollection('docs') === null) {
		db.addCollection('docs');
		}
 	}
 }),
docs = db.getCollection('docs');


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

	var res = yield parse.json(this);
	console.log(Object.keys(res));
	this.body = "ok";
}));

app.use(serve(path.join(__dirname, 'public/')));

if (!module.parent) {
	app.listen(80);
	console.log('listening on port 80');
}
