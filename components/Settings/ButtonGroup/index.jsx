import styles from './ButtonGroup.module.css';

const ButtonGroup = ({
	buttons,
	activeBtn,
	setActiveBtn,
	difficulty,
	setRows,
	setCols,
	setMines,
}) => {
	const handleClick = (id) => {
		setActiveBtn(id);

		let newRows = difficulty.rows;
		let newCols = difficulty.cols;
		let newMines = difficulty.mines;

		if (id === 0) {
			newRows = 9;
			newCols = 9;
			newMines = 10;
		}

		if (id === 1) {
			newRows = 16;
			newCols = 16;
			newMines = 40;
		}

		if (id === 2) {
			newRows = 16;
			newCols = 30;
			newMines = 99;
		}

		setRows(newRows);
		setCols(newCols);
		setMines(newMines);
	};

	return (
		<div className={styles.buttonGroup}>
			{buttons.map((label, i) => (
				<button
					key={i}
					name={label}
					onClick={() => handleClick(i)}
					className={`${styles.button} ${
						activeBtn === i && styles.buttonActive
					}`}
				>
					{label}
				</button>
			))}
		</div>
	);
};

export default ButtonGroup;
