'use strict'
var React = require('react/addons');
var Entry = require('./Entry.jsx');

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Waypoint = require('react-waypoint');

var EntryHolder = React.createClass({

	_getRandomIndex : function(n){
		return (Math.random()*(n-1)+1 | 0);
	},

	componentWillMount: function () {
		this._repeatedlyGetLocation();
	},

	_repeatedlyGetLocation : function() {
		navigator.geolocation.getCurrentPosition(function(pos){
			console.log("Location obtained.")
			this.setState({position : pos.coords});
		}.bind(this), function(err){
			console.log("failed to obtain location, retry in 1 sec until finally get the data");
			this.setState({position : {latitude : 0, longitude : 0}});
			window.setTimeout(this._repeatedlyGetLocation, 1000);
		}.bind(this), {
			enableHighAccuracy: true,
			timeout: 6000,
			maximumAge: 0
		});
	},

	handleNotifyParent: function(selectedIndex, liked){
		this.state.items.forEach(function(index, key){
			if(selectedIndex === index)
				this.refs["entry"+key].setState({liked : !liked});
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
			position : {latitude : 0, longitude: 0}
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
				Tap image to like!
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
