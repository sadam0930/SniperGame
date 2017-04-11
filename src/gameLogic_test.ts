describe("gameLogic_test", function() {

	let uiBefore: IMove = { endMatchScores: null, turnIndex: null, state: null };
  	let uiAfter: IMove = { endMatchScores: null, turnIndex: null, state: null };

    function troubleshoot(move: IMove): void {   
	    console.log(move.endMatchScores);
	    console.log(move.turnIndex);
	    for (let i = 0; i < 4; i++) {
	        for (let j = 0; j < gameLogic.ROWS; j++) {
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

    function expectError(uiBeforeMove: IMove, row: number, col: number, moveType: string, troubleshooting: boolean): void {
    	let threwException: boolean = false;
    	try {
    		let move = gameLogic.createMove(uiBeforeMove.state, row, col, moveType, uiBeforeMove.turnIndex);
    	}
    	catch (e) {
    		threwException = true;
    	}
    	if (!threwException) throw new Error("Failed to produce an illegal move!");
    }

  	function expectMove(uiBeforeMove: IMove, uiAfterMove: IMove, expectedOutcome: boolean, troubleshooting: boolean): void {      
      	let move = gameLogic.createMove(uiBeforeMove.state, uiAfterMove.state.delta.row, 
      				uiAfterMove.state.delta.col, uiAfterMove.state.delta.moveType, uiBeforeMove.turnIndex);
	    if (troubleshooting) troubleshoot(move);
	    expect(angular.equals(move, uiAfterMove)).toBe(expectedOutcome);
    }

	it("P1 attacks with grenade", function() {
	    uiBefore = {
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
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','P','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','P','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ]
	                ],
	            delta: null,
	            gameOver: false,
	            turnCounts: [3,3],
	            currentBuffs: ['G', ''],
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
	        endMatchScores: null,
	        turnIndex: 1,          
	        state: {
	            board: 
	                [
	                    [
	                        ['','','','','',],
	                        ['','B','B','B','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','P','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','','','',],
	                        ['','B','B','B','',],
	                        ['','','P','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ]
	                ],
	            delta: {
	                row: 1, 
	                col: 2, 
	                moveType: 'attack', 
	                attackType: 'G',
	                cellsHit: [[1,1], [1,2], [1,3]]
	            },
	            gameOver: false,
	            turnCounts: [4,3],
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

	it("P1 kills P2 with left-grenade-hit", function() {
	    uiBefore = {
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
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','P','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','P','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ]
	                ],
	            delta: null,
	            gameOver: false,
	            turnCounts: [3,3],
	            currentBuffs: ['G', ''],
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
	        endMatchScores: [1,0],
	        turnIndex: -1,          
	        state: {
	            board: 
	                [
	                    [
	                        ['','','D','B','B',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','P','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','D','B','B',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ]
	                ],
	            delta: {
	                row: 0, 
	                col: 3, 
	                moveType: 'attack', 
	                attackType: 'G',
	                cellsHit: [[0,2], [0,3], [0,4]]
	            },
	            gameOver: true,
	            turnCounts: [4,3],
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

	it("P1 kills P2 with right-grenade-hit", function() {
	    uiBefore = {
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
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','P','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','P','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ]
	                ],
	            delta: null,
	            gameOver: false,
	            turnCounts: [3,3],
	            currentBuffs: ['G', ''],
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
	        endMatchScores: [1,0],
	        turnIndex: -1,          
	        state: {
	            board: 
	                [
	                    [
	                        ['B','B','D','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','P','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['B','B','D','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ]
	                ],
	            delta: {
	                row: 0, 
	                col: 1, 
	                moveType: 'attack', 
	                attackType: 'G',
	                cellsHit: [[0,0], [0,1], [0,2]] 
	            },
	            gameOver: true,
	            turnCounts: [4,3],
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

	it("createMove called with state === null", function() {
		let threwException: boolean = false;
    	try {
    		gameLogic.createMove(null, 0, 0, "attack", 0);
    	}
    	catch (e) {
    		threwException = true;
    	}
    	if (threwException) throw new Error("gameLogic.createMove() failed to create a state!");
	});

	it("Attempt to move out of bounds", function() {
	    uiBefore = {
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
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','P','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','P','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ]
	                ],
	            delta: null,
	            gameOver: false,
	            turnCounts: [3,3],
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
	    expectError(uiBefore, 10, 10, 'move', false);
	});
	// THERE IS NO MOVE!
	//
	// it("Attempt to move to non-empty position", function() {
	//     uiBefore = {
	//         endMatchScores: null,
	//         turnIndex: 0,          
	//         state: {
	//             board: 
	//                 [
	//                     [
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                     ],
	//                     [
	//                         ['B','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                     ],
	//                     [
	//                         ['B','','P','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                     ],
	//                     [
	//                         ['','','P','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                     ]
	//                 ],
	//             delta: null,
	//             gameOver: false,
	//             turnCounts: [3,3],
	//             currentBuffs: ['', ''],
	//             buffCDs: [
	//                 {
	//                     Grenade: 0,
	//                     SprayBullets: 0,
	//                     AirStrike: 0,
	//                     Fortify: 0
	//                 },
	//                 {
	//                     Grenade: 0,
	//                     SprayBullets: 0,
	//                     AirStrike: 0,
	//                     Fortify: 0
	//                 }
	//             ]
	//         }
	//     };
	//     expectError(uiBefore, 0, 0, 'move', false);
	// });

	it("Attempt to attack after game is over", function() {
	    uiBefore = {
	        endMatchScores: [1,0],
	        turnIndex: 0,          
	        state: {
	            board: 
	                [
	                    [
	                        ['','','D','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','P','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','D','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ]
	                ],
	            delta: null,
	            gameOver: true,
	            turnCounts: [3,3],
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
	    expectError(uiBefore, 0, 0, 'attack', false);
	});

	

	// it("Attempt to attack on first move", function() {
	//     uiBefore = {
	//         endMatchScores: null,
	//         turnIndex: 0,          
	//         state: {
	//             board: 
	//                 [
	//                     [
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                     ],
	//                     [
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                     ],
	//                     [
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                     ],
	//                     [
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                         ['','','','','',],
	//                     ]
	//                 ],
	//             delta: null,
	//             gameOver: false,
	//             turnCounts: [0,0],
	//             currentBuffs: ['', ''],
	//             buffCDs: [
	//                 {
	//                     Grenade: 0,
	//                     SprayBullets: 0,
	//                     AirStrike: 0,
	//                     Fortify: 0
	//                 },
	//                 {
	//                     Grenade: 0,
	//                     SprayBullets: 0,
	//                     AirStrike: 0,
	//                     Fortify: 0
	//                 }
	//             ]
	//         }
	//     };
	//     expectError(uiBefore, 0, 0, 'attack', false);
	// });

	it("Attempt to use a CD when it's not ready", function() {
	    uiBefore = {
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
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','P','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','P','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ]
	                ],
	            delta: null,
	            gameOver: false,
	            turnCounts: [3,3],
	            currentBuffs: ['G', ''],
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
	        endMatchScores: null,
	        turnIndex: 1,          
	        state: {
	            board: 
	                [
	                    [
	                        ['','','B','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','P','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ],
	                    [
	                        ['','','B','','',],
	                        ['','','','','',],
	                        ['','','P','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                        ['','','','','',],
	                    ]
	                ],
	            delta: {
	                row: 0, 
	                col: 2, 
	                moveType: 'attack', 
	                attackType: '',
	                cellsHit: [[0,2]]
	            },
	            gameOver: false,
	            turnCounts: [4,3],
	            currentBuffs: ['', ''],
	            buffCDs: [
	                {
	                    Grenade: 2,
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


	it("gameLogic.createInitialMove() test", function() {
		let move: IMove = gameLogic.createInitialMove();
		if (move === null) throw new Error("Move should not be null!");
		if (move.endMatchScores !== null) throw new Error("endMatchScores should be null!");
		if (move.turnIndex !== 0) throw new Error("turnIndex should be 0!");
		if (move.state === null) throw new Error("State should not be null!");
	});

	it("gameLogic.forSimpleTestHtml() test", function() {
		let threwException: boolean = false;
    	try {
    		gameLogic.forSimpleTestHtml();
    	}
    	catch (e) {
    		threwException = true;
    	}
    	if (threwException) throw new Error("gameLogic.forSimpleTestHtml() threw an error!");
	});

});
