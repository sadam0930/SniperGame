type Board = string[][];
interface BoardDelta {
  row: number;
  col: number;
  moveType: string;
}
type IProposalData = BoardDelta;
interface IState {
  board: Board[];
  delta: BoardDelta;
  gameOver: boolean;
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
  export let isFirstMove: boolean = true; //instance variable for each client

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
      boards[i] = getBlankBoard();
    }
    
    // log.log("generating player positions")
    // let p1_pos = getRandomPosition();
    // boards[2][p1_pos[0]][p1_pos[1]] = 'P';
    // let p2_pos = getRandomPosition();
    // boards[3][p2_pos[0]][p2_pos[1]] = 'P';
    
    return boards;
  }

  export function getBlankBoard(): Board {
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
    return {board: getInitialBoards(), delta: null, gameOver: false};
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
   * Return the winner (either 'P1' or 'P2') or '' if there is no winner.
   * Compares the coordinates the player attacked 
   * with the opponents position board
   */
  function getWinner(row: number, col: number, isP1Turn: boolean, boards: Board[]): string {
    if(isP1Turn && boards[3][row][col] === 'P'){ return 'P1'; }
    if(!isP1Turn && boards[1][row][col] === 'P'){ return 'P2'; }
    return '';
  }

  /**
   * Returns the move that should be performed when player
   * with index turnIndexBeforeMove makes a move in cell row X col.
   */
  export function createMove(
      stateBeforeMove: IState, row: number, col: number, moveType: string, turnIndexBeforeMove: number): IMove {
    if (!stateBeforeMove) {
      stateBeforeMove = getInitialState();
    }

    let boards: Board[] = stateBeforeMove.board;
    let board: Board;
    /*
    * Based on the turnindex and the moveType 
    * we can figure out which board to use
    */
    let isP1Turn = (turnIndexBeforeMove%2 === 0);
    let isP2Turn = !isP1Turn;
    let boardIdx: number;
    if(isP1Turn && 'attack' === moveType){
      boardIdx = 0;
    } else if (isP1Turn && 'move' === moveType){
      boardIdx = 2;
    } else if (isP2Turn && 'attack' === moveType){
      boardIdx = 1;
    } else if (isP2Turn && 'move' === moveType){
      boardIdx = 3;
    }
    board = boards[boardIdx];

    if (board[row][col] !== '') {
      throw new Error("One can only make a move in an empty position!");
    }

    if (stateBeforeMove.gameOver) {
      throw new Error("Game Over!");
    }

    if (isFirstMove && 'attack' === moveType) {
      throw new Error("Must place position on first move!");
    }
    isFirstMove = false;
    
    //check if move is a hit, then game over
    let winner = getWinner(row, col, isP1Turn, boards);
    let endMatchScores: number[];
    let turnIndex: number;
    let isGameOver: boolean = false;

    if (winner !== '') {
      // Game over
      log.info("Game over! Winner is: ", winner);
      turnIndex = -1;
      endMatchScores = winner === 'P1' ? [1, 0] : winner === 'P2' ? [0, 1] : [0, 0];
      isGameOver = true;
    }

    // Game continues. Now it's the opponent's turn 
    // (the turn switches from 0 to 1 and 1 to 0).
    endMatchScores = null;
    turnIndex = 1 - turnIndexBeforeMove;
    let boardsAfterMove = angular.copy(boards);
    /*
    * Depending on the action update the board for movement or broken window.
    * Update both the view of opponent and the opponents movement boards
    */
    if(isP1Turn && 'attack' === moveType) { 
      boardsAfterMove[0][row][col] = boardsAfterMove[3][row][col] = 'B';
    } else if (isP1Turn && 'move' === moveType){
      assignNewPosition(boardsAfterMove[2], row, col);
      // boardsAfterMove[2][row][col] = 'P';
    } else if (isP2Turn && 'attack' === moveType){
      boardsAfterMove[1][row][col] = boardsAfterMove[2][row][col] = 'B';
    } else if (isP2Turn && 'move' === moveType){
      assignNewPosition(boardsAfterMove[3], row, col);
      // boardsAfterMove[3][row][col] = 'P';
    }

    let delta: BoardDelta = {row: row, col: col, moveType: moveType};
    let state: IState = {delta: delta, board: boardsAfterMove, gameOver: isGameOver};
    return {endMatchScores: endMatchScores, turnIndex: turnIndex, state: state};
  }

  function assignNewPosition(board: Board, row: number, col: number): void {
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if(board[i][j] === 'P') { 
          board[i][j] = ''; 
        }
      }
    }
    board[row][col] = 'P';
  }
  
  export function createInitialMove(): IMove {
    return {endMatchScores: null, turnIndex: 0, 
        state: getInitialState()};  
  }

  export function forSimpleTestHtml() {
    var move = gameLogic.createMove(null, 0, 0, 'attack', 0);
    log.log("move=", move);
  }
}
