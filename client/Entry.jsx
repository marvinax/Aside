'use strict'
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var $ = require('jquery');


var Entry = React.createClass({
	getInitialState: function () {
	    return {
	        liked : false
	    };
	},

	handleClick: function() {

		// $.getJSON("/like", {
		// 	index : this.props.imageIndex,
		// 	liked : this.state.liked,
		// 	time : Date.now(),
		// 	howLongStayed : Date.now() - this.props.startingTime
		// }, function(data){
		// 	this.props.notifyParent(this.props.imageIndex, this.state.liked, data.ok);
		// }.bind(this));
	},

	render: function() {

		var descBox = (this.state.liked) ? (<div className="descript-box"> Liked! </div>) : "";

		return (
			<div onClick={this.handleClick}>

				<ReactCSSTransitionGroup transitionName="descript">
					{descBox}
				</ReactCSSTransitionGroup>

				<img className="user-image" src={this.props.imageData}/>
			</div>
		);
	}
});

module.exports = Entry;