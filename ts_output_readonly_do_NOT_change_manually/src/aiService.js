var aiService;
(function (aiService) {
    /** Returns the move that the computer player should do for the given state in move. */
    function findComputerMove(move) {
        return createComputerMove(move, 
        // at most 1 second for the AI to choose a move (but might be much quicker)
        { millisecondsLimit: 1000 });
    }
    aiService.findComputerMove = findComputerMove;
    /* move =
        endMatchScores: currentUpdateUI.endMatchScores,
        state: currentUpdateUI.state,
            board: Board[];
            delta: BoardDelta;
            gameOver: boolean;
            turnCounts: number[];
        turnIndex: currentUpdateUI.turnIndex,
    */
    function createComputerMove(move, alphaBetaLimits) {
        var nextMove = gameLogic.createMove(move.state, row, col, moveType, move.turnIndex);
        game.makeMove(nextMove);
    }
    aiService.createComputerMove = createComputerMove;
})(aiService || (aiService = {}));
//# sourceMappingURL=aiService.js.map