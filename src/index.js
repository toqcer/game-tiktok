const myContainer = document.querySelector('#myContainer');

const socket = io();
const KEYWORD = "tangkap"
const KEYWORD2 = "ppp";

let streetImg,
    bgCity,
    car1,
    car2,
    redCar,
    blueCar,
    finish,
    initialPositionCar,
    velocity,
    carSize;

let gas = {
    car1: 0,
    car2: 0,
}
let goal = 150;

function preload() {
    bgImg = loadImage('../assets/images/background.png');
    streetImg = loadImage('../assets/images/jalan.png');
    finishImg = loadImage('../assets/images/finish.png');
    redCar = loadImage('../assets/images/mobil_biru.png');
    blueCar = loadImage('../assets/images/mobil_merah.png');
}

function setup() {
    let myCanvas = createCanvas(innerWidth, innerHeight);
    myCanvas.parent(myContainer);
    initialPositionCar = innerWidth / 15;
    carSize = { width: 135, height: 45 };
    goalSize = { width: 40, height: 165 };
    finish = innerWidth - initialPositionCar * 2;
    velocity = (finish - initialPositionCar - carSize.width + goalSize.width) / (goal * 10);

    car1 = new Car({
        x: initialPositionCar,
        y: 350,
        variant: blueCar,
        velocity,
        carSize,
    });
    car2 = new Car({
        x: initialPositionCar,
        y: 425,
        variant: redCar,
        velocity,
        carSize
    });
    goal = new Goal({
        x: finish,
        y: 325,
        width: goalSize.width,
        height: goalSize.height,
        finishImg: finishImg
    });
}

// Draw / render Canvas perFrame here
function draw() {
    drawingContext.clearRect(0, 0, width, height);
    background(179, 194, 128);
    image(bgImg, 0, 50 - innerWidth / 6, innerWidth, 290 + innerWidth / 7);
    image(streetImg, 0, 300, innerWidth, 200);
    if (gas.car1 > 0) {
        gas.car1 -= 1;
        if (gas.car1 % 10 === 0) {
            car1.currentPoint += 1;
        }
        car1.update();
    }
    if (gas.car2 > 0) {
        gas.car2 -= 1;
        if (gas.car2 % 10 === 0) {
            car2.currentPoint += 1;
        }
        car2.update();
    }
    goal.show();
    car1.show();
    car2.show();
}

// event for get data chat from TIktok LiveStream
socket.on('chat', (data) => {
    if (data.comment === KEYWORD.toLowerCase()) {
        gas.car1 += 10;
    }
    if (data.comment === KEYWORD2.toLowerCase()) {
        gas.car2 += 10;
    }
});

socket.on('gift', (data) => {
    console.log(data);
})
