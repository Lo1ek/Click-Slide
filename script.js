const container = document.querySelector(".container")
const gallery = document.querySelector(".gallery")
const containerWidth = 500
const time = document.querySelector(".time")
const imgTab = ["img/img1.jpg", "img/img2.jpg", "img/img3.jpg", "img/img4.jpg"]
const ranking = document.querySelector(".rankingScore")
const rankingContainer = document.querySelector(".ranking")
let rankTab3 = []
let rankTab4 = []
let rankTab5 = []
let rankTab6 = []
if(getCookie("rank3")) getCookie("rank3").split(",").forEach(el => rankTab3.push(el))
if(getCookie("rank4")) getCookie("rank4").split(",").forEach(el => rankTab4.push(el))
if(getCookie("rank5")) getCookie("rank5").split(",").forEach(el => rankTab5.push(el))
if(getCookie("rank6")) getCookie("rank6").split(",").forEach(el => rankTab6.push(el))
let currentImg = 1
let timerState = 0
let blankId
let isEdgeRight
let isEdgeLeft
let isEdgeTop
let isEdgeBottom
let isMixing = 0
let ms = 0
let s = 0
let m = 0
let h = 0

container.style.width = `${containerWidth}px`

imgTab.forEach((photo, nr) => {
    if (nr == 1) {
        gallery.innerHTML += `<img src="${photo}" alt="img" class="active"></img>`
    } else {
        gallery.innerHTML += `<img src="${photo}" alt="img"></img>`
    }
})

document.querySelectorAll(".gallery img").forEach((photo, nr) => {
    photo.style.order = nr + 1
    photo.setAttribute("value", nr + 1)
})

function galleryRight() {
    if (currentImg == imgTab.length - 1) {
        currentImg = 0
    } else currentImg++
    for (let i = 1; i < imgTab.length + 1; i++) {
        document.querySelector(`.gallery img[value = "${i}"]`).style.order = i - 1
        document.querySelector(`.gallery img[value = "${i}"]`).setAttribute("value", i - 1)
    }
    document.querySelector(`.gallery img[value = "0"]`).style.order = imgTab.length
    document.querySelector(`.gallery img[value = "0"]`).setAttribute("value", imgTab.length)
    document.querySelectorAll(".gallery img").forEach((photo) => {
        if (photo.classList.contains("active")) {
            photo.classList.remove("active")
            document.querySelector(`.gallery img[value = "2"]`).classList.add("active")
        }
    })
    container.innerHTML = `<img src="${imgTab[currentImg]}" alt="img"></img>`
}
function galleryLeft() {
    if (currentImg == 0) {
        currentImg = imgTab.length - 1
    } else currentImg--
    for (let i = imgTab.length; i > 0; i--) {
        document.querySelector(`.gallery img[value = "${i}"]`).style.order = i + 1
        document.querySelector(`.gallery img[value = "${i}"]`).setAttribute("value", i + 1)
    }
    document.querySelector(`.gallery img[value = "${imgTab.length + 1}"]`).style.order = 1
    document.querySelector(`.gallery img[value = "${imgTab.length + 1}"]`).setAttribute("value", 1)
    document.querySelectorAll(".gallery img").forEach((photo) => {
        if (photo.classList.contains("active")) {
            photo.classList.remove("active")
            document.querySelector(`.gallery img[value = "2"]`).classList.add("active")
        }
    })
    container.innerHTML = `<img src="${imgTab[currentImg]}" alt="img"></img>`
}
function containsSpecialChars(str) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~ ]/;
    return specialChars.test(str);
}
function getCookie(name){
    const cDecoded = decodeURIComponent(document.cookie)
    const cArray = cDecoded.split("; ")
    let result = null

    cArray.forEach(el => {
        if(el.indexOf(name) == 0) result = el.substring(name.length + 1)
    })
    return result
}

rankTab3.forEach((rank, nr) => {
    ranking.innerHTML += `<span>${nr + 1}. ${rank}</span>`
})
if(ranking.offsetWidth > 500){
    ranking.style.animation = `ranking ${rankTab3.length * 4}s infinite linear`
}else{
    ranking.style.animation = "none"
}
rankingContainer.setAttribute('data-before', `3x3`);

