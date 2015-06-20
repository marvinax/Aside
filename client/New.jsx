'use strict'
var React = require('react/addons');
var SingleFileUpload = require('./SingleFileUpload.jsx')
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var New = React.createClass({

	handleClick : function(){
		this.refs.fileUpload.invokeFileInput();
	},

	render : function(){
		return (
			<div className="caption-container">
			<div>
				<textarea ref="caption" maxLength="60" className="caption" placeholder="Place your caption here"/>
			</div>

			<div id="file-upload" className="file-upload" onClick={this.handleClick}>
				Tap to upload image, supposed to be replaced with fonticon
				<SingleFileUpload ref="fileUpload" remoteHandler="/upload" />
			</div>
			</div>
		);
	}
})

module.exports = New;