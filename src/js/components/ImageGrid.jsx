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

        this.loadedImages = [];
        this.handleWindowResize = this.handleWindowResize.bind(this);
        this.handleDocumentScroll = this.handleDocumentScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowResize);
        document.addEventListener('scroll', this.handleDocumentScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
        document.removeEventListener('scroll', this.handleDocumentScroll);
    }

    adjustGrid() {
        const node = ReactDOM.findDOMNode(this);
        const rowWidth = node.clientWidth; 
        const rowHeight = this.props.maxRowHeight;
        const spacing = this.props.spacing;
        let offsetY = 0;
        let row = new ImageGridRow(rowWidth, rowHeight, spacing, offsetY);

        for (let i = 0; i < this.loadedImages.length; i++) {
            row.addImage(this.loadedImages[i]);

            if (!row.isFull) {
                continue;
            }

            row.finalize();

            offsetY += row.computedHeight + spacing;
            row = new ImageGridRow(rowWidth, rowHeight, spacing, offsetY);
        }

        this.currentRow = row;

        const height = row.offsetY + row.computedHeight + spacing;
        node.style.height = `${height}px`;
    }

    startNewRow(offsetY) {
        const node = ReactDOM.findDOMNode(this);
        const rowWidth = node.clientWidth; 
        const rowHeight = this.props.maxRowHeight;
        const spacing = this.props.spacing;

        this.currentRow = new ImageGridRow(rowWidth, rowHeight, spacing, offsetY);

        return this.currentRow;
    }

    getCurrentRow() {
        let row = this.currentRow;

        if (!row) {
            return this.startNewRow(0);
        }

        if (row.isFull) {
            return this.startNewRow(row.offsetY + row.computedHeight + this.props.spacing);
        }

        return row;
    }

    handleImageLoad(index, e) {
        this.loadedImages.push(e);

        const row = this.getCurrentRow();

        row.addImage(e);

        if (!row.isFull) {
            return;
        }

        row.finalize();

        const node = ReactDOM.findDOMNode(this);
        const height = row.offsetY + row.computedHeight + this.props.spacing;
        node.style.height = `${height}px`;
    }

    handleWindowResize() {
        this.adjustGrid();
    }

    handleDocumentScroll() {
        const onLoadMore = this.props.onLoadMore;

        if (typeof onLoadMore !== 'function') {
            return;
        }

        if (this.loadedImages.length !== this.props.photos.length) {
            return;
        }

        const node = ReactDOM.findDOMNode(this);
        const bounds = node.getBoundingClientRect();
        const threshold = bounds.bottom - this.props.maxRowHeight * 2;

        if (threshold <= window.innerHeight) {
            onLoadMore();
        }
    }

    renderPhotos() {
        const photos = this.props.photos;

        if (photos.length === 0) {
            this.currentRow = null;
            this.loadedImages = [];
        }
        
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
            <div className='imageGrid centered-content'>{this.renderPhotos()}</div>
        )
    }
};

ImageGrid.defaultProps = {
    spacing: 5,
    maxRowHeight: 200,
    onLoadMore: function() { /* left blank intentionally */ }
};

export default ImageGrid;