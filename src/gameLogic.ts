type Board = string[][];

interface BuffCDs {
  Grenade: number;
  SprayBullets: number;
  AirStrike: number;
  Fortify: number;
}
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
  turnCounts: number[];
  currentBuffs: string[];
  audioPlayed: boolean[];
  buffCDs: BuffCDs[];
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
      boards[i] = getBlankBoard();
    }
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

  function getInitialBuffCDs(): BuffCDs[] {
    let buffCDs1: BuffCDs = {
      Grenade: 0,
      SprayBullets: 0,
      AirStrike: 0,
      Fortify: 0
    };
    let buffCDs2: BuffCDs = {
      Grenade: 0,
      SprayBullets: 0,
      AirStrike: 0,
      Fortify: 0
    };

    return [buffCDs1, buffCDs2];
  }

  export function getInitialState(): IState {

    return {
      board: getInitialBoards(), 
      delta: null, 
      gameOver: false, 
      turnCounts: [0,0], 
      currentBuffs: ['',''], 
      audioPlayed: [false, false],
      buffCDs: getInitialBuffCDs()
    };
  }

  export function getRandomPosition(): number[] {
    return [getRandomIntInclusive(ROWS), getRandomIntInclusive(COLS)];
  }

  export function getRandomIntInclusive(maxVal: number): number {
    return Math.floor(Math.random() * (maxVal)); // returns 0 to maxVal - 1
  }

  /**
   * Return the winner (either 'P1' or 'P2') or '' if there is no winner.
   * Compares the coordinates the player attacked 
   * with the opponents position board
   */

  function updateBuffCDs(buffCDs: BuffCDs[], pid: number): BuffCDs[] {
    let newBuffCDs: BuffCDs[] = angular.copy(buffCDs);
    newBuffCDs[pid].Grenade = ((newBuffCDs[pid].Grenade !== 0) ? (newBuffCDs[pid].Grenade - 1) : 0);
    newBuffCDs[pid].SprayBullets = ((newBuffCDs[pid].SprayBullets !== 0) ? (newBuffCDs[pid].SprayBullets - 1) : 0);
    newBuffCDs[pid].AirStrike = ((newBuffCDs[pid].AirStrike !== 0) ? (newBuffCDs[pid].AirStrike - 1) : 0);
    newBuffCDs[pid].Fortify = ((newBuffCDs[pid].Fortify !== 0) ? (newBuffCDs[pid].Fortify - 1) : 0);
    return newBuffCDs;
  }

  function triggerCD(attackType: string, buffCDs: BuffCDs[], playerID: number): BuffCDs[] {
  	let tempBuffCDs: BuffCDs[] = angular.copy(buffCDs);
  	if (attackType === '') return tempBuffCDs;
  	else if (attackType === 'G') tempBuffCDs[playerID].Grenade = 3;
  	else if (attackType === 'S') tempBuffCDs[playerID].SprayBullets = 4;
  	else if (attackType === 'A') tempBuffCDs[playerID].AirStrike = 5;
  	else if (attackType === 'F') tempBuffCDs[playerID].Fortify = 5;
  	return tempBuffCDs;
  }

  export function checkCD(attackType: string, buffCDs: BuffCDs[], playerID: number): number {
  	if (attackType === '') return 0;
  	else if (attackType === 'G') return buffCDs[playerID].Grenade;
  	else if (attackType === 'S') return buffCDs[playerID].SprayBullets;
  	else if (attackType === 'A') return buffCDs[playerID].AirStrike;
  	else if (attackType === 'F') return buffCDs[playerID].Fortify;
  }

  function getWinner(row: number, col: number, turnIndexBeforeMove: number, boards: Board[], attackType: string): string[] {
    let opponentMoveBoard: number = (1 - turnIndexBeforeMove + 2);
    if (attackType === '') {
      if (boards[opponentMoveBoard][row][col] === 'P') return [('P' + (turnIndexBeforeMove + 1)), ('' + (col))];
    }
    else if (attackType === 'G') {
      if (boards[opponentMoveBoard][row][col-1] === 'P') return [('P' + (turnIndexBeforeMove + 1)), ('' + (col-1))];
      else if (boards[opponentMoveBoard][row][col] === 'P') return [('P' + (turnIndexBeforeMove + 1)), ('' + (col))];
      else if (boards[opponentMoveBoard][row][col+1] === 'P') return [('P' + (turnIndexBeforeMove + 1)), ('' + (col+1))];
    }
    else if (attackType === 'A') {
      for (let i = 0; i < ROWS; i++) {
        if (boards[opponentMoveBoard][i][col] === 'P') return [('P' + (turnIndexBeforeMove + 1)), ('' + i)];  
      }
    }
    else if (attackType === 'S') {
      let returnArray: string[] = [];
      returnArray[0] = returnArray[1] = returnArray[2] = '';
      let attackPos: string[] = [];
      attackPos[0] = row + ',' + col;
      for (let i = 1; i < 4; i++) {		// number of additional "sprayed" shots designated here
        let randPos: number[] = getRandomPosition();
        attackPos[i] = randPos[0] + ',' + randPos[1];
      }
      for (let i = 0; i < attackPos.length; i++) {
        let r: number = Number(attackPos[i].split(',')[0]);
        let c: number = Number(attackPos[i].split(',')[1]);
        if (boards[opponentMoveBoard][r][c] === 'P') {
          returnArray[0] = ('P' + (turnIndexBeforeMove + 1));
          returnArray[1] = attackPos[i];
        }
        else {
          returnArray[2] += (attackPos[i] + ';');
        }
      }
      returnArray[2] = returnArray[2].substring(0, (returnArray[2].length - 1));
      return returnArray;
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
    let playerID: number = turnIndexBeforeMove;
    let board: Board;
    let isP1Turn = (playerID === 0);
    let isP2Turn = !isP1Turn;
    let playerTurnCount: number[] = stateBeforeMove.turnCounts;
    let boardIdx: number;
    if (moveType === 'attack') boardIdx = (playerID);
    else boardIdx = (playerID + 2);
    board = boards[boardIdx];

    // CHECK IF LEGAL MOVE
    if (row > ROWS || row < 0 || col > COLS || col < 0) throw new Error("Cannot move outside of board!");
    if (board[row][col] == 'P' || board[row][col] == 'B') throw new Error("One can only make a move in an empty position!");
    if (stateBeforeMove.gameOver) throw new Error("Game Over!");
    if ((playerTurnCount[turnIndexBeforeMove] === 0) && ('attack' === moveType)) throw new Error("Must place position on first move!");

        
    // CHECK IF KILL SHOT
    let current_buffs: string[] = stateBeforeMove.currentBuffs;
    let attackType: string = current_buffs[playerID];
    // IF CD ISN'T UP, SET ATTACK TO NORMAL ATTACK
    if (checkCD(attackType, stateBeforeMove.buffCDs, playerID) !== 0) attackType = '';
    let winner = getWinner(row, col, turnIndexBeforeMove, boards, attackType);
    let endMatchScores: number[];
    endMatchScores = null;
    let turnIndex: number;
    let isGameOver: boolean = false;
    if (moveType === 'attack' && winner[0] !== '' && (current_buffs[1 - playerID]) !== 'F') {
      // Game over
      log.info("Game over! Winner is: ", winner[0]);
      turnIndex = -1;
      endMatchScores = (winner[0] === 'P1') ? [1, 0] : (winner[0] === 'P2') ? [0, 1] : [0, 0];
      isGameOver = true;
    }

    // UPDATE BOARDS
    turnIndex = endMatchScores === null ? (1 - turnIndexBeforeMove) : -1;
    let boardsAfterMove = angular.copy(boards);
    let boardMarker = winner[0] !== '' ? 'D' : 'B';
    let hit_location: number = Number(winner[1]);
    let buffsAfterMove = angular.copy(current_buffs);
    let buffCDs: BuffCDs[] = updateBuffCDs(stateBeforeMove.buffCDs, playerID);
    if (moveType === 'attack') {
      buffCDs = triggerCD(attackType, buffCDs, playerID);
      if (buffsAfterMove[(1 - playerID)] === 'F') {
      	buffsAfterMove[playerID] = buffsAfterMove[(1 - playerID)] = '';
      }	
      else if (attackType === 'G') {
        boardsAfterMove[playerID][row][col-1] = boardsAfterMove[(1 - playerID) + 2][row][col-1] = 'B';
        boardsAfterMove[playerID][row][col] = boardsAfterMove[(1 - playerID) + 2][row][col] = 'B';
        boardsAfterMove[playerID][row][col+1] = boardsAfterMove[(1 - playerID) + 2][row][col+1] = 'B';
        buffsAfterMove[playerID] = '';
        if (winner[1] != '') boardsAfterMove[playerID][row][hit_location] = boardsAfterMove[(1 - playerID) + 2][row][hit_location] = boardMarker;
      }
      else if (attackType === 'A') {
        for (let i = 0; i < ROWS; i++) boardsAfterMove[playerID][i][col] = boardsAfterMove[(1 - playerID) + 2][i][col] = 'B';
        buffsAfterMove[playerID] = '';
        if (winner[1] != '') boardsAfterMove[playerID][hit_location][col] = boardsAfterMove[(1 - playerID) + 2][hit_location][col] = boardMarker;
      }
      else if (attackType === 'S') {
        let hitList: string[] = winner[2].split(';');
        for (let i = 0; i < hitList.length; i++) {
          let r: number = Number(hitList[i].split(',')[0]);
          let c: number = Number(hitList[i].split(',')[1]);
          boardsAfterMove[playerID][r][c] = boardsAfterMove[(1 - playerID) + 2][r][c] = 'B';
        }
        if (winner[1] !== '') {
          let r: number = Number(winner[1].split(',')[0]);
          let c: number = Number(winner[1].split(',')[1]);
          boardsAfterMove[playerID][r][c] = boardsAfterMove[(1 - playerID) + 2][r][c] = 'D';
        }
        buffsAfterMove[playerID] = '';
      }
      else {
        boardsAfterMove[playerID][row][col] = boardsAfterMove[(1 - playerID) + 2][row][col] = boardMarker;
      }
    }
    else if (moveType === 'move') {
      assignNewPosition(boardsAfterMove[playerID + 2], row, col);
    }

    playerTurnCount[turnIndexBeforeMove] += 1;

    let delta: BoardDelta = {row: row, col: col, moveType: moveType, attackType: attackType};
    let state: IState = {
      delta: delta, 
      board: boardsAfterMove, 
      gameOver: isGameOver, 
      turnCounts: playerTurnCount, 
      currentBuffs: buffsAfterMove, 
      audioPlayed: [false, false],
      buffCDs: buffCDs
    };
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
    var move = createMove(null, 0, 0, 'attack', 0);
    log.log("move=", move);
  }
}
