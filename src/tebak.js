let question = "Bariq Dharmawan";
const questionCardContainer = document.querySelector('.questions > .cards');

const filterRandString = (num) => {
    const max = question.length >= 15 ? Math.floor(question.length * 1.8) : 15;
    const randNum = Math.floor(Math.random() * max);
    return num / randNum > 1 ? question[num] : ""
}

for (let x = 0; x < question.length; x++) {
    if (question[x] !== " ") {
        if (x === 1) {
            questionCardContainer.innerHTML += `<div class="card">${question[x]}</div>`
            continue
        }
        questionCardContainer.innerHTML += `<div class="card">${filterRandString(x)}</div>`
    }
}