'use strict'
var Model = require("./Model.js")
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Waypoint = require('react-waypoint');
var $ = require('jquery');

var model = new Model();


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
	        liked : model.exist(this.props.imageIndex)
	    };
	},	

	handleClick: function() {
		var that = this;
		var data = {};
		
		navigator.geolocation.getCurrentPosition(function(position){

			var submit = {
				index : that.props.imageIndex,
				liked : model.exist(that.props.imageIndex),
				time : Date.now(),
				lati : position.coords.latitude,
				longi : position.coords.longitude
			}

			$.getJSON("/like", submit, function(){
				// model.toggle(that.props.imageIndex, {liked: true});
				that.setState({liked: !that.state.liked});
			});

		}, function(err){

			var submit = {
				index : that.props.imageIndex,
				liked : model.exist(that.props.imageIndex),
				time : Date.now()
			}

			$.getJSON("/like", submit, function(){
				// model.toggle(that.props.imageIndex, {liked: true});
				that.setState({liked: !that.state.liked});
			});

		}, {enableHighAccuracy: true,
			timeout: 500,
			maximumAge: 0
		});
	},

	render: function() {

		var style = { 
			padding : "20px 20px",
			margin : "50px 50px",
			textAlign: "center"
		};

		var likeBox = this.state.liked ? (<div className="liked-box"> Liked! </div>) : "";

		var imageName = "http://localhost:3000/images/" + this.props.imageIndex + ".jpg";

		return (<div style={style} onClick={this.handleClick}>
			<ReactCSSTransitionGroup transitionName="liked">
				{likeBox}
			</ReactCSSTransitionGroup>
			<img src={imageName} />
		</div>);
	}
})

var InfiniteScrollExample = React.createClass({
	handleClick: function(){
		console.log("yay");
	},

	_loadMoreItems: function() {
		var itemsToAdd = 3;
		var secondsToWait = 0.5;
		this.setState({ isLoading: true });
		// fake an async. ajax call with setTimeout
		window.setTimeout(function() {
			// add data
			var currentItems = this.state.items;
			for (var i = 0; i < itemsToAdd; i++) {
				currentItems.push(model.getRandomIndex(50));
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
		return this.state.items.map(function(imageIndex, index) {
			return (
				<Entry imageIndex={imageIndex}/>
			);
		});
	},

	/**
	 * @return {Object}
	 */
	_renderLoadingMessage: function() {
		if (this.state.isLoading) {

			var style = {
				left: "50%",
				top: "50%",
				transform: "translate(-50%, -50%)",
				background: "#999",
				color: "#fff",
				opacity: "0.5",
				padding: "10px",
				pointerEvents: "none",
				position: "absolute",
				zIndex: "1000",
				fontSize : "80px",
				fontFamily : "Seravek, Hiragino Sans GB",
				fontWeight : "Bold"
			}

			return (
				<p style={style}>
					No, please, I wanna eat more...
				</p>
			);
		}
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
			<div className="infinite-scroll-example">
				{this._renderLoadingMessage()}
				<div className="infinite-scroll-example__scrollable-parent">
					{this._renderItems()}
					{this._renderWaypoint()}
				</div>
			</div>
		);
	}
});

function render(){

	React.render(<InfiniteScrollExample/>, document.getElementById('content'));
}

render();
