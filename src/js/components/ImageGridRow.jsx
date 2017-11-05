import React from 'react';
import ImageGridItem from './ImageGridItem';

var ImageGridRow = function(startIndex, maxWidth, maxHeight, spacing, offsetY) {
    this.items = [];
    this.offsetX = 0;
    this.offsetY = offsetY;
    this.isFull = false;
    this.computedHeight = maxHeight;

    this.addPhoto = function(photo) {
        const scale = maxHeight / photo.height;
        const scaledWidth = photo.width * scale;

        this.items.push({
            photo: photo,
            scale: scale
        });

        this.offsetX += scaledWidth + spacing;
        this.isFull = this.offsetX >= maxWidth;
    }

    this.createItems = function(array) {
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];

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

    this.finalize = function() {
        const items = this.items;
        const widthOfImages = this.offsetX - (items.length - 1) * spacing;
        const toTrim = Math.max(this.offsetX, maxWidth) - maxWidth;
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