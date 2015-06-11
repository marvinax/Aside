'use strict'
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

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
