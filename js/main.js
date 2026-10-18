import {countTypes, findHint, getPath, haveLine, isBoardClear, shuffleBoard} from "./way.js";
import {shifltRotate, shiftConner, shiftHalf, shiftLeftRight, shiftUpDown} from "./connect.js";
import {BLOCKER, EMPTY} from "./config.js";
import {createBoard, createBoardWithBlocker, renderBoard} from "./board.js";
const boardEl = document.getElementById("board");
const totalTime = 100;
const state={
    board:[],
    score: 0,
    matchCount:0,
    combo:0,
    level:0,
    lastPointTime:0,
    isOver:false,
    selected:null,
    shuffleCount:10,
    hints: 1000,
    timeLeft:totalTime,
    timerId: null
}
const sounds = {
    click: new Audio("Audio/sound2.mp3"),
    match: new Audio("Audio/sound5.mp3"),
    error: new Audio("Audio/sound1.mp3"),
    shu: new Audio("Audio/sound4.mp3"),

};
sounds.match.volume = 0.8;
function playSound(type){
    if (sounds[type]) {
        sounds[type].currentTime = 0;
        sounds[type].play().catch(err => console.log("Trình duyệt chặn autoplay:", err));
    }
}
function showScreen(id){
    const screen = document.querySelectorAll(".screen");
    screen.forEach(function(screen) {
        screen.classList.remove("is-active");
    });
    document.getElementById(id).classList.add("is-active");
}
function updateHud(){
    const levelEl = document.getElementById("glevel");
    const scoreEl = document.getElementById("gscore");
    const hintEl = document.getElementById("hint");
    const shuffleEl = document.getElementById("shuffle");
    if (levelEl) levelEl.textContent = state.level;
    if (scoreEl) scoreEl.textContent = state.score;
    if (hintEl) {
        hintEl.textContent = `Gợi ý (${state.hints})`;
        hintEl.disabled = state.hints <= 0 || state.isOver;
    }

    if (shuffleEl) {
        shuffleEl.textContent = `Trộn (${state.shuffleCount})`;
        shuffleEl.disabled = state.shuffleCount <= 0 || state.isOver;
    }
}
function startGame(level){
        state.level = level;
        state.score = 0;
        state.combo = 0;
        state.matchCount = 0;
        state.selected = null;
        state.level= level;
        state.lastPointTime=0;
        state.isOver= false;
        state.shuffleCount=10;
        state.hints= 1000;
        const connector = document.getElementById("connector");
        if (connector) {
            connector.innerHTML = "";
        }
        if(state.level >=9){
            state.board= createBoardWithBlocker(8);
        }
        else{
            state.board= createBoard();
        }
        renderBoard(state.board, boardEl, click);
        updateHud();
        showScreen("screen-game");
        startTimer();
}
function addScore() {
    const base = 20;
    const comboTime = 3000;
    const time = Date.now();
    if(time -state.lastPointTime <= comboTime){
        state.combo+=1;
    }else{
        state.combo=1;
    }
    state.lastPointTime = time;
    const add = base*state.combo;
    state.score+=add;
    return state.score;
}

