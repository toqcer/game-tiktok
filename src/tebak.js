const socket = io();
const questionCardContainer = document.querySelector('.questions > .cards');
const questionContainer = document.querySelector('.questions .__title');
const listContainer = document.querySelector('.list-container');
const leaderboard = new Map();
let answer;
const btn = document.createElement('button');
btn.textContent = 'play again';
btn.addEventListener('click', () => init());
document.querySelector('.container').append(btn);

const removeAllChild = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
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

const getQuestion = async () => {
    const response = await fetch('http://localhost:6996/quest.json');
    const quest = await response.json();
    return quest[Math.floor(Math.random() * quest.length)]
}

const filterRandString = (num) => {
    const max = answer.length >= 15 ? Math.floor(answer.length * 1.8) : 15;
    const randNum = Math.floor(Math.random() * max);
    return num / randNum > 1 ? answer[num] : ""
}

const init = async () => {
    const result = await getQuestion();
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
    const { userId, giftId, repeatCount, repeatEnd } = data;
    const oldCard = document.getElementById(userId + String(giftId));
    if (oldCard) {
        if (repeatEnd) {
            // oldCard.classList.add('hidden');
            giftContainer.removeChild(oldCard);
        }
        else {
            const counter = oldCard.querySelector('.gift-counter .counter');
            counter.textContent = repeatCount;
        }
    }
    else if (repeatEnd) {
        const newCard = createGiftCard(data);
        giftContainer.append(newCard);
        setTimeout(() => {
            newCard.classList.add('hidden');
            setTimeout(() => {
                giftContainer.removeChild(newCard);
            }, 200)
        }, 1000)
    }
    else {
        giftContainer.append(createGiftCard(data));
    }
})
