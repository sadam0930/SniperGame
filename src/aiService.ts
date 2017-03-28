module aiService {
    var aiState: IUpdateUI;
    var cell : number[];

    export function generateComputerMove(currentUpdateUI: IUpdateUI): void {
        aiState = currentUpdateUI;
        cell[0] = cell[1] = 0;
        makeComputerMove();
    }
  

  function checkBoardForBuff() : boolean {

      let moveBoard: Board = aiState.state.board[(aiState.turnIndex + 2)];

      for (let i = 0; i < gameLogic.ROWS; i++) {
          for (let j = 0; j < gameLogic.COLS; j++) {
              if (game.isABuff(moveBoard[i][j])) {
                  cell[0] = i;
                  cell[1] = j;
                  return true;
              }
          }
      }
      return false;
  }

  function canMove(): boolean {
      let moveBoard: Board = aiState.state.board[(aiState.turnIndex + 2)];

      for (let i = 0; i < gameLogic.ROWS; i++) {
          for (let j = 0; j < gameLogic.COLS; j++) {
              if (moveBoard[i][j] === '') return true;
          }
      }
      return false;
  }

  function canAttack(): boolean {
      let attackBoard: Board = aiState.state.board[(aiState.turnIndex)];

      for (let i = 0; i < gameLogic.ROWS; i++) {
          for (let j = 0; j < gameLogic.COLS; j++) {
              if (attackBoard[i][j] === '') return true;
          }
      }
      return false;
  }

  function getCells(moveType: string): void {
    let safe_guard_counter: number = 0;
    let board: Board = (moveType === 'move') ? aiState.state.board[aiState.turnIndex + 2] : aiState.state.board[aiState.turnIndex];

    while (boards[move_board][buff_pos[0]][buff_pos[1]] !== '') {
        buff_pos = gameLogic.getRandomPosition();
      
        if (safe_guard_counter > 30) {                    // Brute force check for a free cell
          for (let i = 0; i < gameLogic.ROWS; i++) {
            for (let j = 0; j < gameLogic.COLS; j++) {
              if (boards[move_board][i][j] === '') {
                buff_pos[0] = i;
                buff_pos[1] = j;
                found_free_pos = true;
                break;
              }
            }
            if (found_free_pos) break;
          }
          if (!found_free_pos) {
            game.buffs_enabled = false;                  
            return;
          }
        }
        if (found_free_pos) break;
        safe_guard_counter += 1;
      }
  }

  function getMoveType() : string {
      if (checkBoardForBuff() != null) return 'move';
      else {
          let m: boolean = canMove();
          let a: boolean = canAttack();
          if (m && a) {
              let moveAsInt = (gameLogic.getRandomIntInclusive(10) + 1);
              if (moveAsInt <= 3) { // 30% chance to move
                  getCells('move');
                  return ('move');
              }
              else {
                  getCells('attack');
                  return ('attack');
              }
          }
          else if (!m && a) {
              getCells('attack');
              return ('attack');
          }
          else if (m && !a) {
              getCells('move');
              return ('move');
          }
          else {
              log.info("Error: No moves available");
          }
      }
      
  }

  export function makeComputerMove(): void {
    
      let moveType : string;
      let computerMove = gameLogic.createMove(aiState.state, 
                                              cell[0], cell[1], moveType, 
                                              aiState.turnIndex);
      game.makeMove(computerMove);
  }

}









