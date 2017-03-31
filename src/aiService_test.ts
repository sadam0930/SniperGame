describe("aiService", function() {
  let P1_TURN = 0;
  let AI_TURN = 1;
  let NO_ONE_TURN = -1;
  let NO_ONE_WINS: number[] = null;
  let P1_WIN_SCORES = [1, 0];
  let P2_WIN_SCORES = [0, 1];
  
  function createComputerMove(board: Board[], gameOver: boolean, turnCounts: number[], currentBuffs: string[], turnIndex: number): IMove {
    let stateBeforeMove: IState = {board: board, delta: null, gameOver: gameOver, turnCounts: turnCounts, currentBuffs: currentBuffs};
    return aiService.generateComputerMove(stateBeforeMove, turnIndex);
  }

  function expectException(
      turnIndexBeforeMove: number,
      turnCountBeforeMove: number[],
      currentBuffs: string[],
      boardBeforeMove: Board[],
      row: number,
      col: number,
      moveType: string,
      attackType: string, //not actually used here since we don't care about the delta
      gameOver: boolean): void {
    let stateBeforeMove: IState = boardBeforeMove ? {board: boardBeforeMove, delta: null, gameOver: gameOver, turnCounts: turnCountBeforeMove, currentBuffs: currentBuffs} : null;
    // We expect an exception to be thrown :)
    let didThrowException = false;
    try {
      createComputerMove(boardBeforeMove, gameOver, turnCountBeforeMove, currentBuffs, turnIndexBeforeMove);
    } catch (e) {
      didThrowException = true;
    }
    if (!didThrowException) {
      throw new Error("We expect an illegal move, but createMove didn't throw any exception!")
    }
  }

  function expectMove(
      turnIndexBeforeMove: number,
      turnCountBeforeMove: number[],
      currentBuffs: string[],
      boardBeforeMove: Board[],
      row: number,
      col: number,
      moveType: string,
      attackType: string,
      boardAfterMove: Board[],
      turnIndexAfterMove: number,
      endMatchScores: number[],
      turnCountAfterMove: number[],
      buffsAfterMove: string[],
      gameOver: boolean): void {
    let expectedMove:IMove = {
        turnIndex: P1_TURN,
        endMatchScores: endMatchScores,
        state: {board: boardAfterMove, delta: {row: row, col: col, moveType: moveType, attackType: attackType}, gameOver: gameOver, turnCounts: turnCountAfterMove, currentBuffs: buffsAfterMove}
      };
    let aiMove = createComputerMove(boardBeforeMove, gameOver, turnCountBeforeMove, currentBuffs, turnIndexBeforeMove);
    expect(angular.equals(aiMove, expectedMove)).toBe(true);
  }

  it("computer moves to pick up buff", function() {
    expectMove(AI_TURN, [2,1], ['',''],
      [[['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', '']], 
      [['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', '']],
      [['P', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', '']],
      [['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', 'P', '', ''],
      ['', 'grenade', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', '']]], 
      3, 1, 'move', '',
      [[['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', '']], 
      [['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', '']],
      [['P', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', '']],
      [['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', 'P', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', '']]], 
      P1_TURN, NO_ONE_WINS, [2,2], ['','grenade'], false);
  });

});
