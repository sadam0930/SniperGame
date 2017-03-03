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
    gameLogic.isFirstMove = true; //instance variable for each client
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
        return { board: getInitialBoards(), delta: null, gameOver: false };
    }
    gameLogic.getInitialState = getInitialState;
    function getRandomPosition() {
        return [getRandomIntInclusive(gameLogic.ROWS), getRandomIntInclusive(gameLogic.COLS)];
    }
    function getRandomIntInclusive(maxVal) {
        var min = Math.ceil(0);
        var max = Math.floor(maxVal);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    /**
     * Return the winner (either 'P1' or 'P2') or '' if there is no winner.
     * Compares the coordinates the player attacked
     * with the opponents position board
     */
    function getWinner(row, col, isP1Turn, boards) {
        if (isP1Turn && boards[3][row][col] === 'P') {
            return 'P1';
        }
        if (!isP1Turn && boards[2][row][col] === 'P') {
            return 'P2';
        }
        return '';
    }
    /**
     * Returns the move that should be performed when player
     * with index turnIndexBeforeMove makes a move in cell row X col.
     */
    function createMove(stateBeforeMove, row, col, moveType, turnIndexBeforeMove) {
        if (!stateBeforeMove) {
            stateBeforeMove = getInitialState();
        }
        var boards = stateBeforeMove.board;
        var board;
        /*
        * Based on the turnindex and the moveType
        * we can figure out which board to use
        */
        var isP1Turn = (turnIndexBeforeMove % 2 === 0);
        var isP2Turn = !isP1Turn;
        var boardIdx;
        if (isP1Turn && 'attack' === moveType) {
            boardIdx = 0;
        }
        else if (isP1Turn && 'move' === moveType) {
            boardIdx = 2;
        }
        else if (isP2Turn && 'attack' === moveType) {
            boardIdx = 1;
        }
        else if (isP2Turn && 'move' === moveType) {
            boardIdx = 3;
        }
        board = boards[boardIdx];
        if (board[row][col] !== '') {
            throw new Error("One can only make a move in an empty position!");
        }
        if (stateBeforeMove.gameOver) {
            throw new Error("Game Over!");
        }
        if (gameLogic.isFirstMove && 'attack' === moveType) {
            throw new Error("Must place position on first move!");
        }
        gameLogic.isFirstMove = false;
        //check if move is a hit, then game over
        var winner = getWinner(row, col, isP1Turn, boards);
        var endMatchScores;
        endMatchScores = null;
        var turnIndex;
        var isGameOver = false;
        if (moveType === 'attack' && winner !== '') {
            // Game over
            log.info("Game over! Winner is: ", winner);
            turnIndex = -1;
            endMatchScores = winner === 'P1' ? [1, 0] : winner === 'P2' ? [0, 1] : [0, 0];
            isGameOver = true;
        }
        // Game continues. Now it's the opponent's turn 
        // (the turn switches from 0 to 1 and 1 to 0).
        turnIndex = endMatchScores === null ? (1 - turnIndexBeforeMove) : -1;
        var boardsAfterMove = angular.copy(boards);
        /*
        * Depending on the action update the board for movement or broken window.
        * Update both the view of opponent and the opponents movement boards
        */
        if (isP1Turn && 'attack' === moveType) {
            boardsAfterMove[0][row][col] = boardsAfterMove[3][row][col] = 'B';
        }
        else if (isP1Turn && 'move' === moveType) {
            assignNewPosition(boardsAfterMove[2], row, col);
        }
        else if (isP2Turn && 'attack' === moveType) {
            boardsAfterMove[1][row][col] = boardsAfterMove[2][row][col] = 'B';
        }
        else if (isP2Turn && 'move' === moveType) {
            assignNewPosition(boardsAfterMove[3], row, col);
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