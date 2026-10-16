import {ROWS, COLS, BOARD_ROWS, BOARD_COLS, EMPTY, TILE_ICONS, TILE_TYPES, BLOCKER} from "./config.js";

export function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
export function createBoard() {
    const total = ROWS * COLS;
    const perType = total / TILE_TYPES;

    const tiles = [];
    for (let t = 1; t <= TILE_TYPES; t++) {
        for (let k = 0; k < perType; k++) tiles.push(t);
    }
    shuffleArray(tiles);

    const board = Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(EMPTY));
    let idx = 0;
    for (let r = 1; r <= ROWS; r++) {
        for (let c = 1; c <= COLS; c++) board[r][c] = tiles[idx++];
    }
    return board;
}
export function createBoardWithBlocker(count) {
    const total = ROWS * COLS - count;
    const perType = 4;
    const tiles = [];
    for (let t = 1; t <= total/perType; t++) {
        for (let k = 0; k < perType; k++)
            tiles.push(t);
    }
    for (let r = 0; r < count; r++) {
        tiles.push(BLOCKER);
    }
    shuffleArray(tiles);

    const board = Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(EMPTY));
    let idx = 0;
    for (let r = 1; r <= ROWS; r++) {
        for (let c = 1; c <= COLS; c++) board[r][c] = tiles[idx++];
    }
    return board;
}

export function renderBoard(board, boardEl, onTileClick) {
    boardEl.innerHTML = "";
    boardEl.style.setProperty("--rows", BOARD_ROWS);
    boardEl.style.setProperty("--cols", BOARD_COLS);

    for (let r = 0; r < BOARD_ROWS; r++) {
        for (let c = 0; c < BOARD_COLS; c++) {
            const tile = document.createElement("button");
            tile.className = "tile";
            tile.dataset.r = r;
            tile.dataset.c = c;

            const isBorder = r === 0 || c === 0 || r === BOARD_ROWS - 1 || c === BOARD_COLS - 1;
            if (isBorder) tile.classList.add("tile--border");
            else if (board[r][c] === EMPTY) tile.classList.add("tile--empty");
            else if (board[r][c] === BLOCKER) tile.classList.add("tile--blocker");
            else  {
                const s = document.createElement("span");
                s.className = "tile__img";
                s.style.setProperty("--i", (board[r][c]-1));
                tile.appendChild(s);
            }

            tile.addEventListener("click", () => onTileClick(r, c, tile));
            boardEl.appendChild(tile);
        }
    }
}