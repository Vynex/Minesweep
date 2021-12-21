const getTilesAround = (difficulty, tile) => {
	const tilesAround = [];

	// Function to check if Tile is within Bounds
	const addTile = (t) => {
		if (t?.x >= 0 && t?.x < difficulty.rows) {
			if (t.y >= 0 && t.y < difficulty.cols) {
				tilesAround.push({ x: t.x, y: t.y });
			}
		}
	};

	addTile({ x: tile.x - 1, y: tile.y - 1 });
	addTile({ x: tile.x - 1, y: tile.y });
	addTile({ x: tile.x - 1, y: tile.y + 1 });

	addTile({ x: tile.x, y: tile.y - 1 });
	addTile({ x: tile.x, y: tile.y + 1 });

	addTile({ x: tile.x + 1, y: tile.y - 1 });
	addTile({ x: tile.x + 1, y: tile.y });
	addTile({ x: tile.x + 1, y: tile.y + 1 });

	return tilesAround;
};

export default getTilesAround;
