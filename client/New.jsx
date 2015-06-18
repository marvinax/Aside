'use strict'
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;


var FileForm = React.createClass({

	getInitialState: function() {
		return {
			data_uri: null,
		};
	},

	handleClick : function(){
		this.refs.fileInput.getDOMNode().click();
	},

	handleSubmit: function(e) {
		e.preventDefault();
	},

	handleFile: function(e) {
		var self = this;
		var reader = new FileReader();
		var file = e.target.files[0];

		reader.onload = function(upload) {
			self.setState({
				data_uri: upload.target.result,
			});
		}

		reader.readAsDataURL(file);
	},

	render: function() {
		return (
			<form style={{display: "none"}} onSubmit={this.handleSubmit} encType="multipart/form-data">
			<input ref="fileInput" type="file" onChange={this.handleFile} />
			</form>
		);
	},
});

var New = React.createClass({

	handleClick : function(){
		this.refs.actualFileUploader.handleClick();
	},

	render : function(){
		return (
			<div className="caption-container">
			<div>
			<textarea ref="caption" maxLength="60" className="caption" placeholder="Place your caption here"/>
			</div>

			<div id="file-upload" className="file-upload" onClick={this.handleClick}>
				Tap to upload image, supposed to be replaced with fonticon
				<FileForm ref="actualFileUploader" />
			</div>
			</div>
		);
	}
})

module.exports = New;