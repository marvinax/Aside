'use strict'
var React = require('react/addons');

// A React.js Component that demonstrates how to integrate
// with Ajax behavior. For single file uploading, you could
// get rid of importing jQuery. You can also write your own
// component that exhcange JSON information by mimicking this
// piece of code.

var SingleFileUPload = React.createClass({

	// the default props contain the XHR object which handles 
	// everything about transmission. The FormData wraps the
	// File object loaded by FileUpload object.

	xhr : new XMLHttpRequest(),

	form : new FormData(),

	getInitialState: function () {
	    return {
	        file : {},
	        status : ""
	    };
	},

	invokeFileInput : function() {
		this.refs.fileInput.getDOMNode().click();
	},

	selectFile : function(e) {
		e.preventDefault();
		this.setState({
			file: this.refs.fileInput.getDOMNode().files[0],
			status : "selected"
		})
	},

	success : function(){
		console.log("apparently we received something");
	},

	componentDidMount: function () {
	    this.xhr.onLoad = this.success;
	},

	componentDidUpdate: function (prevProps, prevState) {
	    if(this.state.status == "selected") {
	    	this.xhr.open("POST", );
	    }
	},

	render : function() {
		return ( <input
				ref="fileInput"
				style={{display: "none"}}

				type="file"
				accept="image/*"
				capture="camera"
				onChange={this.selectFile}
		/>)
	}
})

module.exports = SingleFileUPload;