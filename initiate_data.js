var fs = require('fs'),
	path = require('path'),
	duri = require('datauri');

var loki = require('lokijs');

var db = new loki('./data.json');

if (db.getCollection('docs') === null) {
	db.addCollection('docs');
}
docs = db.getCollection('docs');

fs.readdirSync("./public/images/").forEach(function(file){

	docs.insert({
		image : duri("./public/images/"+file)
	});


})
db.save();