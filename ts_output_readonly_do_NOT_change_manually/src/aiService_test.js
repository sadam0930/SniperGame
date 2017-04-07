describe("aiService", function () {
    var uiBefore = { endMatchScores: null, turnIndex: null, state: null };
    var uiAfter = { endMatchScores: null, turnIndex: null, state: null };
    function troubleshoot(move) {
        console.log(move.endMatchScores);
        console.log(move.turnIndex);
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < gameLogic.ROWS; j++) {
                console.log(move.state.board[i][j]);
            }
            console.log("\n");
        }
        console.log(move.state.delta);
        console.log(move.state.gameOver);
        console.log(move.state.turnCounts);
        console.log(move.state.currentBuffs);
        console.log(move.state.buffCDs);
    }
    function expectException(uiBeforeMove) {
        var aiMove = aiService.generateComputerMove(uiBeforeMove.state, uiBeforeMove.turnIndex);
        if (aiMove !== null)
            throw new Error("generateComputerMove should have returned null!");
    }
    function expectMove(uiBeforeMove, uiAfterMove, expectedOutcome, troubleshooting) {
        var aiMove = aiService.generateComputerMove(uiBeforeMove.state, uiBeforeMove.turnIndex);
        if (troubleshooting)
            troubleshoot(aiMove);
        expect(angular.equals(aiMove, uiAfterMove)).toBe(expectedOutcome);
    }
    it("AI P1 attacks with no buff", function () {
        uiBefore = {
            endMatchScores: null,
            turnIndex: 0,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ]
                ],
                delta: null,
                gameOver: false,
                turnCounts: [3, 3],
                currentBuffs: ['', ''],
                buffCDs: [
                    {
                        Grenade: 1,
                        SprayBullets: 1,
                        AirStrike: 1,
                        Fortify: 1
                    },
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    }
                ]
            }
        };
        uiAfter = {
            endMatchScores: [1, 0],
            turnIndex: -1,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'D',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'D',],
                    ]
                ],
                delta: {
                    row: 5,
                    col: 4,
                    moveType: 'attack',
                    attackType: ''
                },
                gameOver: true,
                turnCounts: [4, 3],
                currentBuffs: ['', ''],
                buffCDs: [
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    },
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    }
                ]
            }
        };
        expectMove(uiBefore, uiAfter, true, false);
    });
    it("AI P2 attacks with no buff", function () {
        uiBefore = {
            endMatchScores: null,
            turnIndex: 1,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ]
                ],
                delta: null,
                gameOver: false,
                turnCounts: [4, 3],
                currentBuffs: ['', ''],
                buffCDs: [
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    },
                    {
                        Grenade: 1,
                        SprayBullets: 1,
                        AirStrike: 1,
                        Fortify: 1
                    }
                ]
            }
        };
        uiAfter = {
            endMatchScores: [0, 1],
            turnIndex: -1,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'D',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'D',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ]
                ],
                delta: {
                    row: 5,
                    col: 4,
                    moveType: 'attack',
                    attackType: ''
                },
                gameOver: true,
                turnCounts: [4, 4],
                currentBuffs: ['', ''],
                buffCDs: [
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    },
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    }
                ]
            }
        };
        expectMove(uiBefore, uiAfter, true, false);
    });
    it("AI P1 attacks with grenade", function () {
        uiBefore = {
            endMatchScores: null,
            turnIndex: 0,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ]
                ],
                delta: null,
                gameOver: false,
                turnCounts: [3, 3],
                currentBuffs: ['', ''],
                buffCDs: [
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    },
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    }
                ]
            }
        };
        uiAfter = {
            endMatchScores: [1, 0],
            turnIndex: -1,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'D',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'D',],
                    ]
                ],
                delta: {
                    row: 5,
                    col: 4,
                    moveType: 'attack',
                    attackType: 'G'
                },
                gameOver: true,
                turnCounts: [4, 3],
                currentBuffs: ['', ''],
                buffCDs: [
                    {
                        Grenade: 3,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    },
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    }
                ]
            }
        };
        expectMove(uiBefore, uiAfter, true, false);
    });
    it("AI P2 attacks with grenade", function () {
        uiBefore = {
            endMatchScores: null,
            turnIndex: 1,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ]
                ],
                delta: null,
                gameOver: false,
                turnCounts: [4, 3],
                currentBuffs: ['', ''],
                buffCDs: [
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    },
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    }
                ]
            }
        };
        uiAfter = {
            endMatchScores: [0, 1],
            turnIndex: -1,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'D',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'D',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ]
                ],
                delta: {
                    row: 5,
                    col: 4,
                    moveType: 'attack',
                    attackType: 'G'
                },
                gameOver: true,
                turnCounts: [4, 4],
                currentBuffs: ['', ''],
                buffCDs: [
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    },
                    {
                        Grenade: 3,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    }
                ]
            }
        };
        expectMove(uiBefore, uiAfter, true, false);
    });
    it("AI P1 attacks with spray bullets", function () {
        uiBefore = {
            endMatchScores: null,
            turnIndex: 0,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ]
                ],
                delta: null,
                gameOver: false,
                turnCounts: [3, 3],
                currentBuffs: ['', ''],
                buffCDs: [
                    {
                        Grenade: 3,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    },
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    }
                ]
            }
        };
        uiAfter = {
            endMatchScores: [1, 0],
            turnIndex: -1,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'D',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'D',],
                    ]
                ],
                delta: {
                    row: 5,
                    col: 4,
                    moveType: 'attack',
                    attackType: 'S'
                },
                gameOver: true,
                turnCounts: [4, 3],
                currentBuffs: ['', ''],
                buffCDs: [
                    {
                        Grenade: 2,
                        SprayBullets: 4,
                        AirStrike: 0,
                        Fortify: 0
                    },
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    }
                ]
            }
        };
        expectMove(uiBefore, uiAfter, true, false);
    });
    it("AI P2 attacks with spray bullets", function () {
        uiBefore = {
            endMatchScores: null,
            turnIndex: 1,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ]
                ],
                delta: null,
                gameOver: false,
                turnCounts: [4, 3],
                currentBuffs: ['', ''],
                buffCDs: [
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    },
                    {
                        Grenade: 3,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    }
                ]
            }
        };
        uiAfter = {
            endMatchScores: [0, 1],
            turnIndex: -1,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'D',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'D',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ]
                ],
                delta: {
                    row: 5,
                    col: 4,
                    moveType: 'attack',
                    attackType: 'S'
                },
                gameOver: true,
                turnCounts: [4, 4],
                currentBuffs: ['', ''],
                buffCDs: [
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    },
                    {
                        Grenade: 2,
                        SprayBullets: 4,
                        AirStrike: 0,
                        Fortify: 0
                    }
                ]
            }
        };
        expectMove(uiBefore, uiAfter, true, false);
    });
    it("AI P1 attacks with air strike", function () {
        uiBefore = {
            endMatchScores: null,
            turnIndex: 0,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ]
                ],
                delta: null,
                gameOver: false,
                turnCounts: [3, 3],
                currentBuffs: ['', ''],
                buffCDs: [
                    {
                        Grenade: 2,
                        SprayBullets: 4,
                        AirStrike: 0,
                        Fortify: 0
                    },
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    }
                ]
            }
        };
        uiAfter = {
            endMatchScores: [1, 0],
            turnIndex: -1,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'D',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'D',],
                    ]
                ],
                delta: {
                    row: 5,
                    col: 4,
                    moveType: 'attack',
                    attackType: 'A'
                },
                gameOver: true,
                turnCounts: [4, 3],
                currentBuffs: ['', ''],
                buffCDs: [
                    {
                        Grenade: 1,
                        SprayBullets: 3,
                        AirStrike: 5,
                        Fortify: 0
                    },
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    }
                ]
            }
        };
        expectMove(uiBefore, uiAfter, true, false);
    });
    it("AI P2 attacks with air strike", function () {
        uiBefore = {
            endMatchScores: null,
            turnIndex: 1,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ]
                ],
                delta: null,
                gameOver: false,
                turnCounts: [4, 3],
                currentBuffs: ['', ''],
                buffCDs: [
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    },
                    {
                        Grenade: 2,
                        SprayBullets: 4,
                        AirStrike: 0,
                        Fortify: 0
                    }
                ]
            }
        };
        uiAfter = {
            endMatchScores: [0, 1],
            turnIndex: -1,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'D',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'D',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ]
                ],
                delta: {
                    row: 5,
                    col: 4,
                    moveType: 'attack',
                    attackType: 'A'
                },
                gameOver: true,
                turnCounts: [4, 4],
                currentBuffs: ['', ''],
                buffCDs: [
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    },
                    {
                        Grenade: 1,
                        SprayBullets: 3,
                        AirStrike: 5,
                        Fortify: 0
                    }
                ]
            }
        };
        expectMove(uiBefore, uiAfter, true, false);
    });
    it("AI P1 attacks with fortify", function () {
        uiBefore = {
            endMatchScores: null,
            turnIndex: 0,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ]
                ],
                delta: null,
                gameOver: false,
                turnCounts: [3, 3],
                currentBuffs: ['', ''],
                buffCDs: [
                    {
                        Grenade: 1,
                        SprayBullets: 1,
                        AirStrike: 1,
                        Fortify: 0
                    },
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    }
                ]
            }
        };
        uiAfter = {
            endMatchScores: [1, 0],
            turnIndex: -1,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'D',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'D',],
                    ]
                ],
                delta: {
                    row: 5,
                    col: 4,
                    moveType: 'attack',
                    attackType: 'F'
                },
                gameOver: true,
                turnCounts: [4, 3],
                currentBuffs: ['F', ''],
                buffCDs: [
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 5
                    },
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    }
                ]
            }
        };
        expectMove(uiBefore, uiAfter, true, false);
    });
    it("AI P2 attacks with fortify", function () {
        uiBefore = {
            endMatchScores: null,
            turnIndex: 1,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ]
                ],
                delta: null,
                gameOver: false,
                turnCounts: [4, 3],
                currentBuffs: ['', ''],
                buffCDs: [
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    },
                    {
                        Grenade: 1,
                        SprayBullets: 1,
                        AirStrike: 1,
                        Fortify: 0
                    }
                ]
            }
        };
        uiAfter = {
            endMatchScores: [0, 1],
            turnIndex: -1,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'D',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'D',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ]
                ],
                delta: {
                    row: 5,
                    col: 4,
                    moveType: 'attack',
                    attackType: 'F'
                },
                gameOver: true,
                turnCounts: [4, 4],
                currentBuffs: ['', 'F'],
                buffCDs: [
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    },
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 5
                    }
                ]
            }
        };
        expectMove(uiBefore, uiAfter, true, false);
    });
    it("AI P1 attacks, P2 has fortify", function () {
        uiBefore = {
            endMatchScores: null,
            turnIndex: 0,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ]
                ],
                delta: null,
                gameOver: false,
                turnCounts: [3, 3],
                currentBuffs: ['', 'F'],
                buffCDs: [
                    {
                        Grenade: 1,
                        SprayBullets: 1,
                        AirStrike: 0,
                        Fortify: 1
                    },
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    }
                ]
            }
        };
        uiAfter = {
            endMatchScores: null,
            turnIndex: 1,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ]
                ],
                delta: {
                    row: 5,
                    col: 4,
                    moveType: 'attack',
                    attackType: 'A'
                },
                gameOver: false,
                turnCounts: [4, 3],
                currentBuffs: ['', ''],
                buffCDs: [
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 5,
                        Fortify: 0
                    },
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    }
                ]
            }
        };
        expectMove(uiBefore, uiAfter, true, false);
    });
    it("AI P2 attacks, P1 has fortify", function () {
        uiBefore = {
            endMatchScores: null,
            turnIndex: 1,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ]
                ],
                delta: null,
                gameOver: false,
                turnCounts: [4, 3],
                currentBuffs: ['F', ''],
                buffCDs: [
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    },
                    {
                        Grenade: 1,
                        SprayBullets: 1,
                        AirStrike: 0,
                        Fortify: 1
                    }
                ]
            }
        };
        uiAfter = {
            endMatchScores: null,
            turnIndex: 0,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', '',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ]
                ],
                delta: {
                    row: 5,
                    col: 4,
                    moveType: 'attack',
                    attackType: 'A'
                },
                gameOver: false,
                turnCounts: [4, 4],
                currentBuffs: ['', ''],
                buffCDs: [
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    },
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 5,
                        Fortify: 0
                    }
                ]
            }
        };
        expectMove(uiBefore, uiAfter, true, false);
    });
    it("Initial state is null, create a state", function () {
        uiBefore = {
            endMatchScores: null,
            turnIndex: 0,
            state: null
        };
        uiAfter = aiService.generateComputerMove(uiBefore.state, uiBefore.turnIndex);
        if (uiAfter.endMatchScores !== null)
            throw new Error("endMatchScores should have been null!");
        if (uiAfter.turnIndex !== 1)
            throw new Error("turnIndex should have been 1!");
        if (uiAfter.state === null)
            throw new Error("state should have been created!");
    });
    it("No empty cell, should throw error", function () {
        uiBefore = {
            endMatchScores: null,
            turnIndex: 1,
            state: {
                board: [
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ],
                    [
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'B',],
                        ['B', 'B', 'B', 'B', 'P',],
                    ]
                ],
                delta: null,
                gameOver: false,
                turnCounts: [4, 3],
                currentBuffs: ['', ''],
                buffCDs: [
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    },
                    {
                        Grenade: 0,
                        SprayBullets: 0,
                        AirStrike: 0,
                        Fortify: 0
                    }
                ]
            }
        };
        uiAfter = aiService.generateComputerMove(uiBefore.state, uiBefore.turnIndex);
        if (uiAfter !== null)
            throw new Error("Move should have been null!");
    });
});
//# sourceMappingURL=aiService_test.js.map