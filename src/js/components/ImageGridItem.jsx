import React from 'react';
import ReactDOM from 'react-dom'

class ImageGridItem extends React.Component {
    constructor(props) {
        super(props);

        this.handleImageLoad = this.handleImageLoad.bind(this);
    }

    handleImageLoad(e) {
        e.currentTarget.style.display = 'block';
    }

    render() {
        const props = this.props;

        return (
            <div className='item'
                style={{
                    left: `${props.offsetX}px`,
                    top: `${props.offsetY}px`,
                    width: `${props.width}px`,
                    height: `${props.height}px`
                }}
            ><img src={props.url} width={props.width} height={props.height} onLoad={this.handleImageLoad} alt={props.title}/></div>
        );
    }
}

export default ImageGridItem;