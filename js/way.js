import {BLOCKER, BOARD_COLS, BOARD_ROWS, EMPTY} from "./config.js";

export  function isStraightLine(board,p,d){
    if(p.r === d.r){
        const min = Math.min(p.c,d.c);
        const max = Math.max(p.c,d.c);
        for(let i = min+1 ; i < max; i++){
            if(board[p.r][i] !== EMPTY) return false;
        }
        return true;
    }
    if(p.c === d.c){
        const min = Math.min(p.r,d.r);
        const max = Math.max(p.r,d.r);
        for(let i = min+1; i < max; i++){
            if(board[i][p.c] !== EMPTY) return false;
        }
        return true;
    }
    return false;
}
function isMTOrEnd(board, point, p, d){
    if((point.r === p.r && point.c === p.c) || (point.c === d.c && point.r === d.r)){
        return true;
    }
    return board[point.r][point.c] === EMPTY;
}
export function checkOneTurn(board, p, d){
    const chop = {r: p.r, c: d.c};
    if(isMTOrEnd(board, chop, p,d)){
        if(isStraightLine(board, chop,d) && isStraightLine(board, chop, p)){
            return true;
        }
    }
    const chop1 = {r: d.r, c: p.c};
    if(isMTOrEnd(board, chop1, p,d)){
        if(isStraightLine(board, chop1,d) && isStraightLine(board, chop1, p)){
            return true;
        }
    }
    return false;
}
export function twoTurn(board, p, d){
    for(let i = 0; i < BOARD_ROWS; i++){
        const temp = {r: i, c:p.c};
        if(board[i][p.c]===EMPTY){
            if(isStraightLine(board, temp,p) && checkOneTurn(board, temp, d)){
                return true;
            }
        }
    }
    for(let i = 0; i < BOARD_COLS; i++){
        const temp1 = {r :p.r, c:i };
        if(board[p.r][i] === EMPTY){
            if(isStraightLine(board, p,temp1) && checkOneTurn(board, temp1,d)){
                return true;
            }
        }
    }
    return false;
}

export function haveLine(board, p, d){
    if(board[p.r][p.c] === EMPTY || board[d.r][d.c] === EMPTY){
        return false;
    } if(board[p.r][p.c] !== board[d.r][d.c]){
        return false;
    }
    if (board[p.r][p.c] === BLOCKER || board[d.r][d.c] === BLOCKER) return false;
    if(isStraightLine(board,p,d) || checkOneTurn(board, p,d) || twoTurn(board, p,d)){
        return true;
    }
    return false;
}