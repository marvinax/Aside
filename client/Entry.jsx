'use strict'
var React = require('react/addons');
// var Waypoint = require('react-waypoint');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var $ = require('jquery');

var ScreenWayPoint = React.createClass({
	getDefaultProps: function() {
		return {
			enterThres : 1,
			leaveThres : 0,
			onEnter: function() {},
			onLeave: function() {},
		};
	},

	componentDidMount: function() {
		window.addEventListener('touchmove', this.handleScroll);
		window.addEventListener('scroll', this.handleScroll);
		this.handleScroll();
	},

	componentDidUpdate: function() {
		this.handleScroll();
	},

	componentWillUnmount: function() {
		window.removeEventListener('touchmove', this.handleScroll);
		window.removeEventListener('scroll', this.handleScroll);
	},

	handleScroll: function(event) {
		const isVisible = this.isVisible();

		if (this.wasVisible === isVisible) {
		  return;
		}

		if (isVisible) {
		  this.props.onEnter.call(this, event);
		} else {
		  this.props.onLeave.call(this, event);
		}

		this.wasVisible = isVisible;
	},

	isVisible: function() {
		const node = this.getDOMNode();

		const enterThresPx = screen.height * this.props.enterThres;
		const leaveThresPx = screen.height * this.props.leaveThres;

		const isAboveBottom = node.offsetTop - window.scrollY <= enterThresPx;
		const isBelowTop    = node.offsetTop - window.scrollY > leaveThresPx;

		return isAboveBottom && isBelowTop;
	},

	render: function() {
		return (<span style={{fontSize: 0}} />);
	}
})


var Entry = React.createClass({
	getInitialState: function () {
	    return {
	        liked : false
	    };
	},

	componentWillUpdate: function (nextProps, nextState) {
		var node = this.getDOMNode();
	},

	displayButton: function () {
		this.setState({liked:true});
	},

	hideButton : function() {
		this.setState({liked:false});
	},

	handleClick: function() {
	},

	render: function() {

		var descBox = (this.state.liked) ? (<div key={"desc"+this.props.key} className="descript-box"> Liked! </div>) : "";

		return (
			<div>
				<ScreenWayPoint enterThres={0.5} leaveThres={0.1} onEnter={this.displayButton} onLeave={this.hideButton} />
				<ReactCSSTransitionGroup transitionName="descript">
					{descBox}
				</ReactCSSTransitionGroup>


				<img className="user-image" src={this.props.imageData}/>
			</div>
		);
	}
});

module.exports = Entry;