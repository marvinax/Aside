'use strict'
var React = require('react/addons');

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
				file : file,
				file_data_uri: upload.target.result,
				status : "loaded"
			});
		}

		reader.readAsDataURL(file);
	},

	handleUpload : function(e){
		this.setState({
			cropped_file_data_uri : this.refs.crop.getImage(),
			status : "ready"
		})
	},

	success : function(){
		if(this.xhr.status === 200)
			console.log("apparently we received something");
		else
			console.log(this.xhr.status);
	},

	componentDidMount: function () {
		this.xhr.upload.addEventListener("progress", function(e){
			console.log(e.loaded/e.total);
		}, false)

		this.xhr.onload = function(){
			// The server is expected to reply a string ID. Change whatever
			// you like, but remember xhr.response is a string, you need to
			// parse it into object if your server returns an object.
			this.setState({status : "uploaded", fileId : this.xhr.response});
		}.bind(this);
	},

	componentDidUpdate: function (prevProps, prevState) {
		switch (this.state.status){
			case "loaded" :
				break;
			case "ready" : 

				var payload = JSON.stringify({
					name : this.state.file.name,
					file : this.state.cropped_file_data_uri
				});

				this.xhr.open("POST", this.props.remoteHandler);
				this.xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
				this.xhr.send(payload);
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
			content = (<div>
				<ImageCrop ref="crop" image={this.state.file_data_uri} />
				<br />
				<button ref="confirmCrop" type="button" onClick={this.handleUpload}>Upload!</button>
			</div>)
		} else {
			content = (<div>
				<img src={this.state.cropped_file_data_uri} width="200px"/>
			</div>)
		}

		return content;
	}
})

module.exports = SingleFileUPload;