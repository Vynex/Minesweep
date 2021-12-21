import _ from 'lodash';
import getTilesAround from './getTilesAround';
import { getTileX, getTileY } from './getTileXY';
import getTileID from './getTileID';

const defaultTile = {
	hasMine: false,
	isActive: false,
	isFlagged: false,
	isRevealed: false,
	isIncorrect: false,
	hasExploded: false,
	minesAround: 0,
};

const generateMines = (difficulty, firstTile) => {
	const { rows, cols } = difficulty;

	// Creating an Array with (Rows * Columns) number of Elements representing each tile.
	let mineTiles = [...Array(rows * cols).keys()];
	// Removing one element from the end to account for the excluded tile.
	mineTiles.pop();

	// Fisher–Yates Shuffle Algorithm
	const shuffle = (arr) => {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	};

	// Shuffling the Array to Randomize without Repeating
	// Slicing for keeping 'n' mines
	mineTiles = shuffle(mineTiles).slice(0, difficulty.mines);

	// Increment Tile by 1 to skip the Excluded Tile
	mineTiles = mineTiles.map((t) => (t >= firstTile ? t + 1 : t));

	mineTiles = mineTiles.map((t) => ({
		x: getTileX(t, difficulty.cols),
		y: getTileY(t, difficulty.cols),
	}));

	return mineTiles;
};

const getMinesAround = (difficulty, tile, board) => {
	const aroundTiles = getTilesAround(difficulty, tile, board);

	let minesAroundTile = 0;

	for (let t of aroundTiles) if (board[t.x][t.y].hasMine) minesAroundTile++;

	return minesAroundTile;
};

const generateBoard = (difficulty, tile = null) => {
	let board = [];
	const firstTile = tile ? getTileID(tile, difficulty.cols) : 0;

	const minePositions = generateMines(difficulty, firstTile);

	for (let row = 0; row !== difficulty.rows; row++) {
		board.push([]);
		for (let col = 0; col !== difficulty.cols; col++)
			board[row].push({
				...defaultTile,
				hasMine: arrIncludes(minePositions, { x: row, y: col }),
			});
	}

	for (let row = 0; row !== difficulty.rows; row++)
		for (let col = 0; col !== difficulty.cols; col++)
			board[row][col] = {
				...board[row][col],
				minesAround: getMinesAround(difficulty, { x: row, y: col }, board),
			};

	return board;
};

const arrIncludes = (arr, obj) => {
	let id = _.findIndex(arr, obj);
	return id > -1 ? true : false;
};

export default generateBoard;
