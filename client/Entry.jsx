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

		$.getJSON("/like", {
			index : this.props.imageIndex,
			liked : this.state.liked,
			time : Date.now(),
			howLongStayed : Date.now() - this.props.startingTime
		}, function(data){
			this.props.notifyParent(this.props.imageIndex, this.state.liked, data.ok);
		}.bind(this));
	},

	render: function() {

		var style = { 
			padding : "30px 30px",
			margin : "50px 50px",
			textAlign: "center"
		};

		var descBox = (this.state.liked) ? (<div className="descript-box"> Liked! </div>) : "";

		var imageName = "./images/" + this.props.imageIndex + ".jpg";

		return (
			<div onClick={this.handleClick}>

				<ReactCSSTransitionGroup transitionName="descript">
					{descBox}
				</ReactCSSTransitionGroup>

				<img width="100%" style={{padding : "10px 0"}} src={imageName}/>
			</div>
		);
	}
});

module.exports = Entry;