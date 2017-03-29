var aiService;
(function (aiService) {
    var aiState = null;
    var cell = [];
    var moveType = '';
    var getBuff = false;
    function generateComputerMove(currentUpdateUI) {
        aiState = currentUpdateUI;
        if (aiState.state === null)
            aiState.state = gameLogic.getInitialState();
        cell[0] = cell[1] = -1;
        moveType = '';
        getBuff = false;
        getMoveType();
        if (!getBuff)
            getCells();
        if (moveType === '' || cell[0] === -1 || cell[1] === -1) {
            log.info("Failed to generate computer move.");
            log.info("cell[0]: " + cell[0] + " cell[1]: " + cell[1] + " moveType: " + moveType);
            return;
        }
        log.info("Computer's move: " + moveType, cell);
        makeComputerMove();
    }
    aiService.generateComputerMove = generateComputerMove;
    function checkBoardForBuff() {
        var moveBoard = aiState.state.board[(aiState.turnIndex + 2)];
        for (var i = 0; i < gameLogic.ROWS; i++) {
            for (var j = 0; j < gameLogic.COLS; j++) {
                if (game.isABuff(moveBoard[i][j])) {
                    cell[0] = i;
                    cell[1] = j;
                    getBuff = true;
                    return true;
                }
            }
        }
        return false;
    }
    function canMove() {
        var board = aiState.state.board[(aiState.turnIndex + 2)];
        for (var i = 0; i < gameLogic.ROWS; i++) {
            for (var j = 0; j < gameLogic.COLS; j++) {
                if (board[i][j] === '')
                    return true;
            }
        }
        return false;
    }
    function canAttack() {
        var board = aiState.state.board[(aiState.turnIndex)];
        for (var i = 0; i < gameLogic.ROWS; i++) {
            for (var j = 0; j < gameLogic.COLS; j++) {
                if (board[i][j] === '')
                    return true;
            }
        }
        return false;
    }
    function getCells() {
        if (moveType === '')
            return;
        var safe_guard_counter = 0;
        var board = (moveType === 'move') ?
            aiState.state.board[aiState.turnIndex + 2] :
            aiState.state.board[aiState.turnIndex];
        var pos = gameLogic.getRandomPosition();
        while (board[pos[0]][pos[1]] !== '') {
            pos = gameLogic.getRandomPosition();
            if (safe_guard_counter > 30) {
                for (var i = 0; i < gameLogic.ROWS; i++) {
                    for (var j = 0; j < gameLogic.COLS; j++) {
                        if (board[i][j] === '') {
                            cell[0] = i;
                            cell[1] = j;
                            return;
                        }
                    }
                }
                log.info("Error: Could not find an empty cell!");
                return;
            }
            safe_guard_counter += 1;
        }
        cell[0] = pos[0];
        cell[1] = pos[1];
    }
    function getMoveType() {
        if (aiState.state.turnCounts[aiState.turnIndex] === 0)
            moveType = 'move';
        else if (checkBoardForBuff())
            moveType = 'move';
        else {
            var move = canMove();
            var attack = canAttack();
            if (move && attack) {
                var moveAsInt = (gameLogic.getRandomIntInclusive(10) + 1);
                if (moveAsInt <= 3)
                    moveType = 'move'; // 30% chance to move
                else
                    moveType = 'attack'; // 70% chance to attack
            }
            else if (!move && attack)
                moveType = 'attack';
            else if (move && !attack)
                moveType = 'move';
            else
                log.info("Error: No moves available!");
        }
    }
    function makeComputerMove() {
        //stateBeforeMove: IState, row: number, col: number, moveType: string, turnIndexBeforeMove: number)
        var computerMove = gameLogic.createMove(aiState.state, cell[0], cell[1], moveType, aiState.turnIndex);
        game.makeMove(computerMove);
    }
    aiService.makeComputerMove = makeComputerMove;
})(aiService || (aiService = {}));
//# sourceMappingURL=aiService.js.map