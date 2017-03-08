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
  export let playerTurnCount: number[] = [];
  export let freeCells: Board[] = [];
  export let playerPositions: number[][][] = [];

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
    
    gameLogic.playerTurnCount[0] = gameLogic.playerTurnCount[1] = 0;
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

  export function getRandomPosition(): number[] {
    return [getRandomIntInclusive(ROWS), getRandomIntInclusive(COLS)];
  }

  export function getRandomIntInclusive(maxVal: number): number {
    let min = Math.ceil(0);
    let max = Math.floor(maxVal);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * Return the winner (either 'P1' or 'P2') or '' if there is no winner.
   * Compares the coordinates the player attacked 
   * with the opponents position board
   */
  function getWinner(row: number, col: number, isP1Turn: boolean, boards: Board[], attackType: string): string[] {
    let opponentMoveBoard: number = (1 - game.yourPlayerIndex() + 2);
    if (attackType === '') {
      if (boards[opponentMoveBoard][row][col] === 'P') return [('P' + (game.yourPlayerIndex() + 1)), 'c'];
    }
    else if (attackType === 'grenade') {
      if (boards[opponentMoveBoard][row][col-1] === 'P') return [('P' + (game.yourPlayerIndex() + 1)), 'l'];
      else if (boards[opponentMoveBoard][row][col] === 'P') return [('P' + (game.yourPlayerIndex() + 1)), 'c'];
      else if (boards[opponentMoveBoard][row][col+1] === 'P') return [('P' + (game.yourPlayerIndex() + 1)), 'r'];
    }
    return ['', ''];
  }

  /**
   * Returns the move that should be performed when player
   * with index turnIndexBeforeMove makes a move in cell row X col.
   */
  export function createMove(
      stateBeforeMove: IState, row: number, col: number, moveType: string, turnIndexBeforeMove: number): IMove {
    
    // GET CURRENT BOARDS
    if (!stateBeforeMove) {
      stateBeforeMove = getInitialState();
    }
    let boards: Board[] = stateBeforeMove.board;
    
    // SPECIFIC BOARD WE'RE EDITING
    let playerID: number = game.yourPlayerIndex();
    let board: Board;
    let isP1Turn = (playerID === 0);
    let isP2Turn = !isP1Turn;
    let boardIdx: number;
    if (moveType === 'attack') boardIdx = (playerID);
    else boardIdx = (playerID + 2);
    board = boards[boardIdx];

    // CHECK IF LEGAL MOVE
    if (board[row][col] == 'P' || board[row][col] == 'B') throw new Error("One can only make a move in an empty position!");
    if (stateBeforeMove.gameOver) throw new Error("Game Over!");
    if (game.firstMove() && ('attack' === moveType)) throw new Error("Must place position on first move!");
        
    // CHECK IF KILL SHOT
    let attackType: string = '';
    if (game.current_buff[playerID] === 'grenade') attackType = 'grenade';
    let winner = getWinner(row, col, isP1Turn, boards, attackType);
    let endMatchScores: number[];
    endMatchScores = null;
    let turnIndex: number;
    let isGameOver: boolean = false;
    if (moveType === 'attack' && winner[0] !== '') {
      // Game over
      log.info("Game over! Winner is: ", winner);
      turnIndex = -1;
      endMatchScores = winner[0] === 'P1' ? [1, 0] : winner[0] === 'P2' ? [0, 1] : [0, 0];
      isGameOver = true;
    }

    // UPDATE BOARDS
    turnIndex = endMatchScores === null ? (1 - turnIndexBeforeMove) : -1;
    let boardsAfterMove = angular.copy(boards);
    let boardMarker = winner[0] !== '' ? 'D' : 'B';

    if (moveType === 'attack') {
      if (game.current_buff[playerID] === 'grenade') {
        boardsAfterMove[playerID][row][col-1] = boardsAfterMove[(1 - playerID) + 2][row][col-1] = 'B';
        boardsAfterMove[playerID][row][col] = boardsAfterMove[(1 - playerID) + 2][row][col] = 'B';
        boardsAfterMove[playerID][row][col+1] = boardsAfterMove[(1 - playerID) + 2][row][col+1] = 'B';
        game.current_buff[playerID] = '';
      }
      if (winner[1] === 'l') boardsAfterMove[playerID][row][col-1] = boardsAfterMove[(1 - playerID) + 2][row][col-1] = boardMarker;
      else if (winner[1] === 'c') boardsAfterMove[playerID][row][col] = boardsAfterMove[(1 - playerID) + 2][row][col] = boardMarker;
      else if (winner[1] === 'r') boardsAfterMove[playerID][row][col+1] = boardsAfterMove[(1 - playerID) + 2][row][col+1] = boardMarker;
    }
    else if (moveType === 'move') {
      if (game.isABuff(boardsAfterMove[playerID + 2][row][col])) 
        game.current_buff[playerID] = boardsAfterMove[playerID + 2][row][col];
      assignNewPosition(boardsAfterMove[playerID + 2], row, col);
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
