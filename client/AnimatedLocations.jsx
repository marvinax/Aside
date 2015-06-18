"use strict"
var React              = require('react/addons');
var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var Router             = require('react-router-component');

var AnimatedLocations = React.createClass({
	mixins: [
		Router.AsyncRouteRenderingMixin,
		Router.RouterMixin,
		React.addons.PureRenderMixin
	],

	getDefaultProps: function() {
		return {
			component: 'div'
		}
	},

	getRoutes: function(props) {
		return props.children;
	},

	render: function() {
		// A key MUST be set in order for transitionGroup to work.
		var handler = this.renderRouteHandler({key: this.state.match.path});
		// TransitionGroup takes in a `component` property, and so does AnimatedLocations, so we pass through
		return (<CSSTransitionGroup {...this.props}>{handler}</CSSTransitionGroup>);
	}
});

module.exports = AnimatedLocations;