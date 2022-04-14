const socket = io();
const KEYWORD = "tangkap"
const KEYWORD2 = "p";

let car1;
let car2;
let count = 0;
let count2 = 0;

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

// event for get data chat from TIktok LiveStream
socket.on('chat', function (data) {
    if (data.comment === KEYWORD.toLowerCase()) {
        count += 1;
        console.log(data.comment, count);
    }
    if (data.comment === KEYWORD2.toLowerCase()) {
        count2 += 1;
        console.log(data.comment, count2);
    }
});


function setup() {
    let myCanvas = createCanvas(1400, 400);
    myCanvas.parent(myContainer)
    car1 = new Car(100, 150);
    car2 = new Car(100, 250);
}

// Draw / render Canvas perFrame here
function draw() {
    background(140);
    if (count > 0) {
        car1.update();
        count--
    }
    if (count2 > 0) {
        car2.update();
        count2--
    }
    car1.show();
    car2.show();
}
