import styles from './Tile.module.css';

const tileColors = [
	'',
	'#22577E',
	'#116530',
	'#AC242E',
	'#676FA3',
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
	handleContext,
	difficulty,
}) => {
	const handleClick = () => {
		console.log(pos, tile);
	};

	const renderBomb = () => <span style={{ fontWeight: '500' }}>💣</span>;
	const renderFlag = () => <span style={{ fontWeight: '500' }}>🚩</span>;

	return (
		<div
			className={`${styles.tile} ${tile.isActive && styles.active} ${
				tile.isRevealed && styles.revealed
			} ${tile.hasExploded && styles.exploded} ${
				tile.isIncorrect && styles.incorrect
			}`}
			style={{
				color:
					tile.isRevealed && !tile.hasMine
						? tileColors[tile.minesAround]
						: '',
			}}
			onClick={handleClick}
			onContextMenu={(e) => handleContext(e, pos)}
			onMouseDown={(e) => handleMouseDown(e, pos)}
			onMouseUp={(e) => handleMouseUp(e, pos)}
			onMouseLeave={handleMouseLeave}
		>
			{tile.isRevealed
				? tile.hasMine
					? renderBomb()
					: tile.minesAround === 0
					? ''
					: tile.minesAround
				: tile.isFlagged
				? renderFlag()
				: ''}
		</div>
	);
};

export default Tile;
