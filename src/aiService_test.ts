

describe("aiService", function() {
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

  function expectException(uiBeforeMove: IMove): void {
      let aiMove = aiService.generateComputerMove(uiBeforeMove.state, uiBeforeMove.turnIndex);
      if (aiMove !== null) throw new Error("generateComputerMove should have returned null!");
  }

  function expectMove(uiBeforeMove: IMove, uiAfterMove: IMove, expectedOutcome: boolean, troubleshooting: boolean): void {      
      let aiMove = aiService.generateComputerMove(uiBeforeMove.state, uiBeforeMove.turnIndex);
      if (troubleshooting) troubleshoot(aiMove);
      expect(angular.equals(aiMove, uiAfterMove)).toBe(expectedOutcome);
  }

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
                  attackType: 'G' 
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
      expectMove(uiBefore, uiAfter, true, true);
  });
});
