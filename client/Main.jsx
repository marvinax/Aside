'use strict'
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Waypoint = require('react-waypoint');
var $ = require('jquery');

var position = {latitude : 0, longitude: 0};

var repeatedlyGetLocation = function(){
	navigator.geolocation.getCurrentPosition(function(pos){
		console.log("Location obtained.")
		position = pos.coords;
	}, function(err){
		console.log("failed to obtain location, retry in 5 secs");
		window.setTimeout(repeatedGetLocation, 5000);
	}, {
		enableHighAccuracy: true,
		timeout: 6000,
		maximumAge: 0
	});

}

var getRandomIndex = function(n){
	return (Math.random()*(n-1)+1 | 0);
}
// 1. Entry should implement the UI interaction, like after tapping to "like"
// 		a. First, how can we know that the likes are from same person?
// 			 store the tapping record in session storage
// 2. The geolocation info and timestamp will be submit to server [Done]
// 3. the server returns the result of modification, including how many people liked it
// 4. The Entry receives the updated number of like, and inform the parent class
// 5. The parent class updates all elements containing same content.

var Entry = React.createClass({
	getInitialState: function () {
	    return {
	        liked : false  
	    };
	},

	handleClick: function() {
		$.getJSON("/like", {
			index : this.props.imageIndex,
			liked : this.state.liked,
			lati : position.latitude,
			longi : position.longitude,
			time : Date.now()
		}, function(){
			this.props.notifyParent(this.props.imageIndex, this.state.liked);
		}.bind(this));
	},

	render: function() {

		var style = { 
			padding : "20px 20px",
			margin : "50px 50px",
			textAlign: "center"
		};

		var likeBox = this.state.liked ? (<div className="liked-box"> Liked! </div>) : "";

		var imageName = "./images/" + this.props.imageIndex + ".jpg";

		return (<div style={style} onClick={this.handleClick}>
			<ReactCSSTransitionGroup transitionName="liked">
				{likeBox}
			</ReactCSSTransitionGroup>
			<img src={imageName}/>
		</div>);
	}
})

var ScrollView = React.createClass({

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
				currentItems.push(getRandomIndex(50));
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
					imageIndex={imageIndex}
					ref={"entry"+index}
					key={index}
					notifyParent={that.handleNotifyParent}
				/>
			);
		});
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
	repeatedlyGetLocation();
	React.render(<ScrollView/>, document.getElementById('content'));
}

render();
