let car1;
let car2;

function setup() {
    let myCanvas = createCanvas(9000, 400);
    console.log('setup fire')
    myCanvas.parent(myContainer)
    car1 = new Car(100, 150);
    car2 = new Car(100, 250);
}

// Draw / render Canvas perFrame here
function draw() {
    background(140);
    car1.update();
    car2.update();
    car1.show();
    car2.show();
}

// Create Prototype Object Car
function Car(x, y) {
    // functional constructor 
    this.x = x;
    this.y = y;

    this.show = () => {
        // create car model here
        rect(this.x, this.y, 80, 40);
    }
    this.update = () => {
        // update state here

    }
}