function click(r,c,type){
    if (state.board[r][c] === BLOCKER) return;
    if(state.selected?.type===type){
        playSound("click");
        type.classList.remove("is-selected");
        state.selected = null;
        return;
    }
    if(!state.selected){
        playSound("click");
        type.classList.add("is-selected");
        state.selected = {r,c,type};
        return;
    }
    const a={r:state.selected.r, c:state.selected.c};
    const b={r,c};
    const path = getPath(state.board,a,b);
    if(path){
        playSound("match")
        state.board[a.r][a.c] = EMPTY;
        state.board[b.r][b.c] = EMPTY;
        drawLine(path);
        addScore();
        updateHud();
        setTimeout(()=>{
        switch (state.level){
            case 1: break;
            case 2: shiftUpDown(state.board,"end");
            break;
            case 3: shiftUpDown(state.board,"start");
            break;
            case 4: shiftLeftRight(state.board,"end");
            break;
            case 5: shiftLeftRight(state.board,"start");
            break;
            case 6: shiftConner(state.board);
            break;
            case 7: shiftHalf(state.board);
            break;
            case 8: shifltRotate(state.board,state.matchCount);
            state.matchCount+=1;
            break;
            // có block;
            case 9:break;
            // có block và shift
            case 10: shiftUpDown(state.board,"end");
                break;
        }
        afterMatch();
        renderBoard(state.board, boardEl, click);
        },320);
    }else{
        playSound("error");
    }
    state.selected.type.classList.remove("is-selected");
    state.selected = null;
}
function endGame(check){
    stopTimer();
    state.isOver = true;
    document.getElementById("end-message").textContent = check? "Chiến Thắng!!!": "Game Over";
    document.getElementById("end-score").textContent = state.score;
    showScreen("screen-end")
}
function  afterMatch(){
    if(isBoardClear(state.board)){
        endGame(true);
        return;
    }
    if(findHint(state.board)===null) {
        if(state.shuffleCount<=0){
            endGame(false);
            return;
        }
        state.shuffleCount-=1;
        const check = shuffleBoard(state.board);
        if (!check) {
            endGame(false);
            return;
        }
    }

}
function updateTimeBar(){
    const timeBar = document.getElementById("time-bar");
    if(timeBar){
        const percent =(state.timeLeft/totalTime)*100;
        timeBar.style.width = percent+"%";
    }
}
function stopTimer(){
    if(state.timerId){
        clearInterval(state.timerId);
        state.timerId = null;
    }
}
function startTimer(){
    stopTimer();
    state.timeLeft=totalTime;
    const timeBar = document.getElementById("time-bar");
    if(timeBar){
        timeBar.style.transition= "none";
        timeBar.style.width = "100%";
        timeBar.offsetHeight;
        timeBar.style.transition="";
    }
    updateTimeBar();
    state.timerId = setInterval(function (){
        state.timeLeft-=1;
        updateTimeBar();
        if(state.timeLeft<=0){
            endGame(false);
        }
    },1000);
}

const levelButtons = document.querySelectorAll(".btnlevel");
levelButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
        const selectedLevel = Number(btn.dataset.value);
        startGame(selectedLevel);
    });
});

const exitBtn = document.getElementById("exit");
if (exitBtn) {
    exitBtn.addEventListener("click", function() {
        showScreen("screen-start");
    });
}
const newGameBtn = document.getElementById("new");
if (newGameBtn) {
    newGameBtn.addEventListener("click", function() {
        startGame(state.level);
    });
}
const shuffleBtn = document.getElementById("shuffle");
if(shuffleBtn) {
    shuffleBtn.addEventListener("click", function() {
        state.shuffleCount=state.shuffleCount-1;
        playSound("shu")
        shuffleBoard(state.board);
        updateHud();
        state.selected = null;
        renderBoard(state.board, boardEl, click);
    })
}
const hintBtn = document.getElementById("hint");
if (hintBtn) {
    hintBtn.addEventListener("click", function() {
        if (state.hints <= 0) {
            return;
        }
        const pair = findHint(state.board);
        if (pair === null) {
            return;
        }
        state.hints = state.hints - 1;
        updateHud();
        const [p1,p2] = pair;
        const el1 = boardEl.querySelector(`[data-r="${p1.r}"][data-c="${p1.c}"]`);
        const el2 = boardEl.querySelector(`[data-r="${p2.r}"][data-c="${p2.c}"]`);
        el1.classList.add('hint');
        el2.classList.add('hint');
        setTimeout(function (){
            el1.classList.remove("hint");
            el2.classList.remove("hint");
        },2000);
    });
}
const game = document.getElementById("newGame");
if (game) {
    game.addEventListener("click", function() {
        startGame(state.level);
        state.selected = null;
        startTimer();
    })
}
const menuBtn = document.getElementById("menuGame");
if (menuBtn) {
    menuBtn.addEventListener("click", function() {
        showScreen("screen-start")
    })
}
function drawLine(path) {
    const svg = document.getElementById("connector");
    const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    const pts = path.map(p => `${p.c + 0.5},${p.r + 0.5}`).join(" ");
    line.setAttribute("points", pts);
    svg.appendChild(line);
    setTimeout(() => line.remove(), 300);
}
