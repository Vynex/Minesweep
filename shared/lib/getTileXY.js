// Converts Tile from 1-D Tile ID to 2D (X, Y)

export const getTileX = (tile, cols) => Math.floor(tile / cols);
export const getTileY = (tile, cols) => tile % cols;
