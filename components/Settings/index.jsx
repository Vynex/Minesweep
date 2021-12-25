import { useEffect, useState, useCallback } from 'react';
import { BiCheck } from 'react-icons/bi';
import ButtonGroup from './ButtonGroup';

import styles from './Settings.module.css';

export default function Settings({ handleClose, difficulty, setDifficulty }) {
	const [rows, setRows] = useState(difficulty.rows);
	const [cols, setCols] = useState(difficulty.cols);
	const [mines, setMines] = useState(difficulty.mines);

	const getCurrentDifficulty = () => {
		if (rows === 9 && cols === 9 && mines === 10) return 0;
		if (rows === 16 && cols === 16 && mines === 40) return 1;
		if (rows === 16 && cols === 30 && mines === 99) return 2;
		else return 3;
	};

	const [activeBtn, setActiveBtn] = useState(getCurrentDifficulty());

	const escFunction = useCallback(
		(event) => {
			if (event.keyCode === 27) handleClose();
		},
		[handleClose]
	);

	useEffect(() => {
		document.addEventListener('keydown', escFunction, false);

		return () => {
			document.removeEventListener('keydown', escFunction, false);
		};
	}, [escFunction]);

	const handleKeyPress = (e) => {
		if (!/[0-9]/.test(e.key)) e.preventDefault();
	};

	const handleOnBlur = (e) => {
		if (e.target.value < 1) e.target.value = 1;
		if (e.target.value > 99) e.target.value = 99;
	};

	const handleChangeDifficulty = () => {
		const newDifficulty = difficulty;

		newDifficulty.rows = Number(rows);
		newDifficulty.cols = Number(cols);
		newDifficulty.mines = Number(mines);

		setDifficulty(newDifficulty);
		handleClose();
	};

	return (
		<>
			<article className={styles.modal}>
				<div className={styles.modalHeader}>
					Settings
					<div className={styles.modalClose} onClick={handleClose} />
				</div>

				<div className={styles.modalContainer}>
					<div className={styles.modalRow}>
						<div>Difficulty</div>
						<ButtonGroup
							buttons={['Easy', 'Medium', 'Hard', 'Custom']}
							difficulty={difficulty}
							setRows={setRows}
							setCols={setCols}
							setMines={setMines}
							activeBtn={activeBtn}
							setActiveBtn={setActiveBtn}
						/>
					</div>

					<div className={styles.modalRow}>
						<div>Grid Size</div>
						<div className={styles.rowContent}>
							<div>
								<label htmlFor="rows">Rows</label>
								<input
									id="rows"
									type="number"
									disabled={activeBtn !== 3}
									value={rows}
									onChange={(e) => setRows(e.target.value)}
									onKeyPress={handleKeyPress}
									onBlur={handleOnBlur}
								/>
							</div>
							<div>
								<label htmlFor="cols">Columns</label>
								<input
									id="cols"
									type="number"
									disabled={activeBtn !== 3}
									value={cols}
									onChange={(e) => setCols(e.target.value)}
									onKeyPress={handleKeyPress}
									onBlur={handleOnBlur}
								/>
							</div>
						</div>
					</div>

					<div className={styles.modalRow}>
						<div>Mines</div>
						<div className={styles.rowContent}>
							<input
								type="number"
								disabled={activeBtn !== 3}
								value={mines}
								onChange={(e) => setMines(e.target.value)}
								onKeyPress={handleKeyPress}
								onBlur={handleOnBlur}
							/>

							<input
								type="range"
								disabled={activeBtn !== 3}
								value={mines}
								onChange={(e) => setMines(e.target.value)}
								min="1"
								max={rows * cols - 1}
							/>
						</div>
					</div>
				</div>

				<div className={styles.modalFooter}>
					<button
						className={styles.modalButton}
						onClick={handleChangeDifficulty}
					>
						<span>
							<BiCheck />
						</span>
						<span>Save</span>
					</button>
				</div>
			</article>

			<div className={styles.modalOverlay} onClick={handleClose} />
		</>
	);
}
