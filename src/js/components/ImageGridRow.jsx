import React from 'react';
import ImageGridItem from './ImageGridItem';

/**
 * Assists ImageGrid with positioning and sizing images in a single justified row.
 * 
 * @param {number} startIndex The index of the first image in its parent collection.
 * @param {number} maxWidth The maximum width of the row.
 * @param {number} maxHeight The maximum height of the row.
 * @param {number} spacing The amount of space added between items.
 * @param {number} offsetY The starting offset on the y-axis.
 */
const ImageGridRow = function(startIndex, maxWidth, maxHeight, spacing, offsetY) {
    this.isFull = false;
    this.computedHeight = maxHeight;
    
    var items = [];
    var offsetX = 0;

    /**
     * Adds a photo to the row. 
     */
    this.addPhoto = function(photo) {
        const scale = maxHeight / photo.height;
        const scaledWidth = photo.width * scale;

        items.push({
            photo: photo,
            scale: scale
        });

        offsetX += scaledWidth + spacing;
        this.isFull = offsetX >= maxWidth;
    }

    /**
     * Creates and appends a collection of ImageGridItem made from the photos in this row.
     */
    this.createItems = function(array) {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            array.push((
                <ImageGridItem
                    key={startIndex+i} 
                    url={item.photo.url}
                    title={item.photo.title}
                    width={item.targetWidth}
                    height={item.targetHeight}
                    offsetX={item.offsetX}
                    offsetY={item.offsetY}
                />
            ));
        }
    }

    /**
     * Finalizes the row by repositioning and resizing the images to fit inside the row.
     */
    this.finalize = function() {
        const widthOfImages = offsetX - (items.length - 1) * spacing;
        const toTrim = Math.max(offsetX, maxWidth) - maxWidth;
        const scale = (widthOfImages - toTrim) / widthOfImages;
        const targetHeight = maxHeight * scale;
        let x = 0;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            item.scale *= scale;
            item.targetWidth = item.photo.width * item.scale;
            item.targetHeight = targetHeight;
            item.offsetX = x;
            item.offsetY = offsetY;
            
            x += item.targetWidth + spacing;
        }

        this.computedHeight = targetHeight;
    }
};

export default ImageGridRow;