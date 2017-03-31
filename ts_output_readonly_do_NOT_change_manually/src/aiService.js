var aiService;
(function (aiService) {
    function generateComputerMove(currentState, currentTurnIndex) {
        currentTurnIndex = currentTurnIndex;
        if (currentState === null)
            currentState = gameLogic.getInitialState();
        var cell = [-1, -1];
        var moveType = '';
        var getBuff = checkBoardForBuff(currentState, currentTurnIndex, cell); //immediately get buff and skip searching for free cells
        moveType = getMoveType(currentState, currentTurnIndex, cell, getBuff);
        if (!getBuff)
            getCells(currentState, currentTurnIndex, moveType, cell);
        if (moveType === '' || cell[0] === -1 || cell[1] === -1) {
            log.info("Failed to generate computer move.");
            log.info("cell[0]: " + cell[0] + " cell[1]: " + cell[1] + " moveType: " + moveType);
            return;
        }
        return gameLogic.createMove(currentState, cell[0], cell[1], moveType, currentTurnIndex);
    }
    aiService.generateComputerMove = generateComputerMove;
    function checkBoardForBuff(currentState, currentTurnIndex, cell) {
        var moveBoard = currentState.board[(currentTurnIndex + 2)];
        for (var i = 0; i < gameLogic.ROWS; i++) {
            for (var j = 0; j < gameLogic.COLS; j++) {
                if (gameLogic.isABuff(moveBoard[i][j])) {
                    cell[0] = i;
                    cell[1] = j;
                    return true;
                }
            }
        }
        return false;
    }
    function canMove(currentState, currentTurnIndex) {
        var board = currentState.board[(currentTurnIndex + 2)];
        for (var i = 0; i < gameLogic.ROWS; i++) {
            for (var j = 0; j < gameLogic.COLS; j++) {
                if (board[i][j] === '')
                    return true;
            }
        }
        return false;
    }
    function canAttack(currentState, currentTurnIndex) {
        var board = currentState.board[(currentTurnIndex)];
        for (var i = 0; i < gameLogic.ROWS; i++) {
            for (var j = 0; j < gameLogic.COLS; j++) {
                if (board[i][j] === '')
                    return true;
            }
        }
        return false;
    }
    function getCells(currentState, currentTurnIndex, moveType, cell) {
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
    function getMoveType(currentState, currentTurnIndex, cell, getBuff) {
        var moveType;
        if (currentState.turnCounts[currentTurnIndex] === 0)
            moveType = 'move';
        else if (checkBoardForBuff(currentState, currentTurnIndex, cell, getBuff))
            moveType = 'move';
        else {
            var move = canMove(currentState, currentTurnIndex);
            var attack = canAttack(currentState, currentTurnIndex);
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
        return moveType;
    }
})(aiService || (aiService = {}));
//# sourceMappingURL=aiService.js.map