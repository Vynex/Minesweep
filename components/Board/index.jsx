import { useEffect, useState } from 'react';
import Tile from '../Tile';

import generateBoard from '../../shared/lib/generateBoard';

import styles from './Board.module.css';
import getTilesAround from '../../shared/lib/getTilesAround';

export default function Board({
	board,
	setBoard,
	difficulty,
	gameState,
	setGameState,
	setFlags,
	setFace,
}) {
	const [pressedTile, setPressedTile] = useState(null);

	useState(() => {
		setBoard(generateBoard(difficulty));
	}, []);

	const handleMouseDown = (e, tile) => {
		e.preventDefault();

		if (gameState.isWon || gameState.isLost) return;

		let newBoard = [...board];
		let currentTile = newBoard[tile.x][tile.y];

		setPressedTile({ x: tile.x, y: tile.y });
		setFace('/assets/tilePressed.svg');

		if (e.button === 0) {
			if (!currentTile.isRevealed && !currentTile.isFlagged)
				newBoard[tile.x][tile.y].isActive = true;

			if (currentTile.isRevealed) {
				let adjacentTiles = getTilesAround(difficulty, tile, newBoard);

				adjacentTiles.forEach((t) => {
					if (!newBoard[t.x][t.y].isFlagged)
						newBoard[t.x][t.y].isActive = true;
				});
			}
		}

		setBoard(newBoard);
	};

	const handleMouseUp = (e, tile) => {
		e.preventDefault();

		setFace('/assets/gameLive.svg');

		if (gameState.isWon || gameState.isLost) return;

		let newBoard = [...board];

		for (let x = 0; x !== difficulty.rows; x++) {
			for (let y = 0; y !== difficulty.cols; y++) {
				newBoard[x][y].isActive = false;
			}
		}

		if (!pressedTile) return;
		if (pressedTile.x !== tile.x || pressedTile.y !== tile.y) return;

		if (e.button === 0) {
			activateTile(newBoard, tile);
		}
		if (e.button === 2) {
			flagTile(newBoard, tile);
		}

		setPressedTile(null);
	};

	const handleMouseLeave = () => {
		if (gameState.isWon || gameState.isLost) return;

		let newBoard = [...board];

		for (let x = 0; x !== difficulty.rows; x++) {
			for (let y = 0; y !== difficulty.cols; y++) {
				newBoard[x][y].isActive = false;
			}
		}

		setBoard(newBoard);
	};

	const revealZeroes = (newBoard, tile) => {
		const { rows, cols } = difficulty;
		if (tile.x < 0 || tile.x >= rows || tile.y < 0 || tile.y >= cols) return;

		if (newBoard[tile.x][tile.y].isRevealed === true) return;
		if (newBoard[tile.x][tile.y].isFlagged) return;

		newBoard[tile.x][tile.y].isRevealed = true;

		if (newBoard[tile.x][tile.y].minesAround !== 0) return;

		revealZeroes(newBoard, { x: tile.x - 1, y: tile.y - 1 });
		revealZeroes(newBoard, { x: tile.x - 1, y: tile.y });
		revealZeroes(newBoard, { x: tile.x - 1, y: tile.y + 1 });

		revealZeroes(newBoard, { x: tile.x, y: tile.y - 1 });
		revealZeroes(newBoard, { x: tile.x, y: tile.y + 1 });

		revealZeroes(newBoard, { x: tile.x + 1, y: tile.y - 1 });
		revealZeroes(newBoard, { x: tile.x + 1, y: tile.y });
		revealZeroes(newBoard, { x: tile.x + 1, y: tile.y + 1 });

		return newBoard;
	};

	const activateTile = (newBoard, tile) => {
		let currentTile = newBoard[tile.x][tile.y];

		if (!gameState.isLive) {
			newBoard = generateBoard(difficulty, tile);
			currentTile = newBoard[tile.x][tile.y];

			let newGameState = { ...gameState, isLive: true };
			setGameState(newGameState);
		}

		if (currentTile.isFlagged) return;

		if (!currentTile.isRevealed) {
			if (currentTile.hasMine) {
				let newGameState = { ...gameState, isLive: false, isLost: true };
				setGameState(newGameState);

				newBoard[tile.x][tile.y].isRevealed = true;
				newBoard[tile.x][tile.y].hasExploded = true;

				// Reveal All Mines
				for (let x = 0; x !== difficulty.rows; x++) {
					for (let y = 0; y !== difficulty.cols; y++) {
						if (newBoard[x][y].hasMine) {
							if (!newBoard[x][y].isFlagged) {
								newBoard[x][y].isRevealed = true;
							}
						} else {
							if (newBoard[x][y].isFlagged) {
								newBoard[x][y].isIncorrect = true;
							}
						}
					}
				}
			} else if (currentTile.minesAround === 0) {
				revealZeroes(newBoard, tile);
			} else {
				newBoard[tile.x][tile.y].isRevealed = true;
			}
		} else if (currentTile.minesAround !== 0) {
			const adjacentTiles = getTilesAround(difficulty, tile, newBoard);
			let flagsAround = 0;

			adjacentTiles.forEach((t) => {
				if (newBoard[t.x][t.y].isFlagged) flagsAround++;
			});

			if (currentTile.minesAround === flagsAround) {
				adjacentTiles.forEach((t) => {
					let adjacentTile = newBoard[t.x][t.y];
					if (!adjacentTile.isFlagged && !adjacentTile.isRevealed) {
						activateTile(newBoard, t);
					}
				});
			}
		}

		// Check if Game is Won
		let gameIsWon = true;

		for (let x = 0; x !== difficulty.rows; x++) {
			for (let y = 0; y !== difficulty.cols; y++) {
				if (!newBoard[x][y].hasMine && !newBoard[x][y].isRevealed) {
					gameIsWon = false;
				}
			}
		}

		if (gameIsWon) {
			setGameState({ ...gameState, isLive: false, isWon: true });

			for (let x = 0; x !== difficulty.rows; x++) {
				for (let y = 0; y !== difficulty.cols; y++) {
					if (newBoard[x][y].hasMine) {
						newBoard[x][y].isFlagged = true;
					}
				}
			}
			setFlags(difficulty.mines);
		}

		setBoard(newBoard);
	};

	const flagTile = (newBoard, tile) => {
		let currentTile = newBoard[tile.x][tile.y];

		if (!gameState.isLive) return;

		if (currentTile.isRevealed) return;

		if (currentTile.isFlagged) {
			setFlags((prevState) => prevState - 1);
			newBoard[tile.x][tile.y].isFlagged = false;
		} else {
			setFlags((prevState) => prevState + 1);
			newBoard[tile.x][tile.y].isFlagged = true;
		}

		setBoard(newBoard);
	};

	if (!board) return null;

	return (
		<>
			{[...Array(difficulty.rows)].map((e, x) => (
				<div className={styles.row} key={x}>
					{[...Array(difficulty.cols)].map((e, y) => (
						<Tile
							tile={board[x][y]}
							pos={{ x, y }}
							handleMouseDown={handleMouseDown}
							handleMouseUp={handleMouseUp}
							handleMouseLeave={handleMouseLeave}
							key={y}
						/>
					))}
				</div>
			))}
		</>
	);
}
