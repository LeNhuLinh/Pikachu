import {createBoard, createBoardWithBlocker} from "./board.js";
import {BOARD_COLS, COLS, ROWS} from "./config.js";
import {checkOneTurn, countTypes, findHint, getPath, haveLine, isStraightLine, shuffleBoard, twoTurn} from "./way.js";
import { EMPTY, BLOCKER } from "./config.js";
import {compact, shiftHalf} from "./connect.js";
const testBoard = createBoardWithBlocker(8);


const countMap = {};
for (let r = 1; r <= ROWS; r++) {
    for (let c = 1; c <= COLS; c++) {
        const v = testBoard[r][c];
        countMap[v] = (countMap[v] || 0) + 1;
    }
}
console.log(countMap);
const ttestBoard = Array.from({length: 10}, () => Array(17).fill(0));
ttestBoard[2][5] = 1;
ttestBoard[2][8] = 1;

console.log("Case 1 (không vật cản, cùng hàng):", isStraightLine(ttestBoard, {r:2,c:5}, {r:2,c:8}));
// kỳ vọng: true

testBoard[2][6] = 3;   // đặt vật cản ở giữa
console.log("Case 2 (có vật cản, cùng hàng):", isStraightLine(ttestBoard, {r:2,c:5}, {r:2,c:8}));
// kỳ vọng: false

console.log("Case 3 (cùng cột):", isStraightLine(ttestBoard, {r:2,c:5}, {r:5,c:5}));
// kỳ vọng: true (vì cột 5 không có gì chắn giữa hàng 2 và hàng 5)

console.log("Case 4 (không cùng hàng/cột):", isStraightLine(ttestBoard, {r:2,c:5}, {r:3,c:9}));
// kỳ vọng: false
console.log("EMPTY =", EMPTY);

ttestBoard[2][6] = 3;
console.log("Giá trị tại [2][6] sau khi gán:", ttestBoard[2][6]);   // thêm dòng này
console.log("Case 2 (có vật cản, cùng hàng):", isStraightLine(ttestBoard, {r:2,c:5}, {r:2,c:8}));

const board2 = Array.from({length: 10}, () => Array(17).fill(0));
board2[2][5] = 1;
board2[6][9] = 1;
// điểm gãy ứng viên: (2,9) hoặc (6,5) — cả 2 đều đang trống → kỳ vọng true
console.log("test checkOneTurn")
console.log(checkOneTurn(board2, {r:2,c:5}, {r:6,c:9}));   // kỳ vọng: true

board2[2][9] = 3;   // chặn điểm gãy thứ nhất
board2[6][5] = 3;   // chặn luôn điểm gãy thứ hai
console.log(checkOneTurn(board2, {r:2,c:5}, {r:6,c:9}));   // kỳ vọng: false (cả 2 góc đều bị chặn)

const board3 = Array.from({length: 10}, () => Array(17).fill(0));
board3[2][2] = 1;
board3[2][14] = 1;
for (let c = 1; c <= 15; c++) {
    if (c !== 2 && c !== 14) board3[2][c] = 9;
}
console.log(twoTurn(board3, {r:2,c:2}, {r:2,c:14}));   // kỳ vọng: true

for (let c = 0; c < BOARD_COLS; c++) {
    board3[0][c] = 9;   // chặn luôn hàng viền ảo phía trên
}
console.log(twoTurn(board3, {r:2,c:2}, {r:2,c:14}));
// kỳ vọng: vẫn có thể true nếu còn đường khác (viền ảo dưới, trái, phải) — tùy bạn tự verify bằng tay

const b1 = Array.from({length: 10}, () => Array(17).fill(0));
b1[2][5] = 1;
b1[2][8] = 1;
console.log(haveLine(b1, {r:2,c:5}, {r:2,c:8}));   // kỳ vọng: true




console.log('test');
const b2 = Array.from({length: 10}, () => Array(17).fill(0));
b2[2][2] = 1;
b2[2][14] = 1;
for (let c = 1; c <= 15; c++) {
    if (c !== 2 && c !== 14) b2[2][c] = 9;
}
console.log("twoTurn:", twoTurn(b2, {r:2,c:2}, {r:2,c:14}));
console.log("getPath:", getPath(b2, {r:2,c:2}, {r:2,c:14}));