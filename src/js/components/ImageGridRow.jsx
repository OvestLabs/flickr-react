var ImageGridRow = function(maxWidth, maxHeight, spacing, offsetY) {
    this.images = [];
    this.offsetX = 0;
    this.isFull = false;
    this.computedHeight = maxHeight;

    var adjust = function() {
        const images = this.images;
        const widthOfImages = this.offsetX - (images.length - 1) * spacing;
        const toTrim = this.offsetX - maxWidth;
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
    }.bind(this);

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

        if (this.offsetX < maxWidth) {
            return;
        }

        this.isFull = true;
        this.offsetX -= spacing;
        
        adjust();
    }

    this.finalize = function() {
        if (this.isFull) {
            return;
        }

        this.offsetX = maxWidth;
        adjust();
    }
};

export default ImageGridRow;