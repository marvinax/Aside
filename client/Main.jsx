'use strict'
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Waypoint = require('react-waypoint');
var $ = require('jquery');

var position = {latitude : 0, longitude: 0};

var startTime = Date.now();

var repeatedlyGetLocation = function(){
}

var getRandomIndex = function(n){
	return (Math.random()*(n-1)+1 | 0);
}

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
			lati : this.props.position.latitude,
			longi : this.props.position.longitude,
			time : Date.now(),
			howLongStayed : Date.now() - startTime
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

var EntryHolder = React.createClass({

	componentDidMount: function () {

		navigator.geolocation.getCurrentPosition(function(pos){
			console.log("Location obtained.")
			this.setState({position: pos.coord});
		}.bind(this), function(err){
			console.log("failed to obtain location, retry in 1 sec until finally get the data");
			this.setState({position : {latitude : 0, longitude : 0}});
			window.setTimeout(repeatedGetLocation, 1000);
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
	repeatedlyGetLocation();
	React.render(<EntryHolder/>, document.getElementById('content'));
}

render();
