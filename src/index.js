const myContainer = document.querySelector('#myContainer');

const socket = io();
const KEYWORD = "tangkap"
const KEYWORD2 = "ppp";

let car1;
let car2;
let gas = {
    car1: 0,
    car2: 0,
}
let goal = 150;

function setup() {
    let myCanvas = createCanvas(innerWidth, 400);
    myCanvas.parent(myContainer);
    car1 = new Car({
        x: innerWidth / 15,
        y: 150,
        goal,
    });
    car2 = new Car({
        x: innerWidth / 15,
        y: 250,
        goal,
    });
    goal = new Goal({
        x: innerWidth - (innerWidth / 15 * 2),
        y: 150,
        width: 40,
        height: 160
    });
}

function preload() {

}

// Draw / render Canvas perFrame here
function draw() {
    drawingContext.clearRect(0, 0, width, height)
    background(140);
    if (gas.car1 > 0) {
        gas.car1 -= 1;
        car1.currentPoint += 1;
        car1.update();
    }
    if (gas.car2 > 0) {
        gas.car2 -= 1;
        car2.currentPoint += 1;
        car2.update();
    }
    goal.show();
    car1.show();
    car2.show();
}

// event for get data chat from TIktok LiveStream
socket.on('chat', (data) => {
    if (data.comment === KEYWORD.toLowerCase()) {
        gas.car1 += 1;
    }
    if (data.comment === KEYWORD2.toLowerCase()) {
        gas.car2 += 1;
    }
});

socket.on('gift', (data) => {
    console.log(data);
})
