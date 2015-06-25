"use strict"
var React = require('react');

var deviceEvents = {
    down: 'onTouchStart',
    move: 'onTouchMove',
    up: 'onTouchUp'
};

var ImageCrop = React.createClass({

    getDefaultProps() {
        return {
            border: 25,
            width: 200,
            height: 200,
            color: [0, 0, 0, 0.5],
            onImageReady() {},
        }
    },

    getInitialState() {
        return {
            drag: false,
            pinch: false,
            mouseY: null,
            mouseX: null,
            scale: 1,
            image: {
                x: 0,
                y: 0
            },
            canvas: {
                width: this.props.width + (this.props.border * 2),
                height: this.props.height + (this.props.border * 2)
            }
        };
    },

    getImage() {
        var newCanvas = document.createElement('canvas');
        var context = newCanvas.getContext('2d');

        newCanvas.width = this.props.width;
        newCanvas.height = this.props.height;

        this.setCanvasResolution(newCanvas);

        var imageState = this.state.image;

        this.paintImage(context, {
            resource: imageState.resource,
            x: imageState.x - this.props.border,
            y: imageState.y - this.props.border,
            width: imageState.width,
            height: imageState.height
        });

        return newCanvas.toDataURL("image/jpeg", 1);
    },

    isDataURL(str) {
        var regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
        return !!str.match(regex);
    },

    loadImage(imageURL) {
        var imageObj = new Image();
        imageObj.onload = this.handleImageReady.bind(this, imageObj);
        if (!this.isDataURL(imageURL)) imageObj.crossOrigin = 'anonymous';
        imageObj.src = imageURL;
    },

    setCanvasResolution(canvas) {
        var context = canvas.getContext('2d');

        var devicePixelRatio = window.devicePixelRatio || 1;

        if (true) {

            var oldWidth = canvas.width;
            var oldHeight = canvas.height;

            canvas.width = oldWidth * devicePixelRatio;
            canvas.height = oldHeight * devicePixelRatio;

            canvas.style.width = oldWidth + 'px';
            canvas.style.height = oldHeight + 'px';

            context.scale(devicePixelRatio, devicePixelRatio);
        }

    },

    componentDidMount() {
        var canvas = this.getDOMNode();
        var context = canvas.getContext('2d');
        this.setCanvasResolution(canvas);

        if (this.props.image) {
            this.loadImage(this.props.image);
        }
        this.paint(context);
        React.initializeTouchEvents(true);
    },

    componentWillUnmount() {
    },

    componentDidUpdate() {
        var context = this.getDOMNode().getContext('2d');
        context.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
        this.paintImage(context, this.state.image);
        this.paint(context);
    },

    handleImageReady(image) {
        var imageState = this.getInitialSize(image.width, image.height);
        imageState.resource = image;
        imageState.x = this.props.border;
        imageState.y = this.props.border;
        this.setState({drag: false, pinch: false, image: imageState}, this.props.onImageReady);
    },

    getInitialSize(width, height) {
        var newHeight, newWidth, dimensions, canvasRatio, imageRatio;

        canvasRatio = this.props.height / this.props.width;
        imageRatio = height / width;

        if (canvasRatio > imageRatio) {
            newHeight = (this.props.height);
            newWidth = (width * (newHeight / height));
        } else {
            newWidth = (this.props.width);
            newHeight = (height * (newWidth / width));
        }

        return {
            height: newHeight,
            width: newWidth
        };
    },

    componentWillReceiveProps(newProps) {
        if (this.props.image != newProps.image) {
            this.loadImage(newProps.image);
        }
        if (this.state.scale != newProps.scale) {
            this.squeeze(newProps);
        }
    },

    paintImage(context, image) {
        if (image.resource) {
            context.save();
            context.globalCompositeOperation = 'destination-over';
            context.drawImage(image.resource, image.x, image.y,
                image.width * this.state.scale, image.height * this.state.scale);

            context.restore();
        }
    },

    paint(context) {
        context.save();
        context.translate(0, 0);
        context.fillStyle = "rgba(0,0,0,0.5)";

        var borderSize = this.props.border;
        var height = this.state.canvas.height;
        var width = this.state.canvas.width;

        context.fillRect(0, 0, width, borderSize); // top
        context.fillRect(0, height - borderSize, width, borderSize); // bottom
        context.fillRect(0, borderSize, borderSize, height - (borderSize * 2)); // left
        context.fillRect(width - borderSize, borderSize, borderSize, height - (borderSize * 2)); // right

        context.restore();
    },

    handleCursorDown(e) {
        e.preventDefault();
         
        if (event.targetTouches.length === 1)
            this.setState({
                drag: true,
                pinch : false,
                mouseX: null,
                mouseY: null
            });
        else if (event.targetTouches.length === 2){
            this.lastZoomScale = undefined;
            this.setState({
                drag: false,
                pinch : true,
                mouseX: null,
                mouseY: null
            })            
        }
    },

    handleCursorUp() {

        if (this.state.drag) {
            this.setState({drag: false});
        }
        if (this.state.pinch) {
            this.setState({pinch: false});
        }
    },

    handleCursorMove(e) {
        if (this.state.drag) {
            this.handleDrag();
        } if (this.state.pinch) {
            this.handleZoom(this.handlePinch());
        }
    },

    handlePinch(){
        
        var zoom = false;

        var p1 = event.targetTouches[0];
        var p2 = event.targetTouches[1];
        if(p1 && p2){
            var zoomScale = Math.sqrt(Math.pow(p2.pageX - p1.pageX, 2) + Math.pow(p2.pageY - p1.pageY, 2)); //euclidian distance

            if( this.lastZoomScale ) {
                zoom = {
                    scale : zoomScale - this.lastZoomScale,
                    center : {x: (p1.pageX + p2.pageX)/2, y : (p1.pageY + p2.pageY)/2}
                };
            }

            this.lastZoomScale = zoomScale;            
        }

        return zoom;
    },

    handleZoom(zoom){
        if (!zoom) {
            return;
        }

        var newScale = Math.max(1, this.state.scale + zoom.scale/100);
        
        var canvasmiddleX = this.state.canvas.width / 2;
        var canvasmiddleY = this.state.canvas.height / 2;

        var ratio = (newScale / this.state.scale - 1);
        var newPosX = this.state.image.x + ratio * (this.state.image.x - canvasmiddleX);
        var newPosY = this.state.image.y + ratio *(this.state.image.y - canvasmiddleY);

        
        this.setState({
            scale : newScale,
            image: {
                resource : this.state.image.resource,
                x: Math.min(newPosX, this.props.border),
                y: Math.min(newPosY, this.props.border),
                width: this.state.image.width,
                height: this.state.image.height
            }
        })
    },

    handleDrag(){
        var imageState = this.state.image;
        var lastX = imageState.x;
        var lastY = imageState.y;

        var mousePositionX = event.targetTouches[0].pageX;
        var mousePositionY = event.targetTouches[0].pageY;

        var newState = { mouseX: mousePositionX, mouseY: mousePositionY, image: imageState };

        if (this.state.mouseX && this.state.mouseY) {
            var xDiff = this.state.mouseX - mousePositionX;
            var yDiff = this.state.mouseY - mousePositionY;

            imageState.y = this.getBound(lastY - yDiff, "height", this.state.image);
            imageState.x = this.getBound(lastX - xDiff, "width", this.state.image);
        }

        this.setState(newState);
    },

    squeeze(props) {
        var imageState = this.state.image;
            imageState.y = this.getBound(imageState.y, "height", this.state.image);
            imageState.x = this.getBound(imageState.x, "width", this.state.image);
        this.setState({ image: imageState });
    },

    getBound(axis, dim, img){

        var diff = Math.ceil((img[dim] * this.state.scale - img[dim])/2) + this.props.border;
        var bound = Math.ceil(-img[dim] * this.state.scale + this.props.width + this.props.border);

        return Math.min(Math.min(Math.max(axis, bound), this.props.border), diff);
    },

    render() {
        var attributes = {
            width: this.props.width + (this.props.border * 2),
            height: this.props.height + (this.props.border * 2)
        };

        attributes[deviceEvents.down] = this.handleCursorDown;
        attributes[deviceEvents.move] = this.handleCursorMove;
        attributes[deviceEvents.up] = this.handleCursorUp;

        return <canvas {...attributes} />;
    }

});

module.exports = ImageCrop;