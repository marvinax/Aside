'use strict'
var React = require('react/addons');
var Entry = require('./Entry.jsx');
var Waypoint = require('react-waypoint');

var Router = require('react-router-component');
var Link = Router.Link;


var EntryHolder = React.createClass({

	_getRandomIndex : function(n){
		return (Math.random()*(n-1)+1 | 0);
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

	render: function() {

		return (
			<div className="Page MainPage" ref="entryHolder">
				{this._renderItems()}
				{this._renderWaypoint()}

				<div className="button">
					<Link href="/new" transisionName="moveUp">
						<img width="50%" src="./icons/add.svg" />
					</Link>
				</div>
			</div>
		);
	}
});

module.exports = EntryHolder;