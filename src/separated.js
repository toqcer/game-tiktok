class Car {
    constructor({ x, y, variant, carSize, velocity }) {
        this.position = { x, y };
        this.carSize = { ...carSize };
        this.velocity = velocity;
        this.currentPoint = 0;
        this.variant = variant;
    }
    show = () => {
        fill(255);
        image(this.variant, this.position.x, this.position.y, this.carSize.width, this.carSize.height);
        text(this.currentPoint, this.position.x, this.position.y)
    }
    update = () => {
        // Update Something here
        this.position.x += this.velocity;
    }
}

class Goal {
    constructor({ x, y, height, width, finishImg }) {
        this.position = { x, y }
        this.height = height;
        this.width = width;
        this.finishImg = finishImg;
    }
    show = () => {
        image(this.finishImg, this.position.x, this.position.y, this.width, this.height);
    }
}