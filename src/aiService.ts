module aiService {
    var currentState: IState = null;
    var currentTurnIndex: number = null;
    var cell: number[] = [];
    var moveType: string = '';
    var getBuff: boolean = false;

    export function generateComputerMove(currentState: IState, currentTurnIndex: number): IMove {
        currentState = currentState;
        currentTurnIndex = currentTurnIndex;
        if (currentState === null) currentState = gameLogic.getInitialState();
        cell[0] = cell[1] = -1;
        moveType = '';
        getBuff = false;
        getMoveType();
        if (!getBuff) getCells();
        if (moveType === '' || cell[0] === -1 || cell[1] === -1) {
            log.info("Failed to generate computer move.");
            log.info("cell[0]: " + cell[0] + " cell[1]: " + cell[1] + " moveType: " + moveType);
            return;
        }
        return gameLogic.createMove(currentState, cell[0], cell[1], moveType, currentTurnIndex);
    }

  function checkBoardForBuff() : boolean {
      let moveBoard: Board = currentState.board[(currentTurnIndex + 2)];
      for (let i = 0; i < gameLogic.ROWS; i++) {
          for (let j = 0; j < gameLogic.COLS; j++) {
              if (gameLogic.isABuff(moveBoard[i][j])) {
                  cell[0] = i;
                  cell[1] = j;
                  getBuff = true;
                  return true;
              }
          }
      }
      return false;
  }

  function canMove(): boolean {
      let board: Board = currentState.board[(currentTurnIndex + 2)];
      for (let i = 0; i < gameLogic.ROWS; i++) {
          for (let j = 0; j < gameLogic.COLS; j++) {
              if (board[i][j] === '') return true;
          }
      }
      return false;
  }

  function canAttack(): boolean {
      let board: Board = currentState.board[(currentTurnIndex)];
      for (let i = 0; i < gameLogic.ROWS; i++) {
          for (let j = 0; j < gameLogic.COLS; j++) {
              if (board[i][j] === '') return true;
          }
      }
      return false;
  }

  function getCells(): void {
      if (moveType === '') return;
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

  function getMoveType(): void {
      if (currentState.turnCounts[currentTurnIndex] === 0) moveType = 'move';
      else if (checkBoardForBuff()) moveType = 'move';
      else {
          let move: boolean = canMove();
          let attack: boolean = canAttack();
          if (move && attack) {
              let moveAsInt = (gameLogic.getRandomIntInclusive(10) + 1);
              if (moveAsInt <= 3) moveType = 'move';     // 30% chance to move
              else moveType = 'attack';                  // 70% chance to attack
          }
          else if (!move && attack) moveType = 'attack';
          else if (move && !attack) moveType = 'move';
          else log.info("Error: No moves available!");
      }
  }

}