var Local = {
	load: function (collection) {
		var store = localStorage.getItem(collection);
		return (store && JSON.parse(store)) || {};
	},

	save: function (collection, data) {
		if (data) {
			return localStorage.setItem(collection, JSON.stringify(data));
		}
	},

	remove : function (collection) {
		var res = this.load(collection);
		localStorage.removeItem(collection);
		return res;
	}
};

module.exports = Local;