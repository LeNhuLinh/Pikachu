export const ROWS = 8;
export const COLS = 15;
export const BOARD_ROWS = ROWS + 2;
export const BOARD_COLS = COLS + 2;

export const EMPTY = 0;
export const BLOCKER = -1;

// 32 loại hình (tạm dùng emoji, sau này thay bằng ảnh Pokémon)
export const TILE_ICONS = [
    "", // index 0 dành cho ô trống
    "🐭","🔥","💧","🌿","⚡","🐱","🐶","🐸","🦊","🐼","🐵","🐧",
    "🦁","🐯","🐮","🐷","🐰","🐻","🐨","🐔","🐢","🐙","🦋","🐝",
    "🐞","🐳","🦄","🐲","🍎","🍒","🍇","⭐"
];
export const TILE_TYPES = TILE_ICONS.length - 1; // 32

export const LEVEL_MODES = {
    1: "none", 2: "down", 3: "up", 4: "left", 5: "right", 6: "center"
};