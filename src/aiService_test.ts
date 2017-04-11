describe("aiService_test", function() {
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

  function expectMove(uiBeforeMove: IMove, uiAfterMove: IMove, expectedOutcome: boolean, troubleshooting: boolean): void {      
      let aiMove = aiService.generateComputerMove(uiBeforeMove.state, uiBeforeMove.turnIndex);
      if (troubleshooting) troubleshoot(aiMove);
      expect(angular.equals(aiMove, uiAfterMove)).toBe(expectedOutcome);
  }

  it("AI P1 attacks with no buff", function() {
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
              turnCounts: [3,3],
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
          endMatchScores: [1,0],
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
                  attackType: '',
                  cellsHit: [[5,4]]
              },
              gameOver: true,
              turnCounts: [4,3],
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

  it("AI P2 attacks with no buff", function() {
      uiBefore = {
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
              turnCounts: [4,3],
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
          endMatchScores: [0,1],
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
                          ['B','B','B','B','',],
                      ],
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
                          ['B','B','B','B','D',],
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
                  col: 4, 
                  moveType: 'attack', 
                  attackType: '',
                  cellsHit: [[5,4]]
              },
              gameOver: true,
              turnCounts: [4,4],
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

  it("AI P1 attacks with grenade", function() {
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
      uiAfter = {
          endMatchScores: [1,0],
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
                  attackType: 'G',
                  cellsHit: [[5, 3], [5,4]]
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

  it("AI P2 attacks with grenade", function() {
      uiBefore = {
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
              turnCounts: [4,3],
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
          endMatchScores: [0,1],
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
                          ['B','B','B','B','',],
                      ],
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
                          ['B','B','B','B','D',],
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
                  col: 4, 
                  moveType: 'attack', 
                  attackType: 'G',
                  cellsHit: [[5,3], [5,4]]
              },
              gameOver: true,
              turnCounts: [4,4],
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

  it("AI P1 attacks with spray bullets", function() {
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
              turnCounts: [3,3],
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
      uiAfter = aiService.generateComputerMove(uiBefore.state, uiBefore.turnIndex);
      // if (uiAfter.endMatchScores !== [1,0]) throw new Error("endMatchScores Game should be over!");
      // if (uiAfter.turnIndex !== -1) throw new Error("turnIndex Game should be over!");
      // if (uiAfter.state.board[0][5][4] !== 'D') throw new Error("board Game should be over!");
      // if (uiAfter.state.board[3][5][4] !== 'D') throw new Error("board Game should be over!");
      // if (uiAfter.state.delta.row !== 5) throw new Error("row Game should be over!");
      // if (uiAfter.state.delta.col !== 4) throw new Error("col Game should be over!");
      // if (uiAfter.state.delta.moveType !== 'attack') throw new Error("moveType Game should be over!");
      // if (uiAfter.state.delta.attackType !== 'S') throw new Error("attackType Game should be over!");
      // if (uiAfter.state.gameOver !== true) throw new Error("gameOver Game should be over!");
      // if (uiAfter.state.turnCounts !== [4,3]) throw new Error("turnCounts Game should be over!");
      // if (uiAfter.state.currentBuffs !== ['','']) throw new Error("currentBuffs Game should be over!");
      // if (uiAfter.state.buffCDs[0].Grenade !== 2) throw new Error("Game should be over!");
      // if (uiAfter.state.buffCDs[0].SprayBullets !== 4) throw new Error("Game should be over!");
      // if (uiAfter.state.buffCDs[0].AirStrike !== 0) throw new Error("Game should be over!");
      // if (uiAfter.state.buffCDs[0].Fortify !== 0) throw new Error("Game should be over!");
      // if (uiAfter.state.buffCDs[1].Grenade !== 0) throw new Error("Game should be over!");
      // if (uiAfter.state.buffCDs[1].SprayBullets !== 0) throw new Error("Game should be over!");
      // if (uiAfter.state.buffCDs[1].AirStrike !== 0) throw new Error("Game should be over!");
      // if (uiAfter.state.buffCDs[1].Fortify !== 0) throw new Error("Game should be over!");
      
  });

  it("AI P2 attacks with spray bullets", function() {
      uiBefore = {
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
              turnCounts: [4,3],
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
      uiAfter = aiService.generateComputerMove(uiBefore.state, uiBefore.turnIndex);
  });

  it("AI P1 attacks with air strike", function() {
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
              turnCounts: [3,3],
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
          endMatchScores: [1,0],
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
                  attackType: 'A',
                  cellsHit: [[0,4], [1,4], [2,4], [3,4], [4,4], [5,4]]
              },
              gameOver: true,
              turnCounts: [4,3],
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

  it("AI P2 attacks with air strike", function() {
      uiBefore = {
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
              turnCounts: [4,3],
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
          endMatchScores: [0,1],
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
                          ['B','B','B','B','',],
                      ],
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
                          ['B','B','B','B','D',],
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
                  col: 4, 
                  moveType: 'attack', 
                  attackType: 'A',
                  cellsHit: [[0,4], [1,4], [2,4], [3,4], [4,4], [5,4]]
              },
              gameOver: true,
              turnCounts: [4,4],
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

  it("AI P1 attacks with fortify", function() {
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
              turnCounts: [3,3],
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
          endMatchScores: [1,0],
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
                  attackType: 'F',
                  cellsHit: [[5,4]]
              },
              gameOver: true,
              turnCounts: [4,3],
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

  it("AI P2 attacks with fortify", function() {
      uiBefore = {
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
              turnCounts: [4,3],
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
          endMatchScores: [0,1],
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
                          ['B','B','B','B','',],
                      ],
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
                          ['B','B','B','B','D',],
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
                  col: 4, 
                  moveType: 'attack', 
                  attackType: 'F',
                  cellsHit: [[5,4]] 
              },
              gameOver: true,
              turnCounts: [4,4],
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

  it("AI P1 attacks, P2 has fortify", function() {
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
              turnCounts: [3,3],
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
              delta: {
                  row: 5, 
                  col: 4, 
                  moveType: 'attack', 
                  attackType: 'A',
                  cellsHit: [[5,4]]
              },
              gameOver: false,
              turnCounts: [4,3],
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

  it("AI P2 attacks, P1 has fortify", function() {
      uiBefore = {
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
              turnCounts: [4,3],
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
              delta: {
                  row: 5, 
                  col: 4, 
                  moveType: 'attack', 
                  attackType: 'A',
                  cellsHit: [[5,4]]
              },
              gameOver: false,
              turnCounts: [4,4],
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

  it("Initial state is null, create a state", function() {
      uiBefore = {
          endMatchScores: null,
          turnIndex: 0,          
          state: null
      };
      uiAfter = aiService.generateComputerMove(uiBefore.state, uiBefore.turnIndex);
      if (uiAfter.endMatchScores !== null) throw new Error("endMatchScores should have been null!");
      if (uiAfter.turnIndex !== 1) throw new Error("turnIndex should have been 1!");
      if (uiAfter.state === null) throw new Error("state should have been created!");   
  });

  it("No empty cell, should throw error", function() {
      uiBefore = {
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
              turnCounts: [4,3],
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
      if (uiAfter !== null) throw new Error("Move should have been null!");
  });
});
