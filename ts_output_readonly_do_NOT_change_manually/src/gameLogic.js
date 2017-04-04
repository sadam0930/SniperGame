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
    function getInitialState() {
        return { board: getInitialBoards(), delta: null, gameOver: false, turnCounts: [0, 0], currentBuffs: ['', ''], buffsEnabled: true };
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
    /**
     * Return the winner (either 'P1' or 'P2') or '' if there is no winner.
     * Compares the coordinates the player attacked
     * with the opponents position board
     */
    function getWinner(row, col, turnIndexBeforeMove, boards, attackType) {
        var opponentMoveBoard = (1 - turnIndexBeforeMove + 2);
        if (attackType === '') {
            if (boards[opponentMoveBoard][row][col] === 'P')
                return [('P' + (turnIndexBeforeMove + 1)), 'c'];
        }
        else if (attackType === 'grenade') {
            if (boards[opponentMoveBoard][row][col - 1] === 'P')
                return [('P' + (turnIndexBeforeMove + 1)), ('' + (col - 1))];
            else if (boards[opponentMoveBoard][row][col] === 'P')
                return [('P' + (turnIndexBeforeMove + 1)), ('' + (col))];
            else if (boards[opponentMoveBoard][row][col + 1] === 'P')
                return [('P' + (turnIndexBeforeMove + 1)), ('' + (col + 1))];
        }
        else if (attackType === 'air strike') {
            for (var i = 0; i < gameLogic.ROWS; i++) {
                if (boards[opponentMoveBoard][i][col] === 'P')
                    return [('P' + (turnIndexBeforeMove + 1)), ('' + i)];
            }
        }
        return ['', ''];
    }
    /**
     * Returns the move that should be performed when player
     * with index turnIndexBeforeMove makes a move in cell row X col.
     */
    function spawnPowerUps(boards, turnIndexBeforeMove, keepSpawningBuffs) {
        if (turnIndexBeforeMove === -1)
            return;
        var safe_guard_counter = 0;
        var buff_type_num = getRandomIntInclusive(2);
        var buff_type = '';
        if (buff_type_num == 0)
            buff_type = 'grenade';
        else if (buff_type_num == 1)
            buff_type = 'air strike';
        else {
            //toDo: Throw an error if this shouldn't happen
            log.info("spawnPowerUps() buff_type_num out of range.");
            return;
        }
        var move_board = (2 + turnIndexBeforeMove); // move board where buff is visible
        var buff_pos = getRandomPosition();
        var found_free_pos = false;
        while (boards[move_board][buff_pos[0]][buff_pos[1]] !== '') {
            buff_pos = getRandomPosition();
            if (safe_guard_counter > 30) {
                for (var i = 0; i < gameLogic.ROWS; i++) {
                    for (var j = 0; j < gameLogic.COLS; j++) {
                        if (boards[move_board][i][j] === '') {
                            buff_pos[0] = i;
                            buff_pos[1] = j;
                            found_free_pos = true;
                            break;
                        }
                    }
                    if (found_free_pos)
                        break;
                }
                if (!found_free_pos) {
                    keepSpawningBuffs = false;
                }
            }
            if (found_free_pos)
                break;
            safe_guard_counter += 1;
        }
        boards[move_board][buff_pos[0]][buff_pos[1]] = buff_type;
    }
    gameLogic.spawnPowerUps = spawnPowerUps;
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
        if ((playerTurnCount[turnIndexBeforeMove] === 0) && ('attack' === moveType))
            throw new Error("Must place position on first move!");
        // CHECK IF KILL SHOT
        var current_buffs = stateBeforeMove.currentBuffs;
        var buffsEnabled = stateBeforeMove.buffsEnabled;
        var attackType = current_buffs[playerID];
        var winner = getWinner(row, col, turnIndexBeforeMove, boards, attackType);
        var endMatchScores;
        endMatchScores = null;
        var turnIndex;
        var isGameOver = false;
        if (moveType === 'attack' && winner[0] !== '') {
            // Game over
            log.info("Game over! Winner is: ", winner[0]);
            turnIndex = -1;
            endMatchScores = winner[0] === 'P1' ? [1, 0] : winner[0] === 'P2' ? [0, 1] : [0, 0];
            isGameOver = true;
        }
        // UPDATE BOARDS
        turnIndex = endMatchScores === null ? (1 - turnIndexBeforeMove) : -1;
        var boardsAfterMove = angular.copy(boards);
        var boardMarker = winner[0] !== '' ? 'D' : 'B';
        var hit_location = Number(winner[1]);
        var buffsAfterMove = angular.copy(current_buffs);
        var keepSpawningBuffs = stateBeforeMove.buffsEnabled;
        if (moveType === 'attack') {
            if (attackType === 'grenade') {
                boardsAfterMove[playerID][row][col - 1] = boardsAfterMove[(1 - playerID) + 2][row][col - 1] = 'B';
                boardsAfterMove[playerID][row][col] = boardsAfterMove[(1 - playerID) + 2][row][col] = 'B';
                boardsAfterMove[playerID][row][col + 1] = boardsAfterMove[(1 - playerID) + 2][row][col + 1] = 'B';
                buffsAfterMove[playerID] = '';
                if (winner[1] != '')
                    boardsAfterMove[playerID][row][hit_location] = boardsAfterMove[(1 - playerID) + 2][row][hit_location] = boardMarker;
            }
            else if (attackType === 'air strike') {
                for (var i = 0; i < gameLogic.ROWS; i++)
                    boardsAfterMove[playerID][i][col] = boardsAfterMove[(1 - playerID) + 2][i][col] = 'B';
                buffsAfterMove[playerID] = '';
                if (winner[1] != '')
                    boardsAfterMove[playerID][hit_location][col] = boardsAfterMove[(1 - playerID) + 2][hit_location][col] = boardMarker;
            }
            else {
                boardsAfterMove[playerID][row][col] = boardsAfterMove[(1 - playerID) + 2][row][col] = boardMarker;
            }
        }
        else if (moveType === 'move') {
            if (isABuff(boardsAfterMove[playerID + 2][row][col]))
                buffsAfterMove[playerID] = boardsAfterMove[playerID + 2][row][col];
            assignNewPosition(boardsAfterMove[playerID + 2], row, col);
        }
        var my_turn_count = playerTurnCount[turnIndexBeforeMove];
        if ((my_turn_count > 0) && (my_turn_count % 3 == 0) && buffsEnabled) {
            spawnPowerUps(boardsAfterMove, turnIndexBeforeMove, keepSpawningBuffs);
        }
        playerTurnCount[turnIndexBeforeMove] += 1;
        var delta = { row: row, col: col, moveType: moveType, attackType: attackType };
        var state = { delta: delta, board: boardsAfterMove, gameOver: isGameOver, turnCounts: playerTurnCount, currentBuffs: buffsAfterMove, buffsEnabled: keepSpawningBuffs };
        return { endMatchScores: endMatchScores, turnIndex: turnIndex, state: state };
    }
    gameLogic.createMove = createMove;
    function isABuff(cellValue) {
        if (cellValue === 'grenade' || cellValue === 'air strike')
            return true;
        return false;
    }
    gameLogic.isABuff = isABuff;
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
        var move = createMove(null, 0, 0, 'attack', 0);
        log.log("move=", move);
    }
    gameLogic.forSimpleTestHtml = forSimpleTestHtml;
})(gameLogic || (gameLogic = {}));
//# sourceMappingURL=gameLogic.js.map