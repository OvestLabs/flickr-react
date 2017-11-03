var ImageGridRow = function(maxWidth, maxHeight, spacing, offsetY) {
    this.images = [];
    this.offsetX = 0;
    this.offsetY = offsetY;
    this.isFull = false;
    this.computedHeight = maxHeight;

    this.addImage = function(image) {
        const imageWidth = image.imageWidth;
        const imageHeight = image.imageHeight;
        const scale = maxHeight / imageHeight;
        const scaledWidth = imageWidth * scale;

        this.offsetX += scaledWidth + spacing;

        this.images.push({
            image: image,
            scale: scale
        });

        this.isFull = this.offsetX >= maxWidth;
    }

    this.finalize = function() {
        const images = this.images;
        const widthOfImages = this.offsetX - (images.length - 1) * spacing;
        const toTrim = Math.max(this.offsetX, maxWidth) - maxWidth;
        const scale = (widthOfImages - toTrim) / widthOfImages;
        const targetHeight = maxHeight * scale;
        let x = 0;

        for (let i = 0; i < images.length; i++) {
            const item = images[i];
            const image = item.image;
            const targetWidth = image.imageWidth * item.scale * scale;
            
            image.setState({
                width: targetWidth,
                height: targetHeight,
                offsetX: x,
                offsetY: offsetY
            });

            x += targetWidth + spacing;
        }

        this.computedHeight = targetHeight;
    }
};

export default ImageGridRow;