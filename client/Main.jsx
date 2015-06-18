'use strict'
var React              = require('react/addons');
var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var Router             = require('react-router-component');
var Locations 		   = Router.Locations;
var Location           = Router.Location;
var Link               = Router.Link;

var EntryHolder        = require('./EntryHolder.jsx');
var New                = require('./New.jsx');


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


var App = React.createClass({
  render: function() {
    return (
      <AnimatedLocations hash transitionName="moveUp" popStateTransitionName="fade">
        <Location path="/" handler={EntryHolder} />
        <Location path="/new" handler={New} />
      </AnimatedLocations>
    )
  }
})

React.render(<App />, document.getElementById('content'));
