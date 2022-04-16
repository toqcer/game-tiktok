const socket = io();
let answer;
const questionCardContainer = document.querySelector('.questions > .cards');
const questionContainer = document.querySelector('.questions .__title');
const giftContainer = document.querySelector('.gift-container');
const listContainer = document.querySelector('.list-container');
const leaderboard = new Map();
const giftQueue = [];
const quest = [
    {
        soal: "Nyarinya susah, setelah dapet dibuang, apaan?",
        jawaban: "Upil"
    },
    {
        soal: "Naik Turun, Jaket, Celana, Tas",
        jawaban: "Resleting"
    },
    {
        soal: "Kau tau sejak pertama bertemu, terbayang _____ indah di matamu, kau berikan tatapan cinta untukku",
        jawaban: "senyum"
    },

]

// const API_KEY = 'ae4d82f24d33';

const getQuestion = () => {
    // const response = await fetch(`https://zenzapi.xyz/api/tekateki?apikey=${API_KEY}`)
    // const json = await response.json();
    // return json;
    return quest.pop();
}

const filterRandString = (num) => {
    const max = answer.length >= 15 ? Math.floor(answer.length * 1.8) : 15;
    const randNum = Math.floor(Math.random() * max);
    return num / randNum > 1 ? answer[num] : ""
}

const init = () => {
    const result = getQuestion();
    listContainer.innerHTML = '';
    questionCardContainer.innerHTML = '';
    if (result !== {}) {
        answer = result.jawaban;
        questionContainer.innerHTML = result.soal;
        setCard();
    }
}

const setCard = () => {
    for (let x = 0; x < answer.length; x++) {
        if (answer[x] !== " ") {
            if (x === 1) {
                questionCardContainer.innerHTML += `<div class="card">${answer[x]}</div>`
                continue
            }
            questionCardContainer.innerHTML += `<div class="card">${filterRandString(x)}</div>`
        }
    }
}

init();

socket.on('chat', (data) => {
    if (leaderboard.size < 3 && answer) {
        if (data.comment.toLowerCase().trim() === 'tangkap') {
            if (!leaderboard.has(data.userId)) {
                leaderboard.set(data.userId, { ...data });
                listContainer.innerHTML += `
                <li class="list-leaderboard">
                    <span>${leaderboard.size}.</span>
                    <img class="avatar" src="${data.profilePictureUrl}"> 
                    <span>${data.nickname}</span>
                </li>
                `
            }
        }
    }
});

socket.on('gift', (data) => {
    console.log(data);
    giftContainer.innerHTML = `
        <div class="gift-card-container">
            <div class="gift-card">
                <div class="bg-card"></div>
                <img class="avatar" src="${data.profilePictureUrl}" alt="avatar">
                <div class="gift-info">
                    <span class="nickname">${data.nickname}</span>
                    <p class="detail">mengirim ${data.giftName}</p>
                </div>
                <img src="${data.giftPictureUrl}" alt="" class="gift-icon">
            </div>
            <div class="gift-counter">
                <p>x<span class="counter">${data.repeatCount}</span></p>
            </div>
        </div>
    `
})
