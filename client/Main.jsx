'use strict'
var React              = require('react/addons');
var AnimatedLocations  = require('./AnimatedLocations.jsx');
var EntryHolder        = require('./EntryHolder.jsx');
var New                = require('./New.jsx');

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
