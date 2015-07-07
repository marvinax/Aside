'use strict'
var React = require('react/addons');
var Entry = require('./Entry.jsx');
var Waypoint = require('react-waypoint');

var Router = require('react-router-component');
var Link = Router.Link;


var EntryList = React.createClass({

	xhr : new XMLHttpRequest(),

	componentDidMount: function () {
		var that = this;
	    this.xhr.onload = function(){
	    	that.downloadHandler(this);
	    }
	},	

	_getRandomIndex : function(n){
		return (Math.random()*(n-1)+1 | 0);
	},

	handleNotifyParent: function(selectedIndex, liked, message){
		this.state.items.forEach(function(index, key){
			if(selectedIndex === index)
				this.refs["entry"+key].setState({liked : !liked, message: message});
		}.bind(this));
	},

	downloadHandler : function(xhr){
		var currentItems = this.state.items;
			
		currentItems.push(JSON.parse(xhr.response));

		this.setState({
			items: currentItems,
			isLoading: false,
		});

	},

	_loadMoreItems: function() {
		this.setState({ isLoading: true });
		this.xhr.open("GET", "/loadmore?load="+this.state.items.length, true);
		this.xhr.send();
	},

	/**
	 * @return {Object}
	 */
	getInitialState: function() {
		var initialItems = [];
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
		return this.state.items.map(function(item, index) {
			return (
				<Entry
					startingTime={this.state.startingTime}
					imageData={item.image}
					imageIndex={item.$loki}
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
						<img width="300%" src="./icons/add-3.svg" />
					</Link>
				</div>
			</div>
		);
	}
});

module.exports = EntryList;