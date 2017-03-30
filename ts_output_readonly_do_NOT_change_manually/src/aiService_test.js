describe("aiService", function () {
    var P1_TURN = 0;
    var AI_TURN = 1;
    var NO_ONE_TURN = -1;
    var NO_ONE_WINS = null;
    var P1_WIN_SCORES = [1, 0];
    var P2_WIN_SCORES = [0, 1];
    function createComputerMove(board, gameOver, turnCounts, currentBuffs, turnIndex) {
        var stateBeforeMove = { board: board, delta: null, gameOver: gameOver, turnCounts: turnCounts, currentBuffs: currentBuffs };
        return aiService.generateComputerMove(stateBeforeMove, turnIndex);
    }
    function expectException(turnIndexBeforeMove, turnCountBeforeMove, currentBuffs, boardBeforeMove, row, col, moveType, attackType, //not actually used here since we don't care about the delta
        gameOver) {
        var stateBeforeMove = boardBeforeMove ? { board: boardBeforeMove, delta: null, gameOver: gameOver, turnCounts: turnCountBeforeMove, currentBuffs: currentBuffs } : null;
        // We expect an exception to be thrown :)
        var didThrowException = false;
        try {
            createComputerMove(boardBeforeMove, gameOver, turnCountBeforeMove, currentBuffs, turnIndexBeforeMove);
        }
        catch (e) {
            didThrowException = true;
        }
        if (!didThrowException) {
            throw new Error("We expect an illegal move, but createMove didn't throw any exception!");
        }
    }
    function expectMove(turnIndexBeforeMove, turnCountBeforeMove, currentBuffs, boardBeforeMove, row, col, moveType, attackType, boardAfterMove, turnIndexAfterMove, endMatchScores, turnCountAfterMove, buffsAfterMove, gameOver) {
        var expectedMove = {
            turnIndex: P1_TURN,
            endMatchScores: endMatchScores,
            state: { board: boardAfterMove, delta: { row: row, col: col, moveType: moveType, attackType: attackType }, gameOver: gameOver, turnCounts: turnCountAfterMove, currentBuffs: buffsAfterMove }
        };
        var aiMove = createComputerMove(boardBeforeMove, gameOver, turnCountBeforeMove, currentBuffs, turnIndexBeforeMove);
        expect(angular.equals(aiMove, expectedMove)).toBe(true);
    }
    it("computer moves to pick up buff", function () {
        expectMove(AI_TURN, [2, 1], ['', ''], [[['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', '']],
            [['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', '']],
            [['P', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', 'grenade', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', '']],
            [['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', 'P', '', ''],
                ['', 'grenade', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', '']]], 3, 1, 'move', '', [[['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', '']],
            [['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', '']],
            [['P', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', '']],
            [['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', 'P', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', '']]], P1_TURN, NO_ONE_WINS, [2, 2], ['', 'grenade'], false);
    });
});
//# sourceMappingURL=aiService_test.js.map