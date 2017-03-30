var aiService;
(function (aiService) {
    var currentState = null;
    var currentTurnIndex = null;
    var cell = [];
    var moveType = '';
    var getBuff = false;
    function generateComputerMove(currentState, currentTurnIndex) {
        currentState = currentState;
        currentTurnIndex = currentTurnIndex;
        if (currentState === null)
            currentState = gameLogic.getInitialState();
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
        return gameLogic.createMove(currentState, cell[0], cell[1], moveType, currentTurnIndex);
    }
    aiService.generateComputerMove = generateComputerMove;
    function checkBoardForBuff() {
        var moveBoard = currentState.board[(currentTurnIndex + 2)];
        for (var i = 0; i < gameLogic.ROWS; i++) {
            for (var j = 0; j < gameLogic.COLS; j++) {
                if (gameLogic.isABuff(moveBoard[i][j])) {
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
        var board = currentState.board[(currentTurnIndex + 2)];
        for (var i = 0; i < gameLogic.ROWS; i++) {
            for (var j = 0; j < gameLogic.COLS; j++) {
                if (board[i][j] === '')
                    return true;
            }
        }
        return false;
    }
    function canAttack() {
        var board = currentState.board[(currentTurnIndex)];
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
            currentState.board[currentTurnIndex + 2] :
            currentState.board[currentTurnIndex];
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
        if (currentState.turnCounts[currentTurnIndex] === 0)
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
})(aiService || (aiService = {}));
//# sourceMappingURL=aiService.js.map