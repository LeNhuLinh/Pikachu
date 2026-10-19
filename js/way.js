import {BLOCKER, BOARD_COLS, BOARD_ROWS, EMPTY} from "./config.js";
import {shuffleArray} from "./board.js";

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
            return chop;
        }
    }
    const chop1 = {r: d.r, c: p.c};
    if(isMTOrEnd(board, chop1, p,d)){
        if(isStraightLine(board, chop1,d) && isStraightLine(board, chop1, p)){
            return chop1;
        }
    }
    return null;
}
export function twoTurn(board, p, d){
    let best = null;
    let bestLen = Infinity;
    for(let i = 0; i < BOARD_ROWS; i++){
        const mid = {r: i, c: p.c};
        if(board[i][p.c] === EMPTY && isStraightLine(board, p, mid)){
            const corner = checkOneTurn(board, mid, d);
            if(corner){
                const len = dist(p,mid)+dist(mid,corner)+dist(corner,d);
                if (len<bestLen){
                    bestLen = len;
                    best = [mid,corner]
                }
            }
        }
    }
    for(let i = 0; i < BOARD_COLS; i++){
        const mid = {r: p.r, c: i};
        if(board[p.r][i] === EMPTY && isStraightLine(board, p, mid)){
            const corner = checkOneTurn(board, mid, d);
            if(corner){
                const len = dist(p, mid) + dist(mid, corner) + dist(corner, d);
                if (len < bestLen) {
                    bestLen = len;
                    best = [mid, corner];
                }
            }
        }
    }
    return best;
}
export function haveLine(board, p, d){
    return getPath(board, p, d) !== null;
}
export function findHint(board){
    const same ={};
    for(let i = 1; i < BOARD_ROWS; i++){
        for(let j = 1; j < BOARD_COLS; j++){
            const temp = board[i][j];
            if(temp === EMPTY||temp === BLOCKER){
                continue;
            }
            if(!same[temp]){
                same[temp]=[];
            }
            same[temp].push({r:i, c:j});
        }
    }
        for(const list of Object.values(same)){
            for(let j = 0; j < list.length; j++){
                for(let k = j+1; k < list.length; k++){
                    if (haveLine(board, list[j], list[k])){
                        return [list[j],list[k]];
                    }
                }
            }
        }

    return null;
}
export function shuffleBoard(board){
    const pos =[];
    const val = [];
    for(let i = 1; i < BOARD_ROWS; i++){
        for(let j = 1; j < BOARD_COLS; j++){
            const temp = board[i][j];
            if(temp === EMPTY || temp === BLOCKER){ continue;}
            pos.push({r:i,c:j});
            val.push(temp);
        }
    }

    for(let i = 1; i < 124; i++){
        shuffleArray(val);
        for(let j = 0; j < pos.length; j++) {
            board[pos[j].r][pos[j].c] = val[j];
        }
        if (findHint(board)!==null){
            return true;
        }

    }
    return shuffleIntoEmpty(board);
}
export  function isBoardClear(board){
    for(let i = 1; i < BOARD_ROWS; i++){
        for(let j = 1; j < BOARD_COLS; j++){
            const temp = board[i][j];
            if(temp !== EMPTY && temp !== BLOCKER){
                return false;
            }
        }
    }
    return true;
}
export function countTypes(board) {
    const count = {};
    for (let r = 1; r < board.length - 1; r++) {
        for (let c = 1; c < board[0].length - 1; c++) {
            const v = board[r][c];
            if (v === 0 || v === -1) continue; // Bỏ qua EMPTY (0) và BLOCKER (-1)
            count[v] = (count[v] || 0) + 1;
        }
    }
    return count;
}
export  function getPath(board, p, d){
    if (board[p.r][p.c] === EMPTY || board[d.r][d.c] === EMPTY) return null;
    if (board[p.r][p.c] === BLOCKER || board[d.r][d.c] === BLOCKER) return null;
    if (board[p.r][p.c] !== board[d.r][d.c]) return null;
    if (p.r === d.r && p.c === d.c) return null;
    if(isStraightLine(board,p,d)){
        return [p,d];
    }
    const conner =checkOneTurn(board,p,d);
    if(conner){
        return[p,conner,d]
    }
    const towConner =twoTurn(board,p,d);
    if(towConner!==null){
        const mid =towConner[0];
        const conner = towConner[1];
        return[p,mid,conner,d];
    }
    return null;
}
export  function  shuffleIntoEmpty(board){
    const cells =[];
    const val =[];
    for(let i = 1; i < BOARD_ROWS; i++){
        for(let j = 1; j < BOARD_COLS; j++){
            const temp = board[i][j];
            if( temp === BLOCKER){ continue;}
            cells.push({r: i, c: j});
            if(temp !== EMPTY){ val.push(temp); }
        }
    }
    for(let i = 1; i < 100; i++){
        shuffleArray(cells);
        for(const cell of cells){
            board[cell.r][cell.c]= EMPTY;
        }
        for (let k = 0; k < val.length; k++){
            board[cells[k].r][cells[k].c] = val[k];
        }
        if (findHint(board) !== null) return true;
    }
    return false;
}
function dist(a, b){
    return Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
}
