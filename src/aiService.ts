module aiService {

  export function generateComputerMove(currentState: IState, currentTurnIndex: number): IMove {
      currentTurnIndex = currentTurnIndex;
      if (currentState === null) currentState = gameLogic.getInitialState();
      
      let cell: number[] = [-1, -1];
      let moveType: string = '';
      let getBuff: boolean = checkBoardForBuff(currentState, currentTurnIndex, cell); //immediately get buff and skip searching for free cells

      moveType = getMoveType(currentState, currentTurnIndex, cell);
      if (!getBuff) getCells(currentState, currentTurnIndex, moveType, cell);
      if (moveType === '' || cell[0] === -1 || cell[1] === -1) {
          log.info("Failed to generate computer move.");
          log.info("cell[0]: " + cell[0] + " cell[1]: " + cell[1] + " moveType: " + moveType);
          return null;
      }
      return gameLogic.createMove(currentState, cell[0], cell[1], moveType, currentTurnIndex);
  }

  function checkBoardForBuff(currentState: IState, currentTurnIndex: number, cell: number[]) : boolean {
      let moveBoard: Board = currentState.board[(currentTurnIndex + 2)];
      for (let i = 0; i < gameLogic.ROWS; i++) {
          for (let j = 0; j < gameLogic.COLS; j++) {
              if (gameLogic.isABuff(moveBoard[i][j])) {
                  cell[0] = i;
                  cell[1] = j;
                  return true;
              }
          }
      }
      return false;
  }

  function canMove(currentState: IState, currentTurnIndex: number): boolean {
      let board: Board = currentState.board[(currentTurnIndex + 2)];
      for (let i = 0; i < gameLogic.ROWS; i++) {
          for (let j = 0; j < gameLogic.COLS; j++) {
              if (board[i][j] === '') return true;
          }
      }
      return false;
  }

  function canAttack(currentState: IState, currentTurnIndex: number): boolean {
      let board: Board = currentState.board[(currentTurnIndex)];
      for (let i = 0; i < gameLogic.ROWS; i++) {
          for (let j = 0; j < gameLogic.COLS; j++) {
              if (board[i][j] === '') return true;
          }
      }
      return false;
  }

  function getCells(currentState: IState, currentTurnIndex: number, moveType: string, cell: number[]): void {
      let safe_guard_counter: number = 0;
      let board: Board = (moveType === 'move') ? 
          currentState.board[currentTurnIndex + 2] : 
          currentState.board[currentTurnIndex];
      let pos: number[] = gameLogic.getRandomPosition();

      while (board[pos[0]][pos[1]] !== '') {
          pos = gameLogic.getRandomPosition();
          if (safe_guard_counter > 30) {                    // Brute force check for a free cell
              for (let i = 0; i < gameLogic.ROWS; i++) {
                  for (let j = 0; j < gameLogic.COLS; j++) {
                      if (board[i][j] === '') {
                          cell[0] = i;
                          cell[1] = j;
                          return;
                      }
                  }
              }
              log.info("Error: Could not find an empty cell!");
              return;
          }
          safe_guard_counter += 1;
      }
      cell[0] = pos[0];
      cell[1] = pos[1];
  }

  function getMoveType(currentState: IState, currentTurnIndex: number, cell: number[]): string {
      let moveType: string;
      if (currentState.turnCounts[currentTurnIndex] === 0) moveType = 'move';
      else if (checkBoardForBuff(currentState, currentTurnIndex, cell)) moveType = 'move';
      else {
          let move: boolean = canMove(currentState, currentTurnIndex);
          let attack: boolean = canAttack(currentState, currentTurnIndex);
          if (move && attack) {
              let moveAsInt = (gameLogic.getRandomIntInclusive(10) + 1);
              if (moveAsInt <= 3) moveType = 'move';     // 30% chance to move
              else moveType = 'attack';                  // 70% chance to attack
          }
          else if (!move && attack) moveType = 'attack';
          else if (move && !attack) moveType = 'move';
          else log.info("Error: No moves available!");
      }
      return moveType;
  }

}