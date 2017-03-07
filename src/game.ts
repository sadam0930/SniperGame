interface SupportedLanguages {
  en: string, iw: string,
  pt: string, zh: string,
  el: string, fr: string,
  hi: string, es: string,
};

module game {
  export let $rootScope: angular.IScope = null;
  export let $timeout: angular.ITimeoutService = null;

  // Global variables are cleared when getting updateUI.
  // I export all variables to make it easy to debug in the browser by
  // simply typing in the console, e.g.,
  // game.currentUpdateUI
  export let currentUpdateUI: IUpdateUI = null;
  export let didMakeMove: boolean = false; // You can only make one move per updateUI
  export let animationEndedTimeout: ng.IPromise<any> = null;
  export let state: IState = null;
  // For community games.
  export let proposals: number[][] = null;
  export let yourPlayerInfo: IPlayerInfo = null;
  export let buffs_enabled: boolean = true;
  export let current_buff: string[] = [];

  export function init($rootScope_: angular.IScope, $timeout_: angular.ITimeoutService) {
    $rootScope = $rootScope_;
    $timeout = $timeout_;
    registerServiceWorker();
    translate.setTranslations(getTranslations());
    translate.setLanguage('en');
    resizeGameAreaService.setWidthToHeight(.7);
    gameService.setGame({
      updateUI: updateUI,
      communityUI: communityUI,
      getStateForOgImage: null,
    });
  }

  function registerServiceWorker() {
    // I prefer to use appCache over serviceWorker
    // (because iOS doesn't support serviceWorker, so we have to use appCache)
    // I've added this code for a future where all browsers support serviceWorker (so we can deprecate appCache!)
    if (!window.applicationCache && 'serviceWorker' in navigator) {
      let n: any = navigator;
      log.log('Calling serviceWorker.register');
      n.serviceWorker.register('service-worker.js').then(function(registration: any) {
        log.log('ServiceWorker registration successful with scope: ',    registration.scope);
      }).catch(function(err: any) {
        log.log('ServiceWorker registration failed: ', err);
      });
    }
  }

  function getTranslations(): Translations {
    return {};
  }

  export function communityUI(communityUI: ICommunityUI) {
    log.info("Game got communityUI:", communityUI);
    // If only proposals changed, then do NOT call updateUI. Then update proposals.
    let nextUpdateUI: IUpdateUI = {
        playersInfo: [],
        playMode: communityUI.yourPlayerIndex,
        numberOfPlayers: communityUI.numberOfPlayers,
        state: communityUI.state,
        turnIndex: communityUI.turnIndex,
        endMatchScores: communityUI.endMatchScores,
        yourPlayerIndex: communityUI.yourPlayerIndex,
      };
    if (angular.equals(yourPlayerInfo, communityUI.yourPlayerInfo) &&
        currentUpdateUI && angular.equals(currentUpdateUI, nextUpdateUI)) {
      // We're not calling updateUI to avoid disrupting the player if he's in the middle of a move.
    } else {
      // Things changed, so call updateUI.
      updateUI(nextUpdateUI);
    }
    // This must be after calling updateUI, because we nullify things there (like playerIdToProposal&proposals&etc)
    yourPlayerInfo = communityUI.yourPlayerInfo;
    let playerIdToProposal = communityUI.playerIdToProposal; 
    didMakeMove = !!playerIdToProposal[communityUI.yourPlayerInfo.playerId];
    proposals = [];
    for (let i = 0; i < gameLogic.ROWS; i++) {
      proposals[i] = [];
      for (let j = 0; j < gameLogic.COLS; j++) {
        proposals[i][j] = 0;
      }
    }
    for (let playerId in playerIdToProposal) {
      let proposal = playerIdToProposal[playerId];
      let delta = proposal.data;
      proposals[delta.row][delta.col]++;
    }
  }
  export function isProposal(row: number, col: number) {
    return proposals && proposals[row][col] > 0;
  } 
  export function isProposal1(row: number, col: number) {
    return proposals && proposals[row][col] == 1;
  } 
  export function isProposal2(row: number, col: number) {
    return proposals && proposals[row][col] == 2;
  }

