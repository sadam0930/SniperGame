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

  function getMoveType() : string[] {
    if (checkBoardForBuff() != null) {

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









