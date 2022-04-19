const questionCardContainer = document.querySelector('.questions > .cards');
const questionContainer = document.querySelector('.questions .__title');
const listContainer = document.querySelector('.leaderboard > .list-container');
const leaderboard = new Map();
let answer;

const init = async () => {
    socket.on('chat', handleChat);
    const result = await getQuestion();
    removeAllChild(listContainer);
    questionContainer.innerHTML = '';
    leaderboard.clear();
    answer = result.jawaban;
    questionContainer.textContent = result.soal;
    setCard();

}

const myCreateElement = (el) => {
    return document.createElement(el);
}

const removeAllChild = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const handleBtnClick = () => {
    const modalWrapper = document.querySelector('.modal-wrapper');
    modalWrapper.remove();
    init();
}

const createModalResult = () => {
    socket.off('chat', handleChat);
    const modalContainer = myCreateElement('div');
    modalContainer.classList.add('modal-wrapper');
    const modalCard = myCreateElement('div');
    modalCard.classList.add('modal-result');
    const modalTitle = myCreateElement('h2');
    modalTitle.classList.add('modal-title');
    modalTitle.textContent = 'Result';
    const modalListContainer = myCreateElement('ul');
    modalListContainer.classList.add('list-container');
    let count = 0;
    for (const [_, data] of leaderboard.entries()) {
        count += 1;
        const li = createListLeaderboard(data);
        const posLeaderboard = myCreateElement('div');
        posLeaderboard.classList.add('leaderboard-position');
        posLeaderboard.textContent = count;
        li.append(posLeaderboard);
        modalListContainer.append(li);
    }
    const btn = myCreateElement('button');
    btn.classList.add('btn-restart', 'btn-orange');
    btn.textContent = 'play again';
    btn.addEventListener('click', handleBtnClick);
    modalCard.append(modalTitle, modalListContainer, btn);
    modalContainer.append(modalCard);

    return modalContainer;
}

const createListLeaderboard = ({ profilePictureUrl, nickname }) => {
    const li = document.createElement('li');
    li.classList.add('list-leaderboard');
    const profileImage = document.createElement('img');
    profileImage.classList.add('leaderboard-avatar');
    profileImage.alt = 'avatar';
    profileImage.src = profilePictureUrl;
    const nickName = document.createElement('span');
    nickName.classList.add('leaderboard-nickname')
    nickName.textContent = nickname;
    li.append(profileImage, nickName);
    return li;
}

const getQuestion = async () => {
    const response = await fetch('http://localhost:6996/quest.json');
    const quest = await response.json();
    return quest[Math.floor(Math.random() * quest.length)]
}

const filterRandString = (num) => {
    const max = answer.length >= 12 ? Math.floor(answer.length * 1.8) : 15;
    const randNum = Math.floor(Math.random() * max);
    return num / randNum > 1 ? answer[num] : ""
}

const setCard = () => {
    for (let x = 0; x < answer.length; x++) {
        if (answer[x] !== " ") {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');
            text = filterRandString(x);
            if (text) cardDiv.classList.add('active');
            cardDiv.textContent = text;
            questionCardContainer.append(cardDiv)
        }
    }
}

const handleChat = (data) => {
    if (leaderboard.size < 3 && answer && data.comment.toLowerCase().replace(' ', '') === answer.toLowerCase().replace(' ', '') && !leaderboard.has(data.userId)) {
        leaderboard.set(data.userId, { ...data });
        listContainer.append(createListLeaderboard(data));
        if (leaderboard.size === 3) {
            document.querySelector(".container").append(createModalResult());
        }
    }
}

init();



