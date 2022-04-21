const socket = io();
const giftContainer = document.querySelector('.gift-container');

const myCreateElement = (el) => {
    return document.createElement(el);
}

const createGiftCard = ({ profilePictureUrl, nickname, repeatCount, giftPictureUrl, giftName, giftId, userId }) => {
    const cardContainer = myCreateElement("div");
    cardContainer.classList.add('gift-card-container');
    cardContainer.setAttribute('id', userId + String(giftId));
    const giftCard = myCreateElement("div");
    giftCard.classList.add('gift-card');
    const backgroundBlur = myCreateElement("div");
    backgroundBlur.classList.add('bg-card');
    const profileImage = myCreateElement('img');
    profileImage.classList.add('avatar');
    profileImage.alt = 'avatar';
    profileImage.src = profilePictureUrl;
    const giftInfo = myCreateElement('div');
    giftInfo.classList.add("gift-info");
    const nickName = myCreateElement('span');
    nickName.textContent = nickname;
    nickName.classList.add('nickname');
    const detail = myCreateElement('p');
    detail.classList.add('detail');
    detail.textContent = `mengirim ${giftName}`;
    giftInfo.append(nickName, detail);
    const giftIcon = myCreateElement('img');
    giftIcon.src = giftPictureUrl;
    giftIcon.classList.add('gift-icon');
    giftCard.append(backgroundBlur, profileImage, giftInfo, giftIcon);
    const giftCounter = myCreateElement('div');
    giftCounter.classList.add('gift-counter');
    const counter = myCreateElement('span');
    counter.classList.add('counter');
    counter.textContent = repeatCount;
    giftCounter.append('x', counter);
    cardContainer.append(giftCard, giftCounter);

    return cardContainer;
}

socket.on('gift', (data) => {
    const { userId, giftId, repeatCount, repeatEnd } = data;
    const oldCard = document.getElementById(userId + String(giftId));
    if (oldCard) {
        if (repeatEnd) giftContainer.removeChild(oldCard);
        else {
            const counter = oldCard.querySelector('.gift-counter .counter');
            counter.textContent = repeatCount;
        }
    }
    else if (repeatEnd) {
        const newCard = createGiftCard(data);
        giftContainer.append(newCard);
        setTimeout(() => giftContainer.removeChild(newCard), 500)
    }
    else giftContainer.append(createGiftCard(data));
})