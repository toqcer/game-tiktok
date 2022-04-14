class Car {
    constructor(x, y) {
        this.x = x;
        this.y = y
    }
    show = () => {
        rect(this.x, this.y, 80, 40);
    }

    update = () => {
        // Update Something here
        this.x += 1;
    }
}