  function spawnPowerUps(): void {
    if (yourPlayerIndex() === -1) return;
    let safe_guard_counter: number = 0;
    let buff_type_num: number  = gameLogic.getRandomIntInclusive(0);  
    let buff_type: string = '';

    if (buff_type_num == 0) buff_type = 'grenade';        // placeholder buff
    // else if (buff_type_num == 1) buff_type = 'Y';   // placeholder buff
    // else if (buff_type_num == 2) buff_type = 'X';   // placeholder buff
    else {
      log.info("spawnPowerUps() buff_type_num out of range.");
      return;
    }

    let move_board: number = (2 + yourPlayerIndex());    // move board where buff is visible
    let attack_board: number = (1 - yourPlayerIndex());  // attack board where buff is visible
    let buff_pos: number[] = gameLogic.getRandomPosition();

    while (!(isPiece(move_board, buff_pos[0], buff_pos[1], ''))) {
      let buff_pos: number[] = gameLogic.getRandomPosition();
      let found_free_pos: boolean = false;

      if (safe_guard_counter > 30) {                    // Brute force check for a free cell
        for (let i = 0; i < gameLogic.ROWS; i++) {
          for (let j = 0; j < gameLogic.COLS; j++) {
            if (isPiece(move_board, i, j, '')) {
              buff_pos[0] = i;
              buff_pos[1] = j;
              found_free_pos = true;
              break;
            }
          }
          if (found_free_pos) break;
        }

        if (!found_free_pos) {
          // Could force the buff to spawn on the player?
          game.buffs_enabled = false;                  
          return;
        }
      }

      if (found_free_pos) break;

      // Make this look for empty space instead of random if hits safeGuard number?
      safe_guard_counter += 1;
    }

    state.board[move_board][buff_pos[0]][buff_pos[1]] = buff_type;
    // state.board[attack_board][buff_pos[0]][buff_pos[1]] = buff_type;

  }

  export function isABuff(cellValue: string): boolean {
    if (cellValue === 'grenade') return true;
    else return false;
  }

  export function hasBuff(): string {
    return game.current_buff[yourPlayerIndex()];
  }

  export let gameWinner: number = null;

  export function updateUI(params: IUpdateUI): void {
    log.info("Game got updateUI:", params);
    didMakeMove = false; // Only one move per updateUI
    currentUpdateUI = params;
    clearAnimationTimeout();
    state = params.state;
    let my_turn_count: number = gameLogic.playerTurnCount[yourPlayerIndex()];

    if (isFirstMove()) {
      state = gameLogic.getInitialState();
    }
    if (params.endMatchScores != null) {
      game.gameWinner = (params.endMatchScores[0] > params.endMatchScores[1]) ? 1 : 2;
    }
    if ((my_turn_count > 0) && (my_turn_count % 2 == 0) && game.buffs_enabled) {
      spawnPowerUps();
    }
    
    // We calculate the AI move only after the animation finishes,
    // because if we call aiService now
    // then the animation will be paused until the javascript finishes.
    animationEndedTimeout = $timeout(animationEndedCallback, 500);
  }

  function animationEndedCallback() {
    log.info("Animation ended");
    maybeSendComputerMove();
  }

  function clearAnimationTimeout() {
    if (animationEndedTimeout) {
      $timeout.cancel(animationEndedTimeout);
      animationEndedTimeout = null;
    }
  }

  function maybeSendComputerMove() {
    if (!isComputerTurn()) return;
    let currentMove:IMove = {
      endMatchScores: currentUpdateUI.endMatchScores,
      state: currentUpdateUI.state,
      turnIndex: currentUpdateUI.turnIndex,
    }
    let move = aiService.findComputerMove(currentMove);
    log.info("Computer move: ", move);
    makeMove(move);
  }

  function makeMove(move: IMove) {
    if (didMakeMove) { // Only one move per updateUI
      return;
    }
    didMakeMove = true;
    
    if (!proposals) {
      gameService.makeMove(move);
    } else {
      let delta = move.state.delta;
      let myProposal:IProposal = {
        data: delta,
        chatDescription: '' + (delta.row + 1) + 'x' + (delta.col + 1),
        playerInfo: yourPlayerInfo,
      };
      // Decide whether we make a move or not (if we have 2 other proposals supporting the same thing).
      if (proposals[delta.row][delta.col] < 2) {
        move = null;
      }
      gameService.communityMove(myProposal, move);
    }
    gameLogic.playerTurnCount[yourPlayerIndex()] += 1;
  }

  function isFirstMove() {
    return !currentUpdateUI.state;
  }

  export function yourPlayerIndex() {
    return currentUpdateUI.yourPlayerIndex;
  }

  function isComputer() {
    let playerInfo = currentUpdateUI.playersInfo[currentUpdateUI.yourPlayerIndex];
    // In community games, playersInfo is [].
    return playerInfo && playerInfo.playerId === '';
  }

