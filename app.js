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

var sign = require('wx_jsapi_sign');
var config = require('./config.js');

app.use(logger());
app.use(compress());

// DB
var docs;
var db = new loki('./data.json', {
	autosave: true,
	autosaveInterval: 5000,
	autoload: false,
	autoloadCallback : function(){	
		if (db.collections === []) {
			db.addCollection('docs');
		}
		docs = db.getCollection('docs');
 	}
});

var render = views(path.join(__dirname, 'views'), {map:{html:'swig'}});

app.use(route.get('/wechat/', function *(){
    var url = this.request.body.url;
    console.log(url);

    sign.getSignature(config)(url, function(err, result){
        if(err){
            this.body = JSON.stringify({error: err});
        else {
            console.log(result);
            this.body = JSON.stringify(result);
        }
    })

}));

app.use(route.get('/stats', function *(){
	var res = docs.find({});
	this.body = yield render('stats', {data : res});
}));

app.use(route.get('/loadmore', function *(){
	var payload = docs.get(docs.maxId - parseInt(this.request.query.load));
	console.log(Object.keys(payload));
	this.body = payload;
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

	docs.insert({
		image : res.image
	})

	this.body = {upload : "successfully"}
}));

app.use(serve(path.join(__dirname, 'public/')));

if (!module.parent) {
	app.listen(80);
	console.log('listening on port 80');
}
