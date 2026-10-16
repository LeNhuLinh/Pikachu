import {haveLine} from "./way.js";
import {shifltRotate, shiftConner, shiftHalf, shiftLeftRight, shiftUpDown} from "./connect.js";
import {BLOCKER, EMPTY} from "./config.js";
import {createBoard, createBoardWithBlocker, renderBoard} from "./board.js";
const boardEl = document.getElementById("board");

const state={
    board:[],
    score: 0,
    matchCount:0,
    combo:0,
    level:0,
    lastPointTime:0,
    isOver:false,
    selected:null
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

    if (levelEl) levelEl.textContent = state.level;
    if (scoreEl) scoreEl.textContent = state.score;
}
function startGame(level){
        state.level = level;
        state.score = 0;
        state.combo = 0;
        state.matchCount = 0;
        state.selected = null;
        if(state.level >=9){
            state.board= createBoardWithBlocker(8);
        }
        else{
            state.board= createBoard();
        }
        renderBoard(state.board, boardEl, click);
        updateHud();
        showScreen("screen-game");
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
        type.classList.remove("is-selected");
        state.selected = null;
        return;
    }
    if(!state.selected){
        type.classList.add("is-selected");
        state.selected = {r,c,type};
        return;
    }
    const a={r:state.selected.r, c:state.selected.c};
    const b={r,c};
    if(haveLine(state.board,a,b)){
        state.board[a.r][a.c] = EMPTY;
        state.board[b.r][b.c] = EMPTY;
        addScore();
        updateHud();


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
        renderBoard(state.board, boardEl, click);
    }
    state.selected.type.classList.remove("is-selected");
    state.selected = null;
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