let game = {
    generate(n) {
        if(n == 3) tab = rankTab3
        if(n == 4) tab = rankTab4
        if(n == 5) tab = rankTab5
        if(n == 6) tab = rankTab6
        ranking.innerHTML = ""
        tab.forEach((rank, nr) => {
            ranking.innerHTML += `<span>${nr + 1}. ${rank}</span>`
        })
        if(ranking.offsetWidth > 500){
             ranking.style.animation = `ranking ${tab.length * 2}s infinite linear`
        }else{
            ranking.style.animation = "none"
        }
        rankingContainer.setAttribute('data-before', `${n}x${n}`);
        if(isMixing == 0){
            let counter = 1;
            container.innerHTML = ""
            container.style.gridTemplateColumns = `repeat(${n}, calc(${containerWidth - 40}px / ${n}))`
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    const imgPart = document.createElement("div")
                    container.appendChild(imgPart)
                    imgPart.classList.add("imgPart")
                    imgPart.classList.add(`imgPart${counter}`)
                    imgPart.setAttribute("value", counter)
                    if (counter == n * n) imgPart.classList.add("blank")
                    blankId = n * n
                    imgPart.style.width = `${(containerWidth - 40) / n}px`
                    imgPart.style.backgroundImage = `url(${imgTab[currentImg]})`
                    imgPart.style.backgroundSize = `${containerWidth - 40}px`
                    imgPart.style.backgroundPositionX = `-${((containerWidth - 40) / n) * j}px`
                    imgPart.style.backgroundPositionY = `-${((containerWidth - 40) / n) * i}px`
                    imgPart.style.order = `${counter}`
                    imgPart.setAttribute("onclick", `game.move(${counter}, ${n})`)
                    counter++
                }
            }
            timerState = 0
            isMixing = 1
            game.mix(n)
        }
    },
    move(id, n) {
        isEdgeLeft = 0
        isEdgeRight = 0
        if (id != blankId) {
            for (let i = 1; i < n; i++) {
                if (id == n * i) isEdgeRight = 1
                if (id == 1 + n * i) isEdgeLeft = 1
            }
            if (id == blankId - n || id == blankId + n) {
                game.swap(id, blankId, n)
            } else if (isEdgeLeft == 0 && id == blankId + 1) {
                game.swap(id, blankId, n)
            } else if (isEdgeRight == 0 && id == blankId - 1) {
                game.swap(id, blankId, n)
            }
        } else {

        }
        if (isMixing == 0) game.check(n)

    },
    swap(puzzle, blank, n) {
        document.querySelector(`.imgPart[value = "${puzzle}"]`).style.order = blank
        document.querySelector(`.imgPart[value = "${blank}"]`).style.order = puzzle
        document.querySelector(`.imgPart[value = "${blank}"]`).setAttribute("value", puzzle)
        document.querySelector(`.imgPart[value = "${puzzle}"]`).setAttribute("value", blank)
        document.querySelector(`.imgPart[value = "${blank}"]`).setAttribute("onclick", `game.move(${blank}, ${n})`)
        document.querySelector(`.imgPart[value = "${puzzle}"]`).setAttribute("onclick", `game.move(${puzzle}, ${n})`)
        blankId = puzzle
    },
    mix(n) {
        let counter = 1
        mixInterval = setInterval(function () {
            if (counter != n * n * 10) {
                isEdgeLeft = 0
                isEdgeRight = 0
                isEdgeTop = 0
                isEdgeBottom = 0
                for (let j = 1; j < n + 1; j++) {
                    if (blankId == n * j) isEdgeRight = 1
                    if (blankId == 1 + n * (j - 1)) isEdgeLeft = 1
                    if (blankId == j) isEdgeTop = 1
                    if (blankId == n * n - (j - 1)) isEdgeBottom = 1
                }
                let tab = []
                if (isEdgeRight == 0) tab.push(blankId + 1)
                if (isEdgeLeft == 0) tab.push(blankId - 1)
                if (isEdgeBottom == 0) tab.push(blankId + n)
                if (isEdgeTop == 0) tab.push(blankId - n)
                game.move(tab[Math.floor(Math.random() * tab.length)], n)
                counter++
            } else clearInterval(mixInterval), isMixing = 0, game.startTime()
        }, 10)
    },
    reset() {
        container.innerHTML = `<img src="${imgTab[currentImg]}" alt="img"></img>`
        container.style.gridTemplateColumns = `repeat(1, ${containerWidth - 40}px)`
        time.innerHTML = `
        <img src="cyferki/c0.gif" alt="time">
        <img src="cyferki/c0.gif" alt="time">
        <img src="cyferki/colon.gif" alt="time">
        <img src="cyferki/c0.gif" alt="time">
        <img src="cyferki/c0.gif" alt="time">
        <img src="cyferki/colon.gif" alt="time">
        <img src="cyferki/c0.gif" alt="time">
        <img src="cyferki/c0.gif" alt="time">
        <img src="cyferki/dot.gif" alt="time">
        <img src="cyferki/c0.gif" alt="time">
        <img src="cyferki/c0.gif" alt="time">
        `
        clearInterval(mixInterval), isMixing = 0
        timerState = 0
    },
    check(n) {
        for (let i = 0; i < n * n; i++) {
            if (document.querySelector(`.imgPart${i + 1}`).getAttribute("value") != i + 1) return
        }
        timerState = 0
        game.reset()
        document.querySelector(".winScreen").style.display = "grid"
        document.querySelector(".winScreen p").innerText = `Wygrałeś w trybie ${n}x${n} w czasie ${h}h ${m}m ${s}.${ms}s`
        setTimeout(() => {
            pass = 0
            while(pass == 0){
                nick = prompt("Podaj swój nick")
                if(nick && containsSpecialChars(nick) == false && nick.length <= 8) pass = 1
                else if(containsSpecialChars(nick)) alert("Nick nie może zawierać snaków specjalnych")
                else if(nick.length > 8) alert("Długość nicku nie może przekraczać 8 znaków")
                else alert("Proszę podać nick")
            }
            if(n == 3){
                game.rankUpdate(rankTab3, n, h, m, s, ms, nick)
                document.cookie = `rank3=${rankTab3}`
            }
            if(n == 4){
                game.rankUpdate(rankTab4, n, h, m, s, ms, nick)
                document.cookie = `rank4=${rankTab4}`
            }
            if(n == 5){
                game.rankUpdate(rankTab5, n, h, m, s, ms, nick)
                document.cookie = `rank5=${rankTab5}`
            }
            if(n == 6){
                game.rankUpdate(rankTab6, n, h, m, s, ms, nick)
                document.cookie = `rank6=${rankTab6}`
            }
        }, 50)  
    },
    rankUpdate(tab, n, h, m, s, ms, nick){
        for(let i = 0; i < tab.length; i++){
            if(Number(h) < Number(tab[i].slice(tab[i].search(" - ") + 3, tab[i].search(" - ") + 5))){
                tab.splice(i, 0, `${nick} - ${h}:${m}:${s}.${ms}`)
                break
            }else if(Number(m) < Number(tab[i].slice(tab[i].search(" - ") + 6, tab[i].search(" - ") + 8)) && (Number(h) == Number(tab[i].slice(tab[i].search(" - ") + 3, tab[i].search(" - ") + 5)))){
                tab.splice(i, 0, `${nick} - ${h}:${m}:${s}.${ms}`)
                break
            }else if(Number(s) < Number(tab[i].slice(tab[i].search(" - ") + 9, tab[i].search(" - ") + 11)) && Number(m) == Number(tab[i].slice(tab[i].search(" - ") + 6, tab[i].search(" - ") + 8)) && (Number(h) == Number(tab[i].slice(tab[i].search(" - ") + 3, tab[i].search(" - ") + 5)))){
                tab.splice(i, 0, `${nick} - ${h}:${m}:${s}.${ms}`)
                break
            }else if(Number(ms) < Number(tab[i].slice(tab[i].search(" - ") + 12, tab[i].search(" - ") + 14)) && Number(s) == Number(tab[i].slice(tab[i].search(" - ") + 9, tab[i].search(" - ") + 11)) && Number(m) == Number(tab[i].slice(tab[i].search(" - ") + 6, tab[i].search(" - ") + 8)) && (Number(h) == Number(tab[i].slice(tab[i].search(" - ") + 3, tab[i].search(" - ") + 5)))){
                tab.splice(i, 0, `${nick} - ${h}:${m}:${s}.${ms}`)
                break
            }else if(i == tab.length - 1){
                tab.push(`${nick} - ${h}:${m}:${s}.${ms}`)
                break
            }
        }
        if(tab.length == 0) tab.push(`${nick} - ${h}:${m}:${s}.${ms}`)
        if(tab.length > 10) tab = tab.slice(0, -1)
        ranking.innerHTML = ""
        tab.forEach((rank, nr) => {
            ranking.innerHTML += `<span>${nr + 1}. ${rank}</span>`
        })
        if(ranking.offsetWidth > 500){
             ranking.style.animation = `ranking ${tab.length * 2}s infinite linear`
        }else{
            ranking.style.animation = "none"
        }
        rankingContainer.setAttribute('data-before', `${n}x${n}`);
    },
    startTime() {
        timerState = 1
        milliseconds = 0
        timerInterval = setInterval(function () {
            if (timerState == 1) {
                milliseconds += 10;
                let dateTimer = new Date(milliseconds);

                h = ('0'+dateTimer.getUTCHours()).slice(-2)
                m = ('0'+dateTimer.getUTCMinutes()).slice(-2)
                s = ('0'+dateTimer.getUTCSeconds()).slice(-2)
                ms = ('0'+dateTimer.getUTCMilliseconds()).slice(-3,-1)

                time.innerHTML = `
                    <img src="cyferki/c${Math.floor(h / 10)}.gif" alt="time">
                    <img src="cyferki/c${h % 10}.gif" alt="time">
                    <img src="cyferki/colon.gif" alt="time">
                    <img src="cyferki/c${Math.floor(m / 10)}.gif" alt="time">
                    <img src="cyferki/c${m % 10}.gif" alt="time">
                    <img src="cyferki/colon.gif" alt="time">
                    <img src="cyferki/c${Math.floor(s / 10)}.gif" alt="time">
                    <img src="cyferki/c${s % 10}.gif" alt="time">
                    <img src="cyferki/dot.gif" alt="time">
                    <img src="cyferki/c${Math.floor(ms / 10)}.gif" alt="time">
                    <img src="cyferki/c${ms % 10}.gif" alt="time">
                `
            } else clearInterval(timerInterval)
        }, 10)
    },
    winScreenHide(){
        document.querySelector(".winScreen").style.display = "none"
    },
    solve(n){
        document.querySelectorAll(".imgPart").forEach((el, nr) => {
            el.style.order = nr + 1
            el.setAttribute("value", nr + 1)
        })
        game.check(n)
    }
}