'use strict'
var React = require('react/addons');
var SingleFileUpload = require('./SingleFileUpload.jsx')
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var New = React.createClass({

	render : function(){
		return (
			<div className="caption-container">
				<SingleFileUpload ref="fileUpload" remoteHandler="/upload" >
					<img src="./icons/upload.svg" width="80%"/>
					<br/>
					点这儿上传
				</SingleFileUpload>
			</div>
		);
	}
})

module.exports = New;