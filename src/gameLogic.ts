type Board = string[][];
interface BoardDelta {
  row: number;
  col: number;
}
type IProposalData = BoardDelta;
interface IState {
  board: Board[];
  delta: BoardDelta;
}

import gameService = gamingPlatform.gameService;
import alphaBetaService = gamingPlatform.alphaBetaService;
import translate = gamingPlatform.translate;
import resizeGameAreaService = gamingPlatform.resizeGameAreaService;
import log = gamingPlatform.log;
import dragAndDropService = gamingPlatform.dragAndDropService;

module gameLogic {
  export const ROWS = 6;
  export const COLS = 5;
  export const NUMPLAYERS = 2;

  /** 
  * Returns the initial Sniper boards, which is a ROWSxCOLS matrix containing ''. 
  * There are 4 boards. P1 is even boards. P2 is odd boards.
  * This makes it easy to track turns with (turnIndex%2 === 0)
  * boards[0] = P1 view of P2
  * boards[1] = P2 view of P1
  * boards[2] = P1 view of self to move position
  * boards[3] = P2 view of self to move position
  */
  export function getInitialBoards(): Board[] {
    log.log("creating new boards")
    let boards: Board[] = [];
    for (let i = 0; i < NUMPLAYERS*2; i++) {
      boards[i] = getInitialBoard();
    }
    
    log.log("generating player positions")
    let p1_pos = getRandomPosition();
    boards[2][p1_pos[0]][p1_pos[1]] = 'P';
    let p2_pos = getRandomPosition();
    boards[2][p2_pos[0]][p2_pos[1]] = 'P';
    
    return boards;
  }

  export function getInitialBoard(): Board {
    let board: Board = [];
    for (let i = 0; i < ROWS; i++) {
      board[i] = [];
      for (let j = 0; j < COLS; j++) {
        board[i][j] = '';
      }
    }
    return board;
  }

  export function getInitialState(): IState {
    return {board: getInitialBoards(), delta: null};
  }

  function getRandomPosition(): number[] {
    return [getRandomIntInclusive(ROWS), getRandomIntInclusive(COLS)];
  }

  function getRandomIntInclusive(maxVal: number): number {
    let min = Math.ceil(0);
    let max = Math.floor(maxVal);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * Returns true if the game ended in a tie because there are no empty cells.
   * E.g., isTie returns true for the following board:
   *     [['X', 'O', 'X'],
   *      ['X', 'O', 'O'],
   *      ['O', 'X', 'X']]
   */
  function isTie(board: Board): boolean {
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (board[i][j] === '') {
          // If there is an empty cell then we do not have a tie.
          return false;
        }
      }
    }
    // No empty cells, so we have a tie!
    return true;
  }

  /**
   * Return the winner (either 'X' or 'O') or '' if there is no winner.
   * The board is a matrix of size 3x3 containing either 'X', 'O', or ''.
   * E.g., getWinner returns 'X' for the following board:
   *     [['X', 'O', ''],
   *      ['X', 'O', ''],
   *      ['X', '', '']]
   */
  function getWinner(board: Board): string {
    let boardString = '';
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        let cell = board[i][j];
        boardString += cell === '' ? ' ' : cell;
      }
    }
    let win_patterns = [
      'XXX......',
      '...XXX...',
      '......XXX',
      'X..X..X..',
      '.X..X..X.',
      '..X..X..X',
      'X...X...X',
      '..X.X.X..'
    ];
    for (let win_pattern of win_patterns) {
      let x_regexp = new RegExp(win_pattern);
      let o_regexp = new RegExp(win_pattern.replace(/X/g, 'O'));
      if (x_regexp.test(boardString)) {
        return 'X';
      }
      if (o_regexp.test(boardString)) {
        return 'O';
      }
    }
    return '';
  }

  /**
   * Returns the move that should be performed when player
   * with index turnIndexBeforeMove makes a move in cell row X col.
   */
  export function createMove(
      stateBeforeMove: IState, row: number, col: number, turnIndexBeforeMove: number): IMove {
    if (!stateBeforeMove) {
      stateBeforeMove = getInitialState();
    }
    let boards: Board[] = stateBeforeMove.board;
    let board: Board = boards[0]; //hack for tic tac toe to work
    if (board[row][col] !== '') {
      throw new Error("One can only make a move in an empty position!");
    }
    if (getWinner(board) !== '' || isTie(board)) {
      throw new Error("Can only make a move if the game is not over!");
    }
    let boardsAfterMove = angular.copy(boards);
    let boardAfterMove = boardsAfterMove[0]; //hack for tic tac toe to work
    boardAfterMove[row][col] = turnIndexBeforeMove === 0 ? 'X' : 'O';
    let winner = getWinner(boardAfterMove);
    let endMatchScores: number[];
    let turnIndex: number;
    if (winner !== '' || isTie(boardAfterMove)) {
      // Game over.
      turnIndex = -1;
      endMatchScores = winner === 'X' ? [1, 0] : winner === 'O' ? [0, 1] : [0, 0];
    } else {
      // Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
      turnIndex = 1 - turnIndexBeforeMove;
      endMatchScores = null;
    }
    let delta: BoardDelta = {row: row, col: col};
    let state: IState = {delta: delta, board: boardsAfterMove};
    return {endMatchScores: endMatchScores, turnIndex: turnIndex, state: state};
  }
  
  export function createInitialMove(): IMove {
    return {endMatchScores: null, turnIndex: 0, 
        state: getInitialState()};  
  }

  export function forSimpleTestHtml() {
    var move = gameLogic.createMove(null, 0, 0, 0);
    log.log("move=", move);
  }
}
