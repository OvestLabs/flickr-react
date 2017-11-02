import React from 'react';
import ReactDOM from 'react-dom';

class ImageGrid extends React.Component {
    constructor(props) {
        super(props);
    }

    renderPhotos() {
        const photos = this.props.photos;

        return photos.map((photo, index) => (
            <img key={index} src={photo.url} alt={photo.title} />
        ));
    }

    render() {
        return (
            <div>{this.renderPhotos()}</div>
        )
    }
};

export default ImageGrid;