const socket = io();
const KEYWORD = "tangkap"
const KEYWORD2 = "p";

let car1;
let car2;
let count = 0;
let count2 = 0;

// event for get data chat from TIktok LiveStream
socket.on('chat', (data) => {
    console.log(data)
    if (data.comment === KEYWORD.toLowerCase()) {
        count += 1;
        console.log(data, count);
    }
    if (data.comment === KEYWORD2.toLowerCase()) {
        count2 += 1;
        console.log(data, count2);
    }
});

socket.on('gift', (data) => {
    console.log(data);
})

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
