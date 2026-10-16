import {haveLine} from "./way.js";
import {shifltRotate, shiftConner, shiftHalf, shiftLeftRight, shiftUpDown} from "./connect.js";
import {BLOCKER, EMPTY} from "./config.js";
import {renderBoard} from "./board.js";

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