var gameService = gamingPlatform.gameService;
var alphaBetaService = gamingPlatform.alphaBetaService;
var translate = gamingPlatform.translate;
var resizeGameAreaService = gamingPlatform.resizeGameAreaService;
var log = gamingPlatform.log;
var dragAndDropService = gamingPlatform.dragAndDropService;
var gameLogic;
(function (gameLogic) {
    gameLogic.ROWS = 6;
    gameLogic.COLS = 5;
    gameLogic.NUMPLAYERS = 2;
    /**
    * Returns the initial Sniper boards, which is a ROWSxCOLS matrix containing ''.
    * There are 4 boards. P1 is even boards. P2 is odd boards.
    * This makes it easy to track turns with (turnIndex%2 === 0)
    * boards[0] = P1 view of P2
    * boards[1] = P2 view of P1
    * boards[2] = P1 view of self to move position
    * boards[3] = P2 view of self to move position
    */
    function getInitialBoards() {
        log.log("creating new boards");
        var boards = [];
        for (var i = 0; i < gameLogic.NUMPLAYERS * 2; i++) {
            boards[i] = getBlankBoard();
        }
        var pos = getRandomPosition();
        boards[gameLogic.NUMPLAYERS][pos[0]][pos[1]] = 'P';
        pos = getRandomPosition();
        boards[(gameLogic.NUMPLAYERS + 1)][pos[0]][pos[1]] = 'P';
        return boards;
    }
    gameLogic.getInitialBoards = getInitialBoards;
    function getBlankBoard() {
        var board = [];
        for (var i = 0; i < gameLogic.ROWS; i++) {
            board[i] = [];
            for (var j = 0; j < gameLogic.COLS; j++) {
                board[i][j] = '';
            }
        }
        return board;
    }
    gameLogic.getBlankBoard = getBlankBoard;
    function getInitialBuffCDs() {
        var buffCDs1 = {
            Grenade: 0,
            SprayBullets: 0,
            AirStrike: 0,
            Fortify: 0
        };
        var buffCDs2 = {
            Grenade: 0,
            SprayBullets: 0,
            AirStrike: 0,
            Fortify: 0
        };
        return [buffCDs1, buffCDs2];
    }
    function getInitialState() {
        return {
            board: getInitialBoards(),
            delta: null,
            gameOver: false,
            turnCounts: [0, 0],
            currentBuffs: ['', ''],
            buffCDs: getInitialBuffCDs()
        };
    }
    gameLogic.getInitialState = getInitialState;
    function getRandomPosition() {
        return [getRandomIntInclusive(gameLogic.ROWS), getRandomIntInclusive(gameLogic.COLS)];
    }
    gameLogic.getRandomPosition = getRandomPosition;
    function getRandomIntInclusive(maxVal) {
        return Math.floor(Math.random() * (maxVal)); // returns 0 to maxVal - 1
    }
    gameLogic.getRandomIntInclusive = getRandomIntInclusive;
    function getIntWithRange(min, max) {
        return (Math.floor(Math.random() * (max - min + 1)) + min);
    }
    function getRandomSprayPosition(origin) {
        // RANGE OF SPRAY
        var range = 1;
        // GET ROW
        var min = ((origin[0] - range) >= 0) ? (origin[0] - range) : 0;
        var max = ((origin[0] + range) < gameLogic.ROWS) ? (origin[0] + range) : (gameLogic.ROWS - 1);
        var row = getIntWithRange(min, max);
        // GET COL
        min = ((origin[1] - range) >= 0) ? (origin[1] - range) : 0;
        max = ((origin[1] + range) < gameLogic.COLS) ? (origin[1] + range) : (gameLogic.COLS - 1);
        var col = getIntWithRange(min, max);
        return [row, col];
    }
    /**
     * Return the winner (either 'P1' or 'P2') or '' if there is no winner.
     * Compares the coordinates the player attacked
     * with the opponents position board
     */
    function updateBuffCDs(buffCDs, pid) {
        var newBuffCDs = angular.copy(buffCDs);
        newBuffCDs[pid].Grenade = ((newBuffCDs[pid].Grenade !== 0) ? (newBuffCDs[pid].Grenade - 1) : 0);
        newBuffCDs[pid].SprayBullets = ((newBuffCDs[pid].SprayBullets !== 0) ? (newBuffCDs[pid].SprayBullets - 1) : 0);
        newBuffCDs[pid].AirStrike = ((newBuffCDs[pid].AirStrike !== 0) ? (newBuffCDs[pid].AirStrike - 1) : 0);
        newBuffCDs[pid].Fortify = ((newBuffCDs[pid].Fortify !== 0) ? (newBuffCDs[pid].Fortify - 1) : 0);
        return newBuffCDs;
    }
    function triggerCD(attackType, buffCDs, playerID) {
        var tempBuffCDs = angular.copy(buffCDs);
        if (attackType === '')
            return tempBuffCDs;
        else if (attackType === 'G')
            tempBuffCDs[playerID].Grenade = 3;
        else if (attackType === 'S')
            tempBuffCDs[playerID].SprayBullets = 4;
        else if (attackType === 'A')
            tempBuffCDs[playerID].AirStrike = 5;
        else if (attackType === 'F')
            tempBuffCDs[playerID].Fortify = 5;
        return tempBuffCDs;
    }
    function checkCD(attackType, buffCDs, playerID) {
        if (attackType === '')
            return 0;
        else if (attackType === 'G')
            return buffCDs[playerID].Grenade;
        else if (attackType === 'S')
            return buffCDs[playerID].SprayBullets;
        else if (attackType === 'A')
            return buffCDs[playerID].AirStrike;
        else if (attackType === 'F')
            return buffCDs[playerID].Fortify;
    }
    gameLogic.checkCD = checkCD;
    function getWinner(row, col, turnIndexBeforeMove, boards, attackType) {
        var opponentMoveBoard = (1 - turnIndexBeforeMove + 2);
        if (attackType === '' || attackType === 'F') {
            if (boards[opponentMoveBoard][row][col] === 'P')
                return [('P' + (turnIndexBeforeMove + 1)), ('' + (col))];
        }
        else if (attackType === 'G') {
            if (boards[opponentMoveBoard][row][col - 1] === 'P')
                return [('P' + (turnIndexBeforeMove + 1)), ('' + (col - 1))];
            else if (boards[opponentMoveBoard][row][col] === 'P')
                return [('P' + (turnIndexBeforeMove + 1)), ('' + (col))];
            else if (boards[opponentMoveBoard][row][col + 1] === 'P')
                return [('P' + (turnIndexBeforeMove + 1)), ('' + (col + 1))];
        }
        else if (attackType === 'A') {
            for (var i = 0; i < gameLogic.ROWS; i++) {
                if (boards[opponentMoveBoard][i][col] === 'P')
                    return [('P' + (turnIndexBeforeMove + 1)), ('' + i)];
            }
        }
        else if (attackType === 'S') {
            var returnArray = [];
            returnArray[0] = returnArray[1] = returnArray[2] = '';
            var attackPos = [];
            attackPos[0] = row + ',' + col;
            for (var i = 1; i < 4; i++) {
                var randPos = getRandomSprayPosition([row, col]);
                attackPos[i] = randPos[0] + ',' + randPos[1];
            }
            for (var i = 0; i < attackPos.length; i++) {
                var r = Number(attackPos[i].split(',')[0]);
                var c = Number(attackPos[i].split(',')[1]);
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
    function createMove(stateBeforeMove, row, col, moveType, turnIndexBeforeMove) {
        // GET CURRENT BOARDS
        if (!stateBeforeMove) {
            stateBeforeMove = getInitialState();
        }
        var boards = stateBeforeMove.board;
        // SPECIFIC BOARD WE'RE EDITING
        var playerID = turnIndexBeforeMove;
        var board;
        var isP1Turn = (playerID === 0);
        var isP2Turn = !isP1Turn;
        var playerTurnCount = stateBeforeMove.turnCounts;
        var boardIdx;
        if (moveType === 'attack')
            boardIdx = (playerID);
        else
            boardIdx = (playerID + 2);
        board = boards[boardIdx];
        // CHECK IF LEGAL MOVE
        if (row > gameLogic.ROWS || row < 0 || col > gameLogic.COLS || col < 0)
            throw new Error("Cannot move outside of board!");
        if (board[row][col] == 'P' || board[row][col] == 'B')
            throw new Error("One can only make a move in an empty position!");
        if (stateBeforeMove.gameOver)
            throw new Error("Game Over!");
        // if ((playerTurnCount[turnIndexBeforeMove] === 0) && ('attack' === moveType)) throw new Error("Must place position on first move!");
        // CHECK IF KILL SHOT
        var current_buffs = stateBeforeMove.currentBuffs;
        var attackType = current_buffs[playerID];
        // IF CD ISN'T UP, SET ATTACK TO NORMAL ATTACK
        if (checkCD(attackType, stateBeforeMove.buffCDs, playerID) !== 0) {
            attackType = '';
            stateBeforeMove.currentBuffs[playerID] = '';
        }
        var winner = getWinner(row, col, turnIndexBeforeMove, boards, attackType);
        var endMatchScores;
        endMatchScores = null;
        var turnIndex;
        var isGameOver = false;
        if (moveType === 'attack' && winner[0] !== '' && (current_buffs[1 - playerID] !== 'F')) {
            // Game over
            log.info("Game over! Winner is: ", winner[0]);
            turnIndex = -1;
            endMatchScores = (winner[0] === 'P1') ? [1, 0] : [0, 1];
            isGameOver = true;
        }
        // UPDATE BOARDS
        turnIndex = endMatchScores === null ? (1 - turnIndexBeforeMove) : -1;
        var boardsAfterMove = angular.copy(boards);
        var boardMarker = winner[0] !== '' ? 'D' : 'B';
        var hit_location = Number(winner[1]);
        var buffsAfterMove = angular.copy(current_buffs);
        var buffCDs = updateBuffCDs(stateBeforeMove.buffCDs, playerID);
        var cellsHit = [];
        if (moveType === 'attack') {
            buffCDs = triggerCD(attackType, buffCDs, playerID);
            if (buffsAfterMove[(1 - playerID)] === 'F') {
                buffsAfterMove[1 - playerID] = '';
                if (buffsAfterMove[playerID] !== 'F') {
                    buffsAfterMove[playerID] = '';
                }
                cellsHit.push([row, col]);
            }
            else if (attackType === 'G') {
                if ((col - 1) < gameLogic.COLS && (col - 1) >= 0) {
                    boardsAfterMove[playerID][row][col - 1] = boardsAfterMove[(1 - playerID) + 2][row][col - 1] = 'B';
                    cellsHit.push([row, (col - 1)]);
                }
                boardsAfterMove[playerID][row][col] = boardsAfterMove[(1 - playerID) + 2][row][col] = 'B';
                cellsHit.push([row, col]);
                if ((col + 1) < gameLogic.COLS && (col + 1) >= 0) {
                    boardsAfterMove[playerID][row][col + 1] = boardsAfterMove[(1 - playerID) + 2][row][col + 1] = 'B';
                    cellsHit.push([row, (col + 1)]);
                }
                buffsAfterMove[playerID] = '';
                if (winner[1] != '')
                    boardsAfterMove[playerID][row][hit_location] = boardsAfterMove[(1 - playerID) + 2][row][hit_location] = boardMarker;
            }
            else if (attackType === 'A') {
                for (var i = 0; i < gameLogic.ROWS; i++) {
                    boardsAfterMove[playerID][i][col] = boardsAfterMove[(1 - playerID) + 2][i][col] = 'B';
                    cellsHit.push([i, col]);
                }
                buffsAfterMove[playerID] = '';
                if (winner[1] != '')
                    boardsAfterMove[playerID][hit_location][col] = boardsAfterMove[(1 - playerID) + 2][hit_location][col] = boardMarker;
            }
            else if (attackType === 'S') {
                var hitList = winner[2].split(';');
                for (var i = 0; i < hitList.length; i++) {
                    var r = Number(hitList[i].split(',')[0]);
                    var c = Number(hitList[i].split(',')[1]);
                    boardsAfterMove[playerID][r][c] = boardsAfterMove[(1 - playerID) + 2][r][c] = 'B';
                    cellsHit.push([r, c]);
                }
                if (winner[1] !== '') {
                    var r = Number(winner[1].split(',')[0]);
                    var c = Number(winner[1].split(',')[1]);
                    boardsAfterMove[playerID][r][c] = boardsAfterMove[(1 - playerID) + 2][r][c] = 'D';
                }
                buffsAfterMove[playerID] = '';
            }
            else {
                boardsAfterMove[playerID][row][col] = boardsAfterMove[(1 - playerID) + 2][row][col] = boardMarker;
                cellsHit.push([row, col]);
            }
        }
        else if (moveType === 'move') {
            assignNewPosition(boardsAfterMove[playerID + 2], row, col);
        }
        playerTurnCount[turnIndexBeforeMove] += 1;
        var delta = {
            row: row,
            col: col,
            moveType: moveType,
            attackType: attackType,
            cellsHit: cellsHit
        };
        var state = {
            delta: delta,
            board: boardsAfterMove,
            gameOver: isGameOver,
            turnCounts: playerTurnCount,
            currentBuffs: buffsAfterMove,
            buffCDs: buffCDs
        };
        return { endMatchScores: endMatchScores, turnIndex: turnIndex, state: state };
    }
    gameLogic.createMove = createMove;
    function assignNewPosition(board, row, col) {
        for (var i = 0; i < gameLogic.ROWS; i++) {
            for (var j = 0; j < gameLogic.COLS; j++) {
                if (board[i][j] === 'P') {
                    board[i][j] = '';
                }
            }
        }
        board[row][col] = 'P';
    }
    function createInitialMove() {
        return { endMatchScores: null, turnIndex: 0,
            state: getInitialState() };
    }
    gameLogic.createInitialMove = createInitialMove;
    function forSimpleTestHtml() {
        var move = createMove(null, 0, 0, 'move', 0);
        log.log("move=", move);
    }
    gameLogic.forSimpleTestHtml = forSimpleTestHtml;
})(gameLogic || (gameLogic = {}));
//# sourceMappingURL=gameLogic.js.map