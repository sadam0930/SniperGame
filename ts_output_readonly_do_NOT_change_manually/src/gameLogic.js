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
    gameLogic.playerTurnCount = [];
    gameLogic.freeCells = [];
    gameLogic.playerPositions = [];
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
        // log.log("generating player positions")
        // let p1_pos = getRandomPosition();
        // boards[2][p1_pos[0]][p1_pos[1]] = 'P';
        // let p2_pos = getRandomPosition();
        // boards[3][p2_pos[0]][p2_pos[1]] = 'P';
        gameLogic.playerTurnCount[0] = gameLogic.playerTurnCount[1] = 0;
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
        game.current_buff[0] = game.current_buff[1] = '';
        return { board: getInitialBoards(), delta: null, gameOver: false };
    }
    gameLogic.getInitialState = getInitialState;
    function getRandomPosition() {
        return [getRandomIntInclusive(gameLogic.ROWS), getRandomIntInclusive(gameLogic.COLS)];
    }
    gameLogic.getRandomPosition = getRandomPosition;
    function getRandomIntInclusive(maxVal) {
        var min = Math.ceil(0);
        var max = Math.floor(maxVal);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    gameLogic.getRandomIntInclusive = getRandomIntInclusive;
    /**
     * Return the winner (either 'P1' or 'P2') or '' if there is no winner.
     * Compares the coordinates the player attacked
     * with the opponents position board
     */
    function getWinner(row, col, isP1Turn, boards, attackType) {
        var opponentMoveBoard = (1 - game.yourPlayerIndex() + 2);
        if (attackType === '') {
            if (boards[opponentMoveBoard][row][col] === 'P')
                return [('P' + (game.yourPlayerIndex() + 1)), 'c'];
        }
        else if (attackType === 'grenade') {
            if (boards[opponentMoveBoard][row][col - 1] === 'P')
                return [('P' + (game.yourPlayerIndex() + 1)), 'l'];
            else if (boards[opponentMoveBoard][row][col] === 'P')
                return [('P' + (game.yourPlayerIndex() + 1)), 'c'];
            else if (boards[opponentMoveBoard][row][col + 1] === 'P')
                return [('P' + (game.yourPlayerIndex() + 1)), 'r'];
        }
        return ['', ''];
    }
    /**
     * Returns the move that should be performed when player
     * with index turnIndexBeforeMove makes a move in cell row X col.
     */
    function spawnPowerUps(boards) {
        if (game.yourPlayerIndex() === -1)
            return;
        var safe_guard_counter = 0;
        var buff_type_num = gameLogic.getRandomIntInclusive(0);
        var buff_type = '';
        if (buff_type_num == 0)
            buff_type = 'grenade'; // placeholder buff
        else {
            log.info("spawnPowerUps() buff_type_num out of range.");
            return;
        }
        var move_board = (2 + game.yourPlayerIndex()); // move board where buff is visible
        var buff_pos = gameLogic.getRandomPosition();
        while (boards[move_board][buff_pos[0]][buff_pos[1]] !== '') {
            var buff_pos_1 = gameLogic.getRandomPosition();
            var found_free_pos = false;
            if (safe_guard_counter > 30) {
                for (var i = 0; i < gameLogic.ROWS; i++) {
                    for (var j = 0; j < gameLogic.COLS; j++) {
                        if (boards[move_board][i][j] === '') {
                            buff_pos_1[0] = i;
                            buff_pos_1[1] = j;
                            found_free_pos = true;
                            break;
                        }
                    }
                    if (found_free_pos)
                        break;
                }
                if (!found_free_pos) {
                    game.buffs_enabled = false;
                    return;
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
        var playerID = game.yourPlayerIndex();
        var board;
        var isP1Turn = (playerID === 0);
        var isP2Turn = !isP1Turn;
        var boardIdx;
        if (moveType === 'attack')
            boardIdx = (playerID);
        else
            boardIdx = (playerID + 2);
        board = boards[boardIdx];
        // CHECK IF LEGAL MOVE
        if (board[row][col] == 'P' || board[row][col] == 'B')
            throw new Error("One can only make a move in an empty position!");
        if (stateBeforeMove.gameOver)
            throw new Error("Game Over!");
        if (game.firstMove() && ('attack' === moveType))
            throw new Error("Must place position on first move!");
        // CHECK IF KILL SHOT
        var attackType = '';
        if (game.current_buff[playerID] === 'grenade')
            attackType = 'grenade';
        var winner = getWinner(row, col, isP1Turn, boards, attackType);
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
        if (moveType === 'attack') {
            if (game.current_buff[playerID] === 'grenade') {
                boardsAfterMove[playerID][row][col - 1] = boardsAfterMove[(1 - playerID) + 2][row][col - 1] = 'B';
                boardsAfterMove[playerID][row][col] = boardsAfterMove[(1 - playerID) + 2][row][col] = 'B';
                boardsAfterMove[playerID][row][col + 1] = boardsAfterMove[(1 - playerID) + 2][row][col + 1] = 'B';
                game.current_buff[playerID] = '';
            }
            else {
                boardsAfterMove[playerID][row][col] = boardsAfterMove[(1 - playerID) + 2][row][col] = 'B';
            }
            if (winner[1] === 'l')
                boardsAfterMove[playerID][row][col - 1] = boardsAfterMove[(1 - playerID) + 2][row][col - 1] = boardMarker;
            else if (winner[1] === 'c')
                boardsAfterMove[playerID][row][col] = boardsAfterMove[(1 - playerID) + 2][row][col] = boardMarker;
            else if (winner[1] === 'r')
                boardsAfterMove[playerID][row][col + 1] = boardsAfterMove[(1 - playerID) + 2][row][col + 1] = boardMarker;
        }
        else if (moveType === 'move') {
            if (game.isABuff(boardsAfterMove[playerID + 2][row][col]))
                game.current_buff[playerID] = boardsAfterMove[playerID + 2][row][col];
            assignNewPosition(boardsAfterMove[playerID + 2], row, col);
        }
        var my_turn_count = gameLogic.playerTurnCount[game.yourPlayerIndex()];
        if ((my_turn_count > 0) && (my_turn_count % 2 == 0) && game.buffs_enabled) {
            gameLogic.spawnPowerUps(boardsAfterMove);
        }
        var delta = { row: row, col: col, moveType: moveType };
        var state = { delta: delta, board: boardsAfterMove, gameOver: isGameOver };
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
        var move = gameLogic.createMove(null, 0, 0, 'attack', 0);
        log.log("move=", move);
    }
    gameLogic.forSimpleTestHtml = forSimpleTestHtml;
})(gameLogic || (gameLogic = {}));
//# sourceMappingURL=gameLogic.js.map