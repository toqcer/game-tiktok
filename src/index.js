const myContainer = document.querySelector('#myContainer');
const modalWrapper = document.querySelector('.modal-wrapper');
const modalTitle = document.querySelectorAll('.modal-title');
const imgWrapper = document.querySelector('.img-wrapper');
const btnRestart = document.querySelector('.btn-restart');

const KEYWORD = "pp"
const KEYWORD2 = "tangkap";

let src = 'assets/sounds/tes.mp3';
const sound = new Howl({
    src,
    volume: 0.2,
    loop: true,
})

sound.play();

const winAudio = new Audio('assets/sounds/tes3.mp3');

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

let myFrameRates = 10;

let gas = {
    car1: 0,
    car2: 0,
}
let target = 150;
let goal;

let winner = '';

const removeAllChild = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const handleComment = (data) => {
    if (data.comment === (KEYWORD.toLowerCase())) {
        gas.car1 += (1 * myFrameRates);
    }
    if (data.comment === (KEYWORD2.toLowerCase())) {
        gas.car2 += (1 * myFrameRates);
    }
}

const handleBtnClick = () => {
    modalWrapper.classList.toggle('hidden');
    init();
}

const showModal = () => {
    winAudio.play();
    socket.off('chat', handleComment);
    modalWrapper.classList.toggle('hidden');
    const text = winner === 'draw' ? 'draw' : 'the winner is';
    modalTitle[1].textContent = text;
    if (winner !== 'draw') {
        const imgWinner = myCreateElement('img');
        imgWinner.classList.add('img-winner');
        imgWinner.src = winner === "car1" && 'assets/images/mobil_merah.png' || winner === "car2" && 'assets/images/mobil_biru.png';
        imgWinner.alt = 'PictWinner';
        imgWrapper.appendChild(imgWinner);
    }
}

const init = () => {
    socket.on('chat', handleComment);
    winner = ''
    removeAllChild(imgWrapper);
    car1.position.x = initialPositionCar;
    car2.position.x = initialPositionCar;
    car1.currentPoint = 0
    car2.currentPoint = 0;
    gas.car1 = 0;
    gas.car2 = 0;
}

function preload() {
    bgImg = loadImage('../assets/images/background.png');
    streetImg = loadImage('../assets/images/jalan.png');
    finishImg = loadImage('../assets/images/finish.png');
    redCar = loadImage('../assets/images/mobil_merah.png');
    blueCar = loadImage('../assets/images/mobil_biru.png');
}

function setup() {
    let myCanvas = createCanvas(innerWidth, innerHeight);
    myCanvas.parent(myContainer);
    initialPositionCar = innerWidth / 15;
    carSize = { width: 135, height: 45 };
    goalSize = { width: 40, height: 165 };
    finish = innerWidth - initialPositionCar * 2;
    velocity = (finish - initialPositionCar - carSize.width + goalSize.width) / (target * myFrameRates);

    car1 = new Car({
        x: initialPositionCar,
        y: 350,
        variant: redCar,
        velocity,
        carSize,
    });
    car2 = new Car({
        x: initialPositionCar,
        y: 425,
        variant: blueCar,
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
    init();
}

// Draw / render Canvas perFrame here
function draw() {
    if (!Boolean(winner)) {
        // event for get data chat from TIktok LiveStream
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
        if (car1.currentPoint >= target && car2.currentPoint >= target) {
            winner = 'draw';
            showModal();
        } else if (car1.currentPoint >= target) {
            winner = 'car1';
            showModal();
        } else if (car2.currentPoint >= target) {
            winner = 'car2';
            showModal();
        }
    }
}

btnRestart.addEventListener('click', handleBtnClick);