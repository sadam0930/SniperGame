module aiService {
    var aiState: IUpdateUI = null;
    var cell: number[] = [];
    var moveType: string = '';
    var getBuff: boolean = false;

    export function generateComputerMove(currentUpdateUI: IUpdateUI): void {
        aiState = currentUpdateUI;
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
        log.info("Computer's move: " + moveType, cell);
        makeComputerMove();
    }

  function checkBoardForBuff() : boolean {
      let moveBoard: Board = aiState.state.board[(aiState.turnIndex + 2)];
      for (let i = 0; i < gameLogic.ROWS; i++) {
          for (let j = 0; j < gameLogic.COLS; j++) {
              if (game.isABuff(moveBoard[i][j])) {
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
      let board: Board = aiState.state.board[(aiState.turnIndex + 2)];
      for (let i = 0; i < gameLogic.ROWS; i++) {
          for (let j = 0; j < gameLogic.COLS; j++) {
              if (board[i][j] === '') return true;
          }
      }
      return false;
  }

  function canAttack(): boolean {
      let board: Board = aiState.state.board[(aiState.turnIndex)];
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
          aiState.state.board[aiState.turnIndex + 2] : 
          aiState.state.board[aiState.turnIndex];
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
      if (aiState.state.turnCounts[aiState.turnIndex] === 0) moveType = 'move';
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

  export function makeComputerMove(): void {
    //stateBeforeMove: IState, row: number, col: number, moveType: string, turnIndexBeforeMove: number)
    
      let computerMove = gameLogic.createMove(aiState.state, 
                                              cell[0], cell[1], moveType, 
                                              aiState.turnIndex);
      game.makeMove(computerMove);
  }

}