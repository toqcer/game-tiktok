const questionCardContainer = document.querySelector('.questions > .cards');
const questionContainer = document.querySelector('.questions .__title');
const listContainer = document.querySelector('.leaderboard > .list-container');
const modalListContainer = document.querySelector('.modal-result > .list-container');
const btnRestart = document.querySelector('.btn-restart');
const modalWrapper = document.querySelector('.modal-wrapper');

const leaderboard = new Map();
let answer;

const init = async () => {
    socket.on('chat', handleChat);
    const result = await getQuestion();
    removeAllChild(listContainer);
    removeAllChild(modalListContainer);
    removeAllChild(questionContainer);
    removeAllChild(questionCardContainer);
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
    modalWrapper.classList.toggle('hidden');
    init();
}

const showModalResult = () => {
    socket.off('chat', handleChat);
    modalWrapper.classList.toggle('hidden');
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
}

const createListLeaderboard = ({ profilePictureUrl, nickname }) => {
    const li = myCreateElement('li');
    li.classList.add('list-leaderboard');
    const profileImage = myCreateElement('img');
    profileImage.classList.add('leaderboard-avatar');
    profileImage.alt = 'avatar';
    profileImage.src = profilePictureUrl;
    const nickName = myCreateElement('span');
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
            const cardDiv = myCreateElement('div');
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
            showModalResult();
        }
    }
}

btnRestart.addEventListener('click', handleBtnClick);
init();



