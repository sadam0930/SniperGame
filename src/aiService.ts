module aiService {
	
	export function generateComputerMove(state: IState, turnIndexBeforeMove: number): IMove {
		let currState: IState = null;
		let pid: number = null;

		if (state === null) currState = gameLogic.getInitialState();
		else currState = state;
		pid = turnIndexBeforeMove;

		let pos: number[] = getAttackPos(currState, pid);
		let moveType: string = 'attack';
		getAttackType(currState, pid);

		// TEMP CODE UNTIL WE REMOVE MOVEMENT
		// if (currState.turnCounts[pid] === 0) {
		// 	pos = gameLogic.getRandomPosition();
		// 	moveType = 'move';
		// }
		// END OF TEMP CODE

		if ((pos[0] === -1) || (pos[1] === -1)) {
			log.info("Error: AI failed to select a proper move: pos=" + pos + ", pid=" + pid + ", moveType=" + moveType);
			return null;
		}
		else {
			log.info("Computer: " + moveType + " @ " + pos);
		}
		return (gameLogic.createMove(currState, pos[0], pos[1], moveType, pid));
	}

	function getAttackType(currState: IState, pid: number): void {
		if (gameLogic.checkCD('G', currState.buffCDs, pid) === 0) currState.currentBuffs[pid] = 'G';
		else if (gameLogic.checkCD('S', currState.buffCDs, pid) === 0) currState.currentBuffs[pid] = 'S';
		else if (gameLogic.checkCD('A', currState.buffCDs, pid) === 0) currState.currentBuffs[pid] = 'A';
		else if (gameLogic.checkCD('F', currState.buffCDs, pid) === 0) currState.currentBuffs[pid] = 'F';
		else currState.currentBuffs[pid] = '';
	}

	function getAttackPos(currState: IState, pid: number): number[] {
		let safe_guard_counter: number = 0;
      	let board: Board = currState.board[pid];
      	let cell: number[] = gameLogic.getRandomPosition();

      	while (board[cell[0]][cell[1]] !== '') {
	        if (safe_guard_counter > 30) {                   
	            for (let i = 0; i < gameLogic.ROWS; i++) {
	                for (let j = 0; j < gameLogic.COLS; j++) {
	                    if (board[i][j] === '') {
	                        cell[0] = i;
	                        cell[1] = j;
	                        return cell;
	                    }
	                }
	            }
	            log.info("Error: Could not find an empty cell!");
	            return [-1,-1];
	        }
          	cell = gameLogic.getRandomPosition();
            safe_guard_counter += 1;
    	}
		return cell;
	}
}