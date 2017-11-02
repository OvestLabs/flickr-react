import React from 'react';
import ReactDOM from 'react-dom';
import ImageGridItem from './ImageGridItem';
import ImageGridRow from './ImageGridRow';

class ImageGrid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            photos: []
        };
    }

    componentDidMount() {
        window.addEventListener('resize', () => this.adjustGrid());
    }

    adjustGrid() {
        const container = ReactDOM.findDOMNode(this);
        const rowWidth = container.clientWidth; 
        const rowHeight = this.props.maxRowHeight;
        const spacing = this.props.spacing;
        let offsetY = 0;
        let currentRow = new ImageGridRow(rowWidth, rowHeight, spacing, offsetY);

        for (let i = 0; i < this.loadedImages.length; i++) {
            currentRow.addImage(this.loadedImages[i]);

            if (!currentRow.isFull) {
                continue;
            }

            offsetY += currentRow.computedHeight + spacing;
            currentRow = new ImageGridRow(rowWidth, rowHeight, spacing, offsetY);
        }

        currentRow.finalize();
    }

    startNewRow(offsetY) {
        const container = ReactDOM.findDOMNode(this);
        const rowWidth = container.clientWidth; 
        const rowHeight = this.props.maxRowHeight;
        const spacing = this.props.spacing;

        this.currentRow = new ImageGridRow(rowWidth, rowHeight, spacing, offsetY);
    }

    handleImageLoad(index, e) {
        this.loadedImages.push(e);

        if (!this.currentRow) {
            this.startNewRow(this.offsetY);
        }

        this.currentRow.addImage(e);

        if (this.currentRow.isFull) {
            this.offsetY += this.currentRow.computedHeight + this.props.spacing;
            this.currentRow = null;
        }
        else if (this.loadedImages.length === this.props.photos.length) {
            this.currentRow.finalize();
        }
    }

    renderPhotos() {
        const photos = this.props.photos;
        
        this.loadedImages = [];
        this.offsetY = 0;
        this.currentRow = null;

        const items = photos.map((photo, index) => (
            <ImageGridItem
                onLoad={this.handleImageLoad.bind(this, index)} 
                key={index} 
                url={photo.url}
                title={photo.title}
            />
        ));

        return items;
    }

    render() {
        return (
            <div style={{marginTop:'20px', position:'relative'}}>{this.renderPhotos()}</div>
        )
    }
};

ImageGrid.defaultProps = {
    spacing: 5,
    maxRowHeight: 200
};

export default ImageGrid;