'use strict'
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Circle = require('rc-progress').Circle;
var ImageCrop = require("./ImageCrop.jsx");

var ReactTransitionGroup = React.addons.TransitionGroup;

var CallBackTransitionGroup = React.createClass({

	componentDidLeave : function(){
		if(this.props.leaveCallback){
			this.props.leaveCallback();
		}
	},

	componentDidEnter : function(){
		if(this.props.enterCallback){
			this.props.enterCallback();
		}
	},

	componentDidAppear : function(){
		if(this.props.appearCallback){
			this.props.appearCallback();
		}
	},

	render : function() {
		return(<ReactTransitionGroup transitionName={this.props.transitionName}>
			{this.props.children}
		</ReactTransitionGroup>)
	}
})

var UploadRing = React.createClass({
	componentDidMount: function () {
	    this.refs.circle.getDOMNode().addEventListener("transitionend", this.props.done, false);

	},

	render : function() {
		return (<div style={{textAlign:"center", width: "200px", display: "block", margin:"100px auto"}}>
			<Circle ref="circle"
				percent={this.props.progress}
				strokeWidth="10"
			/>
			</div>
		)
	}
})


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
		var payload = JSON.stringify({
			image : this.refs.crop.getImage(),
			caption : this.refs.caption.value
		});

		this.xhr.open("POST", this.props.remoteHandler);
		this.xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		this.xhr.send(payload);
	},

	uploadProgress : function(e){
		this.setState({
			progress : 	parseInt(e.loaded/e.total * 100),
			status : "uploading"
		})			
	},

	uploadDone : function(e){
		window.location.href="/";
	},

	componentDidMount: function () {
		this.xhr.upload.addEventListener("progress", this.uploadProgress, false);
	},

	componentDidUpdate: function (prevProps, prevState) {
		if (this.state.progress==100 && this.refs.circle) {
			console.log("yay");
		}
	},

	render : function() {

		var content;
		if (this.state.status === "")

			content = (
				<div 	id="file-upload"
						key={this.state.status}
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
				</div>

			);

		else if (this.state.status === "loaded" || this.state.status=== "uploading"){

			var UploadingComponent;
			if(this.state.status=== "loaded"){
				UploadingComponent = (<div key={this.state.status}>
					<ImageCrop
						ref="crop"
						image={this.state.data}
						width={screen.width - 60}
						height={screen.width - 60}
					/>
					<textarea ref="caption" maxLength="60" className="caption" style={{width:window.innerWidth - 30}} placeholder="Place your caption here"/>
					<button ref="confirmCrop" type="button" onClick={this.handleUpload}>Confirm!</button>
				</div>);
			} else {
				UploadingComponent = "";
			}

			var UploadingCircle;
			if(this.state.status==="uploading"){
				UploadingCircle=(<UploadRing key={this.state.status} progress={this.state.progress} done={this.uploadDone}/>)
			} else {
				UploadingCircle="";
			}

			content = (<div>
					<ReactCSSTransitionGroup transitionName="moveUp">
						{UploadingComponent}
					</ReactCSSTransitionGroup>
					<CallBackTransitionGroup transitionName="moveDown" transitionEnter={false}>
						{UploadingCircle}
					</CallBackTransitionGroup>
				</div>
				)

		} 
		return content;
	}
})

module.exports = SingleFileUPload;