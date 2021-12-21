import styles from './Tile.module.css';

const tileColors = [
	'',
	'#22577E',
	'#116530',
	'#AC242E',
	'#344CB7',
	'#950101',
	'#3E8E7E',
	'#9D9D9D',
	'#DDA041',
];

const Tile = ({
	tile,
	pos,
	handleMouseDown,
	handleMouseUp,
	handleMouseLeave,
}) => {
	const handleClick = () => {
		console.log(pos, tile);
	};

	const handleContext = (e) => {
		e.preventDefault();
	};

	return (
		<div
			className={`${styles.tile} ${tile.isActive ? styles.active : ''} ${
				tile.isRevealed ? styles.revealed : ''
			} ${tile.hasExploded ? styles.exploded : ''} ${
				tile.isIncorrect ? styles.incorrect : ''
			}`}
			style={{
				color:
					tile.isRevealed && !tile.hasMine
						? tileColors[tile.minesAround]
						: '',
			}}
			onClick={handleClick}
			onContextMenu={(e) => handleContext(e)}
			onMouseDown={(e) => handleMouseDown(e, pos)}
			onMouseUp={(e) => handleMouseUp(e, pos)}
			onMouseLeave={handleMouseLeave}
		>
			{tile.isRevealed
				? tile.hasMine
					? '💣'
					: tile.minesAround === 0
					? ''
					: tile.minesAround
				: tile.isFlagged
				? '🚩'
				: ''}
		</div>
	);
};

export default Tile;