  function isComputerTurn() {
    return isMyTurn() && isComputer();
  }

  function isHumanTurn() {
    return isMyTurn() && !isComputer();
  }

  export function isMyTurn() {
    return !didMakeMove && // you can only make one move per updateUI.
      currentUpdateUI.turnIndex >= 0 && // game is ongoing
      currentUpdateUI.yourPlayerIndex === currentUpdateUI.turnIndex; // it's my turn
  }

  export let theWinner: string = '';

  export function cellClicked(row: number, col: number, moveType: string): void {
    log.info("Clicked on cell:", row, col);
    if (!isHumanTurn()) return;
    let nextMove: IMove = null;
    try {
      nextMove = gameLogic.createMove(
          state, row, col, moveType, currentUpdateUI.turnIndex);
    } catch (e) {
      log.info((<Error>e).message);
      return;
    }
    // Move is legal, make it!
    makeMove(nextMove);
  }

  export function shouldShowImage(row: number, col: number): boolean {
    return state.board[0][row][col] !== "" || isProposal(row, col);
  }

  function isPiece(board: number, row: number, col: number, pieceKind: string): boolean {
    return state.board[board][row][col] === pieceKind;
  }

  export function isPos(board: number, row: number, col: number): boolean {
    if (yourPlayerIndex() === -1) return;
    let board_number: number = (board + yourPlayerIndex());    
    return isPiece(board_number, row, col, 'P');

  }
  
  export function isBroken(board: number, row: number, col: number): boolean {
    if (yourPlayerIndex() === -1) return;
    let board_number: number = (board + yourPlayerIndex());    
    return isPiece(board_number, row, col, 'B');

  }

  export function isBlank(board: number, row: number, col: number): boolean {
    if (yourPlayerIndex() === -1) return;
    let board_number: number = (board + yourPlayerIndex());    
    return isPiece(board_number, row, col, '');
   
  }

  export function isDead(board: number, row: number, col: number): boolean {
    if (yourPlayerIndex() === -1) return;
    let board_number: number = (board + yourPlayerIndex());    
    return isPiece(board_number, row, col, 'D');
   
  }

  export function isBuff(board: number, row: number, col: number): boolean {
    if (yourPlayerIndex() === -1) return;
    let board_number: number = (board + yourPlayerIndex());    
    return isPiece(board_number, row, col, 'grenade');
   
  }

  export function firstMove(): boolean {
      return (gameLogic.playerTurnCount[yourPlayerIndex()] == 0);
  }

  export function shouldSlowlyAppear(row: number, col: number): boolean {
    return state.delta &&
        state.delta.row === row && state.delta.col === col;
  }

}

var app = angular.module('myApp', ['gameServices']);
app.run(['$rootScope', '$timeout',
    function ($rootScope: angular.IScope, $timeout: angular.ITimeoutService) {
      log.info("Started app");
      $rootScope['game'] = game;
      game.init($rootScope, $timeout);
    }]);
app.controller('MainController', ['$scope', '$rootScope', function($scope: any, $rootScope: any) {

                  // BOARD ATTRIBUTES //

  $scope.board_size = .75;
  $scope.is_attacking = false;
  $scope.is_moving = true;

  $scope.pressed_attack_button = function() {
    $scope.$apply(function() {
      $scope.is_attacking = true;
      $scope.is_moving = false;
    });
  };

  $scope.pressed_move_button = function() {
    $scope.$apply(function() {
      $scope.is_moving = true;
      $scope.is_attacking = false;
    });
  };
                  // ROWS //
  let rows_as_list: number[] = [];
  for (let i = 0; i < gameLogic.ROWS; i++) {
      rows_as_list[i] = i;
  }  
  $scope.num_rows_as_list = rows_as_list;
  $scope.num_rows = gameLogic.ROWS;
  $scope.row_size = (100 / (gameLogic.ROWS+1));

                  // COLUMNS //
  let cols_as_list: number[] = [];
  for (let i = 0; i < gameLogic.COLS; i++) {
      cols_as_list[i] = i;
  }  
  $scope.num_cols_as_list = cols_as_list;
  $scope.num_cols = gameLogic.COLS;
  $scope.col_size = (100 / gameLogic.COLS);

                  // CONTROLS ATTRIBUTES //
  $scope.controls_size = (1.0 - $scope.board_size);
  $scope.controls_top_pos = (($scope.board_size * 100));

}]);