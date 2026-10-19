import {BLOCKER, COLS, EMPTY, ROWS} from "./config.js";

export function compact(arr, direction){
    const temp = [...arr];
    let begin =0;
    for (let i = begin; i <= arr.length; i++) {
        if(i===arr.length|| arr[i]===BLOCKER){
            const arr1 = arr.slice(begin,i);
            const ar2 = arr1.filter(a=>a!==EMPTY);
            const emt = Array(arr1.length-ar2.length).fill(EMPTY);
            let newArr;
            if(direction === "end"){
               newArr=[...emt,...ar2];
            }else newArr=[...ar2,...emt];
            for (let j = 0; j < newArr.length; j++){
                temp[begin+j] = newArr[j];
            }
            begin=i+1;
        }
    }
    return temp;

}
export function shiftUpDown(board, direction){
    for(let i = 1; i <= COLS; i++){
        const val=[];
        for(let j = 1; j <= ROWS; j++){
            val.push(board[j][i]);
        }
        const newVal = compact(val, direction);
        for(let j = 1; j <= ROWS; j++){
            board[j][i]=newVal[j-1];
        }
    }
    return board;
}
export function shiftLeftRight(board, direction){
    for(let i = 1; i <= ROWS; i++){
        const val=[];
        for(let j = 1; j <= COLS; j++){
            val.push(board[i][j]);
        }
        const newVal = compact(val, direction);
        for(let j = 1; j <= COLS; j++){
            board[i][j]=newVal[j-1];
        }
    }
    return board;
}
export function shiftHalf(board) {
    for(let i = 1; i <= ROWS; i++){
        const left = board[i].slice(1,9) ;
        const right = board[i].slice(9,15+1);
        const newLeft = compact(left,"end");
        const newRight = compact(right,"start");
        for(let j = 1; j <= 8; j++){
            board[i][j]=newLeft[j-1];
        }
        for(let a = 9; a <= 15; a++){
            board[i][a]= newRight[a-9];
        }
    }
    return board;
}
export function shiftConner(board){
    const prio = [];
    for(let i = ROWS; i >= 1; i--){
        for(let j = COLS; j >= 1; j--){
            prio.push({i,j});
        }
    }
    const vale = [];
    for(const val of prio){
        if(board[val.i][val.j]!==EMPTY){
            vale.push(board[val.i][val.j]);
        }
    }
    for(let i = 0; i <prio.length; i++){
        const posi= prio[i];
        if(i<vale.length){
            board[posi.i][posi.j]= vale[i];
        }else  board[posi.i][posi.j]= EMPTY;

    }
    return board;
}
export function shifltRotate(board, matchCount){
    const rule = matchCount%4;
    switch (rule) {
        case 0:
            shiftUpDown(board, "end");
            break;
        case 1:
            shiftUpDown(board, "start");
            break;
        case 2:
            shiftLeftRight(board, "end");
            break;
        case 3:
            shiftLeftRight(board, "start");
            break;
    }
}
// export function