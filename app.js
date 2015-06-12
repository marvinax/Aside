'use strict';

// Koa fundamentals
var compress = require('koa-compress');
var logger = require('koa-logger');
var serve = require('koa-static');
var route = require('koa-route');
var koa = require('koa');
var path = require('path');
var views = require('co-views');
var app = module.exports = koa();
var loki = require('lokijs');

var $ = require('jquery');

app.use(logger());
app.use(compress());
// DB
var db = new loki('./data.json',
	{autosave: true, autoload:true, autosaveInterval: 10000}),
	docs = db.addCollection('docs');

var render = views(path.join(__dirname, 'views'), {map:{html:'swig'}});
app.use(route.get('/', function *(){
    this.body = yield render('index');
}));

app.use(route.get('/stats', function *(){
	var res = docs.find({});
	console.log(res);
	this.body = yield render('stats', {data : res});
}));

app.use(route.get('/like', function *(){

	console.log($.getJSON);

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


app.use(serve(path.join(__dirname, 'public/')));

if (!module.parent) {
  app.listen(3000);
  console.log('listening on port 3000');
}
