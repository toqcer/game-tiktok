const socket = io();
const questionCardContainer = document.querySelector('.questions > .cards');
const questionContainer = document.querySelector('.questions .__title');
const giftContainer = document.querySelector('.gift-container');
const listContainer = document.querySelector('.list-container');
const leaderboard = new Map();
let answer;
const btn = document.createElement('button')
btn.textContent = 'play again';
btn.addEventListener('click', () => init());
document.querySelector('.container').append(btn);
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
    {
        soal: "Selain uang benda apa yang sering dicari-cari orang?",
        jawaban: "Benda hilang"
    },
    {
        soal: "Hewan apa yang bersaudara?",
        jawaban: "Katak Beradik"
    },
    {
        soal: "Apa persamaan antara uang dan rahasia?",
        jawaban: "Benda hilang"
    },
    {
        soal: "Peleburan antara sel telur dan sel sperma akan membentuk",
        jawaban: "zigot"
    },
    {
        soal: "Proses peleburan ovum dan sperma disebut?",
        jawaban: "fertilisasi"
    },
    {
        soal: "Sperma pada manusia diproduksi di",
        jawaban: "testis"
    },

]

const removeAllChild = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const createGiftCard = ({ profilePictureUrl, nickname, repeatCount, giftPictureUrl, giftName, giftId, userId }) => {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add('gift-card-container');
    cardContainer.setAttribute('id', userId + String(giftId));
    const giftCard = document.createElement("div");
    giftCard.classList.add('gift-card');
    const backgroundBlur = document.createElement("div");
    backgroundBlur.classList.add('bg-card');
    const profileImage = document.createElement('img');
    profileImage.classList.add('avatar');
    profileImage.alt = 'avatar';
    profileImage.src = profilePictureUrl;
    const giftInfo = document.createElement('div');
    giftInfo.classList.add("gift-info");
    const nickName = document.createElement('span');
    nickName.textContent = nickname;
    nickName.classList.add('nickname');
    const detail = document.createElement('p');
    detail.classList.add('detail');
    detail.textContent = `mengirim ${giftName}`;
    giftInfo.append(nickName, detail);
    const giftIcon = document.createElement('img');
    giftIcon.src = giftPictureUrl;
    giftIcon.classList.add('gift-icon');
    giftCard.append(backgroundBlur, profileImage, giftInfo, giftIcon);
    const giftCounter = document.createElement('div');
    giftCounter.classList.add('gift-counter');
    const counter = document.createElement('span');
    counter.classList.add('counter');
    counter.textContent = repeatCount;
    giftCounter.append('x', counter);
    cardContainer.append(giftCard, giftCounter);

    return cardContainer;
}


const createListLeaderboard = ({ profilePictureUrl, nickname }) => {
    const li = document.createElement('li');
    li.classList.add('list-leaderboard');
    const leaderCount = document.createElement('span');
    leaderCount.textContent = leaderboard.size + ".";
    const profileImage = document.createElement('img');
    profileImage.classList.add('avatar');
    profileImage.alt = 'avatar';
    profileImage.src = profilePictureUrl;
    const nickName = document.createElement('span');
    nickName.textContent = nickname;
    li.append(leaderCount, profileImage, nickName);
    return li;
}

const getQuestion = () => {
    return quest[Math.floor(Math.random() * quest.length)]
}

const filterRandString = (num) => {
    const max = answer.length >= 15 ? Math.floor(answer.length * 1.8) : 15;
    const randNum = Math.floor(Math.random() * max);
    return num / randNum > 1 ? answer[num] : ""
}

const init = () => {
    const result = getQuestion();
    removeAllChild(listContainer);
    removeAllChild(questionCardContainer);
    leaderboard.clear();
    answer = result.jawaban;
    questionContainer.textContent = result.soal;
    setCard();

}

const setCard = () => {
    for (let x = 0; x < answer.length; x++) {
        if (answer[x] !== " ") {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');
            if (x === 1) cardDiv.textContent = answer[x]
            else cardDiv.textContent = filterRandString(x)
            questionCardContainer.append(cardDiv)
        }
    }
}

init();

socket.on('chat', (data) => {
    if (leaderboard.size < 3 && answer && data.comment.toLowerCase().trim() === answer.replace(' ', '').toLowerCase() && !leaderboard.has(data.userId)) {
        leaderboard.set(data.userId, { ...data });
        listContainer.append(createListLeaderboard(data));
    }
});

socket.on('gift', (data) => {
    const oldCard = document.getElementById(data.userId + String(data.giftId));
    if (oldCard) {
        if (data.repeatEnd) {
            oldCard.classList.add('hidden');
            setTimeout(() => {
                giftContainer.removeChild(oldCard);
            }, 200)
        }
        else {
            const counter = oldCard.querySelector('.gift-counter .counter');
            counter.textContent = data.repeatCount;
        }
    }
    else {
        giftContainer.append(createGiftCard(data));
    }
})
