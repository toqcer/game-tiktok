const socket = io();
const giftContainer = document.querySelector('.gift-container');

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
            // newCard.classList.add('hidden');
            giftContainer.removeChild(newCard);
        }, 500)
    }
    else {
        giftContainer.append(createGiftCard(data));
    }
})