class Car {
    constructor({ x, y, goal }) {
        this.position = { x, y };
        this.velocity = (innerWidth / goal);
    }
    show = () => {
        rect(this.position.x, this.position.y, 40, 20);
    }

    update = () => {
        // Update Something here
        this.position.x += this.velocity;
    }
}

class Goal {
    constructor({ x, y, height, width }) {
        this.position = { x, y }
        this.height = height;
        this.width = width;
    }

    show = () => {
        rect(this.position.x, this.position.y, this.width, this.height);
    }
}