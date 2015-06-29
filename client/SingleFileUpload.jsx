'use strict'
var React = require('react/addons');
var Circle = require('rc-progress').Circle;
var ImageCrop = require("./ImageCrop.jsx");

// # React.js AJAX Single File upload input

// A React.js Component that demonstrates how to integrate
// with Ajax behavior. For single file uploading, you could
// get rid of importing jQuery. You can also write your own
// component that exhcange JSON information by mimicking this
// piece of code.

// The current implementation is a single file input, which
// is set to hidden and invoked from outside. And also you need
// to specify the callback which runs after uploaded.

// Marvin Yue Tao
// June 20, 2015

var SingleFileUPload = React.createClass({

	// the default props contain the XHR object which handles 
	// everything about transmission. 
	xhr : new XMLHttpRequest(),

	getInitialState: function () {
		return {
			file : {},
			scale: 1,
			status : ""
		};
	},

	invokeFileInput : function() {
		this.refs.fileInput.getDOMNode().click();
	},

	loadImage : function(e) {
		var self = this;
		var reader = new FileReader();
		var file = e.target.files[0];

		reader.onload = function(upload) {
			self.setState({
				data: upload.target.result,
				status : "loaded"
			});
		}

		reader.readAsDataURL(file);
	},

	handleUpload : function(){
		console.log(this.refs.caption.getDOMNode().value);

		var payload = JSON.stringify({
			dataSomething : this.refs.crop.getImage(),
			caption : this.refs.caption.value
		});

		this.xhr.open("POST", this.props.remoteHandler);
		this.xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		this.xhr.send(payload);
	},

	xhrUploadProgress : function(e){
		this.setState({
			progress : 	parseInt(e.loaded/e.total * 100),
			isUploading : true
		})
	},

	componentDidMount: function () {
		this.xhr.upload.addEventListener("progress", this.xhrUploadProgress, false)

		// this.xhr.onload = function(){
		// 	this.setState({status : "uploaded", fileId : this.xhr.response});
		// }.bind(this);
	},

	componentDidUpdate: function (prevProps, prevState) {
		switch (this.state.status){
			case "loaded" :
				break;
			case "ready" : 
				break;
			case "uploaded" : 
				// this.props.uploadedHandler(this.state.fileId);
				break;
		}
			
	},

	render : function() {

		var content;
		if (this.state.status === "")

			content = (<div id="file-upload"
							className="file-upload"
							onClick={this.invokeFileInput}>
				{this.props.children}
				<input
					ref="fileInput"
					style={{display: "none"}}

					type="file"
					accept="image/*"
					capture="camera"
					onChange={this.loadImage}
				/>
			</div>);

		else if (this.state.status === "loaded"){

			var UploadCircle;
			if (this.state.isUploading){
			    UploadCircle = (<div style={{"zIndex":-99999}}>
			    	<Circle
			    		percent={this.state.progress}
			    		strokeWidth="4"
			    	/>
			    	</div>);
			} else {
				UploadCircle = <button ref="confirmCrop" type="button" onClick={this.handleUpload}>Confirm!</button>;
			}

			content = (<div>
				<ImageCrop
					ref="crop"
					image={this.state.data}
					width={screen.width - 60}
					height={screen.width - 60}
				/>
				<br />
				<div>
					<textarea ref="caption" maxLength="60" className="caption" style={{width:window.innerWidth - 30}} placeholder="Place your caption here"/>
				</div>
				<br />
				{UploadCircle}
			</div>)

		}

		return content;
	}
})

module.exports = SingleFileUPload;