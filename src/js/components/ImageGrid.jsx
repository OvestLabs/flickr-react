import React from 'react';
import ReactDOM from 'react-dom';
import ImageGridItem from './ImageGridItem';
import ImageGridRow from './ImageGridRow';

class ImageGrid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: []
        };

        this.handleWindowResize = this.handleWindowResize.bind(this);
        this.handleDocumentScroll = this.handleDocumentScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowResize);
        document.addEventListener('scroll', this.handleDocumentScroll);
        
        this.updateBounds();
        this.forceUpdate();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
        document.removeEventListener('scroll', this.handleDocumentScroll);
    }

    updateBounds() {
        this.bounds = ReactDOM.findDOMNode(this).getBoundingClientRect();
    }

    handleWindowResize() {
        this.updateBounds();
        this.forceUpdate();
    }

    handleDocumentScroll() {
        const onLoadMore = this.props.onLoadMore;

        if (typeof onLoadMore !== 'function') {
            return;
        }

        this.updateBounds();
        const threshold = this.bounds.bottom - this.props.maxRowHeight * 5;

        if (threshold <= window.innerHeight) {
            onLoadMore();
        }
    }

    renderItems() {
        if (!this.bounds) {
            return [];
        }

        const rowWidth = this.bounds.width; 
        const rowHeight = this.props.maxRowHeight;
        const spacing = this.props.spacing;
        const photos = this.props.photos;
        const items = [];

        let offsetY = 0;
        let row = null;

        for (let i = 0; i < photos.length; i++) {
            if (!row) {
                row = new ImageGridRow(i, rowWidth, rowHeight, spacing, offsetY);
            }

            row.addPhoto(photos[i]);

            if (!row.isFull) {
                continue;
            }

            row.finalize();
            row.createItems(items);

            offsetY += row.computedHeight + spacing;
            row = null;
        }

        return items;
    }

    render() {
        const items = this.renderItems();
        let height = 0;

        if (items.length > 0) {
            const lastItem = items[items.length - 1];
            height = lastItem.props.offsetY + lastItem.props.height
        }

        return (
            <div className='imageGrid centered-content' style={{height:`${height}px`}}>{items}</div>
        )
    }
};

ImageGrid.defaultProps = {
    spacing: 5,
    maxRowHeight: 200,
    onLoadMore: function() { /* left blank intentionally */ }
};

export default ImageGrid;