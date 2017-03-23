type Board = string[][];
interface BoardDelta {
  row: number;
  col: number;
  moveType: string;
  attackType: string;
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
    game.current_buff[0] = game.current_buff[1] = '';
    return {board: getInitialBoards(), delta: null, gameOver: false};
  }

  export function getRandomPosition(): number[] {
    return [getRandomIntInclusive(ROWS), getRandomIntInclusive(COLS)];
  }

  export function getRandomIntInclusive(maxVal: number): number {
    return Math.floor(Math.random() * (maxVal));
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
      if (boards[opponentMoveBoard][row][col-1] === 'P') return [('P' + (game.yourPlayerIndex() + 1)), ('' + (col-1))];
      else if (boards[opponentMoveBoard][row][col] === 'P') return [('P' + (game.yourPlayerIndex() + 1)), ('' + (col))];
      else if (boards[opponentMoveBoard][row][col+1] === 'P') return [('P' + (game.yourPlayerIndex() + 1)), ('' + (col+1))];
    }
    else if (attackType === 'air strike') {
      for (let i = 0; i < gameLogic.ROWS; i++) {
        if (boards[opponentMoveBoard][i][col] === 'P') return [('P' + (game.yourPlayerIndex() + 1)), ('' + i)];  
      }
    }
    return ['', ''];
  }

  /**
   * Returns the move that should be performed when player
   * with index turnIndexBeforeMove makes a move in cell row X col.
   */
  
  export function spawnPowerUps(boards: Board[]): void {
    if (game.yourPlayerIndex() === -1) return;
    let safe_guard_counter: number = 0;
    let buff_type_num: number  = gameLogic.getRandomIntInclusive(2);  
    let buff_type: string = '';

    if (buff_type_num == 0) buff_type = 'grenade';       
    else if (buff_type_num == 1) buff_type = 'air strike';  
    // else if (buff_type_num == 2) buff_type = 'X';   // placeholder buff
    else {
      log.info("spawnPowerUps() buff_type_num out of range.");
      return;
    }

    let move_board: number = (2 + game.yourPlayerIndex());    // move board where buff is visible
    let buff_pos: number[] = gameLogic.getRandomPosition();
    let found_free_pos: boolean = false;

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

    boards[move_board][buff_pos[0]][buff_pos[1]] = buff_type;
  }


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
    let attackType: string = game.current_buff[playerID];
    let winner = getWinner(row, col, isP1Turn, boards, attackType);
    let endMatchScores: number[];
    endMatchScores = null;
    let turnIndex: number;
    let isGameOver: boolean = false;
    if (moveType === 'attack' && winner[0] !== '') {
      // Game over
      log.info("Game over! Winner is: ", winner[0]);
      turnIndex = -1;
      endMatchScores = winner[0] === 'P1' ? [1, 0] : winner[0] === 'P2' ? [0, 1] : [0, 0];
      isGameOver = true;
    }

    // UPDATE BOARDS
    turnIndex = endMatchScores === null ? (1 - turnIndexBeforeMove) : -1;
    let boardsAfterMove = angular.copy(boards);
    let boardMarker = winner[0] !== '' ? 'D' : 'B';
    let hit_location: number = Number(winner[1]);

    if (moveType === 'attack') {
      if (game.current_buff[playerID] === 'grenade') {
        boardsAfterMove[playerID][row][col-1] = boardsAfterMove[(1 - playerID) + 2][row][col-1] = 'B';
        boardsAfterMove[playerID][row][col] = boardsAfterMove[(1 - playerID) + 2][row][col] = 'B';
        boardsAfterMove[playerID][row][col+1] = boardsAfterMove[(1 - playerID) + 2][row][col+1] = 'B';
        game.current_buff[playerID] = '';
        if (winner[1] != '') boardsAfterMove[playerID][row][hit_location] = boardsAfterMove[(1 - playerID) + 2][row][hit_location] = boardMarker;
      }
      else if (game.current_buff[playerID] === 'air strike') {
        for (let i = 0; i < gameLogic.ROWS; i++) boardsAfterMove[playerID][i][col] = boardsAfterMove[(1 - playerID) + 2][i][col] = 'B';
        game.current_buff[playerID] = '';
        if (winner[1] != '') boardsAfterMove[playerID][hit_location][col] = boardsAfterMove[(1 - playerID) + 2][hit_location][col] = boardMarker;
      }
      else {
        boardsAfterMove[playerID][row][col] = boardsAfterMove[(1 - playerID) + 2][row][col] = boardMarker;
      }

    }
    else if (moveType === 'move') {
      if (game.isABuff(boardsAfterMove[playerID + 2][row][col])) 
        game.current_buff[playerID] = boardsAfterMove[playerID + 2][row][col];
      assignNewPosition(boardsAfterMove[playerID + 2], row, col);
    }

    let my_turn_count: number = gameLogic.playerTurnCount[game.yourPlayerIndex()];
    if ((my_turn_count > 0) && (my_turn_count % 2 == 0) && game.buffs_enabled) {
      gameLogic.spawnPowerUps(boardsAfterMove);
    }

    let delta: BoardDelta = {row: row, col: col, moveType: moveType, attackType: attackType};
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
