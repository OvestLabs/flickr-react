import React from 'react';
import ReactDOM from 'react-dom'

class ImageGridItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 0,
            offsetX: 0,
            offsetY: 0
        };

        this.handleImageLoad = this.handleImageLoad.bind(this);
    }

    handleImageLoad(e) {
        const element = e.currentTarget;
        const onLoad = this.props.onLoad;

        this.imageWidth = element.naturalWidth;
        this.imageHeight = element.naturalHeight;

        if (typeof onLoad === 'function') {
            onLoad(this);
        }
    }

    render() {
        return (
            <img
                onLoad={this.handleImageLoad}
                src={this.props.url}
                alt={this.props.title}
                width={this.state.width}
                height={this.state.height}
                style={{
                    position: 'absolute',
                    left: this.state.offsetX + 'px',
                    top: this.state.offsetY + 'px',
                }}
            />
        );
    }
}

export default ImageGridItem;