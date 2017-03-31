describe("aiService", function() {

    let uiBefore: IMove = { endMatchScores: null, turnIndex: null, state: null };
    let uiAfter: IMove = { endMatchScores: null, turnIndex: null, state: null };

    function expectException(uiBeforeMove: IMove): void {
        let aiMove = aiService.generateComputerMove(uiBeforeMove.state, uiBeforeMove.turnIndex);
        if (aiMove !== null) throw new Error("generateComputerMove should have returned null!");
    }

    function expectMove(uiBeforeMove: IMove, uiAfterMove: IMove): void {
        let aiMove = aiService.generateComputerMove(uiBeforeMove.state, uiBeforeMove.turnIndex);
        expect(angular.equals(aiMove, uiAfterMove)).toBe(true);
    }

    it("AI picks up grenade", function() {
        uiBefore = {
            endMatchScores: null,
            turnIndex: 1,          
            state: {
                board: 
                    [
                        [
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',]
                        ],
                        [
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',]
                        ],
                        [
                            ['P','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',]
                        ],
                        [
                            ['','','','','',],
                            ['','','','','',],
                            ['','','P','','',],
                            ['','grenade','','','',],
                            ['','','','','',],
                            ['','','','','',]
                        ]
                    ],
                delta: null,
                gameOver: false,
                turnCounts: [2,1],
                currentBuffs: ['', '']
            }
        };
        uiAfter = {
            endMatchScores: null,
            turnIndex: 0,          
            state: {
                board: 
                    [
                        [
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',]
                        ],
                        [
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',]
                        ],
                        [
                            ['P','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',]
                        ],
                        [
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','P','','','',],
                            ['','','','','',],
                            ['','','','','',]
                        ]
                    ],
                delta: {
                    row: 3, 
                    col: 1, 
                    moveType: 'move', 
                    attackType: '' 
                },
                gameOver: false,
                turnCounts: [2,2],
                currentBuffs: ['', 'grenade']
            }
        };

        expectMove(uiBefore, uiAfter);
   
    });

    it("AI picks up air strike", function() {
        uiBefore = {
            endMatchScores: null,
            turnIndex: 1,          
            state: {
                board: 
                    [
                        [
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',]
                        ],
                        [
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',]
                        ],
                        [
                            ['P','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',]
                        ],
                        [
                            ['','','','','',],
                            ['','','','','',],
                            ['','','P','','',],
                            ['','air strike','','','',],
                            ['','','','','',],
                            ['','','','','',]
                        ]
                    ],
                delta: null,
                gameOver: false,
                turnCounts: [2,1],
                currentBuffs: ['', '']
            }
        };
        uiAfter = {
            endMatchScores: null,
            turnIndex: 0,          
            state: {
                board: 
                    [
                        [
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',]
                        ],
                        [
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',]
                        ],
                        [
                            ['P','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',]
                        ],
                        [
                            ['','','','','',],
                            ['','','','','',],
                            ['','','','','',],
                            ['','P','','','',],
                            ['','','','','',],
                            ['','','','','',]
                        ]
                    ],
                delta: {
                    row: 3, 
                    col: 1, 
                    moveType: 'move', 
                    attackType: '' 
                },
                gameOver: false,
                turnCounts: [2,2],
                currentBuffs: ['', 'air strike']
            }
        };

        expectMove(uiBefore, uiAfter);
     
    });

    it("AI can't move and can only attack one cell", function() {
        uiBefore = {
            endMatchScores: null,
            turnIndex: 0,          
            state: {
                board: 
                    [
                        [
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','',],
                        ],
                        [
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','',],
                        ],
                        [
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','P',],
                        ],
                        [
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','P',],
                        ]
                    ],
                delta: null,
                gameOver: false,
                turnCounts: [2,2],
                currentBuffs: ['', '']
            }
        };
        uiAfter = {
            endMatchScores: [1, 0],
            turnIndex: -1,          
            state: {
                board: 
                    [
                        [
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','D',],
                        ],
                        [
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','',],
                        ],
                        [
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','P',],
                        ],
                        [
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','D',],
                        ]
                    ],
                delta: {
                    row: 5, 
                    col: 4, 
                    moveType: 'attack', 
                    attackType: '' 
                },
                gameOver: true,
                turnCounts: [3,2],
                currentBuffs: ['', '']
            }
        };

        expectMove(uiBefore, uiAfter);
     
    });

    it("AI can't attack and can only move to one cell", function() {
        uiBefore = {
            endMatchScores: null,
            turnIndex: 0,          
            state: {
                board: 
                    [
                        [
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                        ],
                        [
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                        ],
                        [
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','','P',],
                        ],
                        [
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','P',],
                        ]
                    ],
                delta: null,
                gameOver: false,
                turnCounts: [2,2],
                currentBuffs: ['', '']
            }
        };
        uiAfter = {
            endMatchScores: null,
            turnIndex: 1,          
            state: {
                board: 
                    [
                        [
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                        ],
                        [
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                        ],
                        [
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','P','',],
                        ],
                        [
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','P',],
                        ]
                    ],
                delta: {
                    row: 5, 
                    col: 3, 
                    moveType: 'move', 
                    attackType: '' 
                },
                gameOver: false,
                turnCounts: [3,2],
                currentBuffs: ['', '']
            }
        };

        expectMove(uiBefore, uiAfter);
     
    });

    it("AI can't do anything, should do nothing", function() {
        uiBefore = {
            endMatchScores: null,
            turnIndex: 0,          
            state: {
                board: 
                    [
                        [
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                        ],
                        [
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                        ],
                        [
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','P',],
                        ],
                        [
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','B',],
                            ['B','B','B','B','P',],
                        ]
                    ],
                delta: null,
                gameOver: false,
                turnCounts: [2,2],
                currentBuffs: ['', '']
            }
        };
        
        expectException(uiBefore);
     
    });
});