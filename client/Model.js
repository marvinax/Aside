var Local = require('./Local.js');

var Model = function(collection){
	this.collection = collection;
	this.data = {};
	this.onChangeCallBacks = [];
}

// Register change handlers
Model.prototype.subscribe = function(callback) {
	this.onChangeCallBacks.push(callback);
};

// Apply changes.
Model.prototype.notify = function(){
	this.onChangeCallBacks.forEach(function(callback){
		callback();
	});
}

// Data operations
Model.prototype.getRandomIndex = function(n){
	return (Math.random()*(n-1)+1 | 0);
}

Model.prototype.add = function(key, value){
	this.data[key] = value;
	Local.save(this.collection, this.data);
}

Model.prototype.remove = function(key){
	delete this.data[key];
	Local.save(this.collection, this.data);
}

Model.prototype.exist = function(key){
	return this.data[key] ? true : false;
}

Model.prototype.check = function(key, value){
	return this.data[key] === value;
}

Model.prototype.toggle = function(key, value){
	if(this.exist(key))
		this.remove(key);
	else
		this.add(key, value);
}

module.exports = Model;