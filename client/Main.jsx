'use strict'
var React              = require('react/addons');
var AnimatedLocations  = require('./AnimatedLocations.jsx');
var EntryList          = require('./EntryList.jsx');
var New                = require('./New.jsx');

var Router             = require('react-router-component');
var Locations 		   = Router.Locations;
var Location           = Router.Location;
var Link               = Router.Link;

var App = React.createClass({
  render: function() {
    return (
      <AnimatedLocations hash transitionName="moveUp" popStateTransitionName="fade">
        <Location path="/" handler={EntryList} />
        <Location path="/new" handler={New} />
      </AnimatedLocations>
    )
  }
})

React.render(<App />, document.getElementById('content'));
