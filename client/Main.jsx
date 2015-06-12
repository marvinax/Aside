'use strict'
var React = require('react/addons');
var Entry = require('./Entry.jsx');
var $ = require('jquery');
var _ = require('lodash');

var Waypoint = require('react-waypoint');

var EntryHolder = React.createClass({

	_getRandomIndex : function(n){
		return (Math.random()*(n-1)+1 | 0);
	},

	componentWillMount: function () {
		this._repeatedlyGetLocation();
	},

	_repeatedlyGetLocation : function() {
		var that = this;

		navigator.geolocation.getCurrentPosition(function(pos){
			console.log("location coords obtained.")

			AMap.service(["AMap.Geocoder"], function() {	   
				var geocoder = new AMap.Geocoder({
					radius: 1000,
					extensions: "all"
				});
				//逆地理编码
				geocoder.getAddress(new AMap.LngLat(pos.coords.longitude, pos.coords.latitude), function(status, result){
					if(status === 'complete' && result.info === 'OK'){
						console.log(result);
						var res = result.regeocode.addressComponent;
						var city = (res.city.length == 0) ? res.province : res.city;
						that.setState({position : pos.coords, city : city});
					} else {
						console.log(status);
						that.setState({position : pos.coords, city : "上海市"});
					}
				});
			});


		}, function(err){
			console.log("failed to obtain location coords, retry in 1 sec until finally get the data");
			window.setTimeout(that._repeatedlyGetLocation, 1000);
		}, {
			enableHighAccuracy: true,
			timeout: 2000,
			maximumAge: 0
		});
	},

	handleNotifyParent: function(selectedIndex, liked, message){
		this.state.items.forEach(function(index, key){
			if(selectedIndex === index)
				this.refs["entry"+key].setState({liked : !liked, message: message});
		}.bind(this));
	},

	_loadMoreItems: function() {
		var itemsToAdd = 3;
		var secondsToWait = 0.2;
		this.setState({ isLoading: true });
		// fake an async. ajax call with setTimeout
		window.setTimeout(function() {
			// add data
			var currentItems = this.state.items;
			for (var i = 0; i < itemsToAdd; i++) {
				currentItems.push(this._getRandomIndex(50));
			}
			this.setState({
				items: currentItems,
				isLoading: false,
			});
		}.bind(this), secondsToWait * 1000);
	},

	/**
	 * @return {Object}
	 */
	getInitialState: function() {
		var initialItems = [1, 2, 5];
		return {
			items: initialItems,
			startingTime : Date.now(),
			isLoading: false,
			position : {latitude : 0, longitude: 0},
			city : "天水镇"
		};
	},

	/**
	 * @return {Object}
	 */
	_renderItems: function() {
		var that = this;
		return this.state.items.map(function(imageIndex, index) {
			return (
				<Entry
					position={this.state.position}
					city={this.state.city}
					startingTime={this.state.startingTime}
					imageIndex={imageIndex}
					ref={"entry"+index}
					key={index}
					notifyParent={that.handleNotifyParent}
				/>
			);
		}.bind(this));
	},

	_renderWaypoint: function() {
		if (!this.state.isLoading) {
			return (
				<Waypoint
					onEnter={this._loadMoreItems}
					threshold={1.0}
				/>
			);
		}
	},

	/**
	 * @return {Object}
	 */
	render: function() {

		return (
			<div ref="entryHolder">
				<div className="title">点击图片点个赞吧～</div>
				{this._renderItems()}
				{this._renderWaypoint()}
			</div>
		);
	}
});

function render(){
	React.render(<EntryHolder/>, document.getElementById('content'));
}

render();
