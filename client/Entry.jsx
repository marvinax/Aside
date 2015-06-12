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
			lati : this.props.position.latitude,
			longi : this.props.position.longitude,
			city : this.props.city,
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

		if(this.state.liked){
			var cities = _.uniq(this.state.message.map(function(item){return item.like.city})).slice(0, 3).join('，');
			var number = 1;

			this.state.message.forEach(function(item){
				if (item.like.liked == "false")
					number +=1;
				else
					number -=1;
			})

			var desc = "包括您在内的来自 "+cities+" 等地的"+number+"位吃货表示喜欢这道吃的";
			var descBox = (<div className="descript-box"> {desc} </div>);
		} else {
			var descBox = "";
		}

		var imageName = "./images/" + this.props.imageIndex + ".jpg";

		return (<div style={style} onClick={this.handleClick}>

			<ReactCSSTransitionGroup transitionName="descript">
				{descBox}
			</ReactCSSTransitionGroup>

			<img width="100%" src={imageName}/>
		</div>);
	}
});

module.exports = Entry;