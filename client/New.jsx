'use strict'
var React = require('react/addons');
var SingleFileUpload = require('./SingleFileUpload.jsx')
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var New = React.createClass({

	render : function(){
		return (
			<div className="caption-container">
			<div>
				<textarea ref="caption" maxLength="60" className="caption" placeholder="Place your caption here"/>
			</div>

				<SingleFileUpload ref="fileUpload" remoteHandler="/upload" >
					Tap to upload files
				</SingleFileUpload>
			</div>
		);
	}
})

module.exports = New;