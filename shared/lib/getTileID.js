// Converts Tile from 2-D (X, Y) to 1-D Tile ID

const getTileID = (coords, cols) => coords.x * cols + coords.y;

export default getTileID;
