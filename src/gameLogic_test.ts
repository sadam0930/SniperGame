describe("In TicTacToe", function() {
  let P1_TURN = 0;
  let P2_TURN = 1;
  let NO_ONE_TURN = -1;
  let NO_ONE_WINS: number[] = null;
  let P1_WIN_SCORES = [1, 0];
  let P2_WIN_SCORES = [0, 1];
  let TIE_SCORES = [0, 0];

    
  function expectException(
      turnIndexBeforeMove: number,
      boardBeforeMove: Board[],
      row: number,
      col: number,
      moveType: string): void {
    let stateBeforeMove: IState = boardBeforeMove ? {board: boardBeforeMove, delta: null, gameOver: false, turnCounts: null} : null;
    // We expect an exception to be thrown :)
    let didThrowException = false;
    try {
      gameLogic.createMove(stateBeforeMove, row, col, moveType, turnIndexBeforeMove);
    } catch (e) {
      didThrowException = true;
    }
    if (!didThrowException) {
      throw new Error("We expect an illegal move, but createMove didn't throw any exception!")
    }
  }

  function expectMove(
      turnIndexBeforeMove: number,
      boardBeforeMove: Board[],
      row: number,
      col: number,
      moveType: string,
      attackType: string,
      boardAfterMove: Board[],
      turnIndexAfterMove: number,
      endMatchScores: number[]): void {
    let expectedMove:IMove = {
        turnIndex: turnIndexAfterMove,
        endMatchScores: endMatchScores,
        state: {board: boardAfterMove, delta: {row: row, col: col, moveType: moveType, attackType: attackType}, gameOver: false, turnCounts: null}
      };
    let stateBeforeMove: IState = boardBeforeMove ? {board: boardBeforeMove, delta: null, gameOver: false, turnCounts: null} : null;
    let move: IMove = gameLogic.createMove(stateBeforeMove, row, col, moveType, turnIndexBeforeMove);
    expect(angular.equals(move, expectedMove)).toBe(true);
  }

  it("Initial move", function() {
    let move: IMove = gameLogic.createInitialMove();
    let expectedMove:IMove = {
        turnIndex: P1_TURN,
        endMatchScores: NO_ONE_WINS,
        state: {board: 
          [[['', '', ''],
          ['', '', ''],
          ['', '', ''],
          ['', '', ''],
          ['', '', '']], 
          [['', '', ''],
          ['', '', ''],
          ['', 'P', ''],
          ['', '', ''],
          ['', '', '']],
          [['', '', ''],
          ['', '', ''],
          ['', '', ''],
          ['', '', ''],
          ['', '', '']],
          [['', '', ''],
          ['', '', ''],
          ['', 'P', ''],
          ['', '', ''],
          ['', '', '']]],
          delta: null,
          gameOver: false,
          turnCounts: null}
      };
    expect(angular.equals(move, expectedMove)).toBe(true);
  });
  
  it("P1 attacking in 0x0 from initial state", function() {
    expectMove(P1_TURN, null, 0, 0, 'attack', '',
      [[['B', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['', '', ''],
       ['', '', ''],
       ['', 'P', ''],
       ['', '', ''],
       ['', '', '']],
       [['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['B', '', ''],
       ['', '', ''],
       ['', 'P', ''],
       ['', '', ''],
       ['', '', '']]], 
      P2_TURN, NO_ONE_WINS);
  });

  it("P2 attacking in 0x1", function() {
    expectMove(P2_TURN,
      [[['B', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['', '', ''],
       ['', '', ''],
       ['', 'P', ''],
       ['', '', ''],
       ['', '', '']],
       [['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['B', '', ''],
       ['', '', ''],
       ['', 'P', ''],
       ['', '', ''],
       ['', '', '']]],
      0, 1, 'attack', '',
      [[['B', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['', 'B', ''],
       ['', '', ''],
       ['', 'P', ''],
       ['', '', ''],
       ['', '', '']],
       [['', 'B', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['B', '', ''],
       ['', '', ''],
       ['', 'P', ''],
       ['', '', ''],
       ['', '', '']]], 
      P1_TURN, NO_ONE_WINS);
  });

  it("atacking in a non-empty position is illegal", function() {
    expectException(P1_TURN,
      [[['B', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['', 'B', ''],
       ['', '', ''],
       ['', 'P', ''],
       ['', '', ''],
       ['', '', '']],
       [['', 'B', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['B', '', ''],
       ['', '', ''],
       ['', 'P', ''],
       ['', '', ''],
       ['', '', '']]], 
      0, 0, 'attack');
  });

  /* We don't have a good way to handle game over yet */
  // it("cannot move after the game is over", function() {
  //   expectException(P2_TURN,
  //     [[['X', 'O', ''],
  //      ['X', 'O', ''],
  //      ['X', '', ''],
  //      ['', '', ''],
  //      ['', '', '']],
  //      [['', '', ''],
  //      ['', '', ''],
  //      ['', '', ''],
  //      ['', '', ''],
  //      ['', '', '']],
  //      [['', '', ''],
  //      ['', '', ''],
  //      ['', '', ''],
  //      ['', '', ''],
  //      ['', '', '']],
  //      [['', '', ''],
  //      ['', '', ''],
  //      ['', '', ''],
  //      ['', '', ''],
  //      ['', '', '']]], 
  //     2, 1, 'attack');
  // });

  it("P2 moving in 2x1", function() { //current position is 2x0
    expectMove(P2_TURN,
      [[['B', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['', 'B', ''],
       ['', '', ''],
       ['', 'P', ''],
       ['', '', ''],
       ['', '', '']],
       [['', 'B', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['B', '', ''],
       ['', '', ''],
       ['P', '', ''],
       ['', '', ''],
       ['', '', '']]], 
      2, 1, 'move', '',
      [[['B', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['', 'B', ''],
       ['', '', ''],
       ['', 'P', ''],
       ['', '', ''],
       ['', '', '']],
       [['', 'B', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['B', '', ''],
       ['', '', ''],
       ['', 'P', ''],
       ['', '', ''],
       ['', '', '']]], 
      P1_TURN, NO_ONE_WINS);
  });

  it("P1 wins by attacking in 2x1", function() {
    expectMove(P1_TURN,
      [[['B', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['', 'B', ''],
       ['', '', ''],
       ['', 'P', ''],
       ['', '', ''],
       ['', '', '']],
       [['', 'B', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['B', '', ''],
       ['', '', ''],
       ['', 'P', ''],
       ['', '', ''],
       ['', '', '']]],
      2, 1, 'attack', '',
      [[['B', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['', 'B', ''],
       ['', '', ''],
       ['', 'P', ''],
       ['', '', ''],
       ['', '', '']],
       [['', 'B', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['B', '', ''],
       ['', '', ''],
       ['', 'P', ''],
       ['', '', ''],
       ['', '', '']]], 
      NO_ONE_TURN, P1_WIN_SCORES);
  });

  it("P2 wins by attacking in 2x1", function() {
    expectMove(P2_TURN,
      [[['B', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['', 'B', ''],
       ['', '', ''],
       ['', 'P', ''],
       ['', '', ''],
       ['', '', '']],
       [['', 'B', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['B', '', ''],
       ['', '', ''],
       ['', 'P', ''],
       ['', '', ''],
       ['', '', '']]], 
      2, 1, 'attack', '',
      [[['B', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['', 'B', ''],
       ['', '', ''],
       ['', 'P', ''],
       ['', '', ''],
       ['', '', '']],
       [['', 'B', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['B', '', ''],
       ['', '', ''],
       ['', 'P', ''],
       ['', '', ''],
       ['', '', '']]], 
      NO_ONE_TURN, P2_WIN_SCORES);
  });

  /* You can't tie in this game */
  // it("the game ties when there are no more empty cells", function() {
  //   expectMove(P1_TURN,
  //     [[['X', 'O', 'X'],
  //      ['X', 'O', 'O'],
  //      ['O', 'X', ''],
  //      ['', '', ''],
  //      ['', '', '']],
  //      [['', '', ''],
  //      ['', '', ''],
  //      ['', '', ''],
  //      ['', '', ''],
  //      ['', '', '']],
  //      [['', '', ''],
  //      ['', '', ''],
  //      ['', '', ''],
  //      ['', '', ''],
  //      ['', '', '']],
  //      [['', '', ''],
  //      ['', '', ''],
  //      ['', '', ''],
  //      ['', '', ''],
  //      ['', '', '']]], 
  //     2, 2,
  //     [[['X', 'O', 'X'],
  //      ['X', 'O', 'O'],
  //      ['O', 'X', 'X'],
  //      ['', '', ''],
  //      ['', '', '']],
  //      [['', '', ''],
  //      ['', '', ''],
  //      ['', '', ''],
  //      ['', '', ''],
  //      ['', '', '']],
  //      [['', '', ''],
  //      ['', '', ''],
  //      ['', '', ''],
  //      ['', '', ''],
  //      ['', '', '']],
  //      [['', '', ''],
  //      ['', '', ''],
  //      ['', '', ''],
  //      ['', '', ''],
  //      ['', '', '']]], 
  //     NO_ONE_TURN, TIE_SCORES);
  // });

  it("P1 attacking outside the board (in 0x3) is illegal", function() {
    expectException(P1_TURN,
      [[['B', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['', 'B', ''],
       ['', '', ''],
       ['', 'P', ''],
       ['', '', ''],
       ['', '', '']],
       [['', 'B', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', ''],
       ['', '', '']],
       [['B', '', ''],
       ['', '', ''],
       ['', 'P', ''],
       ['', '', ''],
       ['', '', '']]], 
      0, 3, 'attack');
  });
});
