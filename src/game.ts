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
  export let prev_turn_index: number = null;
  export let turn_index: number = null;

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

  export function isABuff(cellValue: string): boolean {
    return gameLogic.isABuff(cellValue);
  }

  export function hasBuff(): string {
    if (yourPlayerIndex() === -1) return '';
    return state.currentBuffs[yourPlayerIndex()];
  }

  export function buffDescription(buffName: string): string {
    if (state.currentBuffs[yourPlayerIndex()] === 'grenade') {
      return 'Your next attack will hit 3 windows!';
    }
    else if (state.currentBuffs[yourPlayerIndex()] === 'air strike') {
      return 'Your next attack will destroy all windows in the selected column!';
    }
    return '';
  }

  export function isGrenade(): boolean {
  	return (state.currentBuffs[yourPlayerIndex()] === 'grenade');
  }

  export function isAirStrike(): boolean {
  	return (state.currentBuffs[yourPlayerIndex()] === 'air strike');
  }
  
  export let gameWinner: number = null;

  export function updateUI(params: IUpdateUI): void {

    log.info("Game got updateUI:", params);
    didMakeMove = false; // Only one move per updateUI
    currentUpdateUI = params;
    clearAnimationTimeout();
    state = params.state;
    playAudio();
    
    if (isFirstMove()) {
      state = gameLogic.getInitialState();
    }
    if (params.endMatchScores != null) {
      gameWinner = (params.endMatchScores[0] > params.endMatchScores[1]) ? 1 : 2;
    } else {
      gameWinner = null;
    }
    prev_turn_index = turn_index;
    turn_index = params.turnIndex;

    // We calculate the AI move only after the animation finishes,
    // because if we call aiService now
    // then the animation will be paused until the javascript finishes.
    animationEndedTimeout = $timeout(animationEndedCallback, 500);
  }

  // Currently set to play audio every time updateUI is called
  function playAudio() {
    if (state === null || state.delta === null) return;
    
    var audio = new Audio();
    if (state.delta.moveType === 'attack') {        
      // Attack-audio sounds
      if (state.delta.attackType === '') {
        audio = new Audio('audio/rifle.wav');
      }
      else if (state.delta.attackType === 'grenade') {
        audio = new Audio('audio/grenade.wav');
      }
      else if (state.delta.attackType === 'air strike') {
        audio = new Audio('audio/air_strike.wav');
      }
    }
    audio.play();
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
    let move = aiService.generateComputerMove(currentUpdateUI.state, currentUpdateUI.turnIndex);
    log.info("Computer move: ", move);
    makeMove(move);
  }

  export function makeMove(move: IMove) {
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
    let board_number: number = (board + yourPlayerIndex());
    if (currentUpdateUI.playMode === 'playAgainstTheComputer') board_number = board;
    if (yourPlayerIndex() === -1) {
      if (gameWinner != null) board_number = (board + gameWinner - 1);
      else return;
    }
    return state.board[board_number][row][col] === pieceKind;
  }

  export function isPos(board: number, row: number, col: number): boolean {
    return isPiece(board, row, col, 'P');
  }
  
  export function isBroken(board: number, row: number, col: number): boolean {
    return isPiece(board, row, col, 'B');
  }

  export function isBlank(board: number, row: number, col: number): boolean {
    return isPiece(board, row, col, ''); 
  }

  export function isDead(board: number, row: number, col: number): boolean {
    return isPiece(board, row, col, 'D');
  }

  export function isBuff(board: number, row: number, col: number): boolean {
    if (isPiece(board, row, col, 'grenade')) return true;
    else if (isPiece(board, row, col, 'air strike')) return true;
    else return false;
  }

  export function firstMove(): boolean {
  	if (yourPlayerIndex() !== 0 && yourPlayerIndex() !== 1) return;
    return (state.turnCounts[yourPlayerIndex()] == 0);
  }

  export function shouldSlowlyAppear(row: number, col: number): boolean {
    return state.delta &&
        state.delta.row === row && state.delta.col === col;
  }

  export function isP1(): boolean {
    if (currentUpdateUI.playMode === 'playAgainstTheComputer') return true;
    else if ((yourPlayerIndex() !== 0) && (yourPlayerIndex() !== 1) &&
        isGameOver() && (gameWinner === 1)) return true;
    else return (yourPlayerIndex() === 0);
  }

  export function isP2(): boolean {
    if (currentUpdateUI.playMode === 'playAgainstTheComputer') return false;
    else if ((yourPlayerIndex() !== 0) && (yourPlayerIndex() !== 1) &&
        isGameOver() && (gameWinner === 2)) return true;
    else return (yourPlayerIndex() === 1);
  }

  export function isGameOver(): boolean {
    return (currentUpdateUI.turnIndex === -1);
  }

  export function toggleBuff(buttonID: string): void {
    let buttonList: string[] = [
        'toggleGrenade', 
        'toggleAirStrike',
        'toggleBulletSpray',
        'toggleReinforceWindows'
    ];

    let elementToggled = document.getElementById(buttonID);

    // BUTTON IS ON, TURN IT OFF
    if (elementToggled.className.match(/(?:^|\s)highlighted(?!\S)/)) {
      elementToggled.className = elementToggled.className.replace(/(?:^|\s)highlighted(?!\S)/g, '');
    }
    // BUTTON IS NOT ON, TURN IT ON
    else {
      // TURN OFF OTHER HIGHLIGHTS BEFORE HIGHLIGHTING THIS BUTTON
      for (let i = 0; i < buttonList.length; i++) {
        let thisEle = document.getElementById(buttonList[i]);
        thisEle.className = thisEle.className.replace(/(?:^|\s)highlighted(?!\S)/g, '');
      }
      elementToggled.className += " highlighted";
    }
  }
}

// CONTROLLER
var app = angular.module('myApp', ['gameServices']);
app.run(['$rootScope', '$timeout',
    function ($rootScope: angular.IScope, $timeout: angular.ITimeoutService) {
      log.info("Started app");
      $rootScope['game'] = game;
      game.init($rootScope, $timeout);
    }]);
app.controller('MainController', ['$scope', '$rootScope', function($scope: any, $rootScope: any) {

  // BOARD ATTRIBUTES //

  $scope.board_size = .8;
  $scope.is_attacking = false;
  $scope.is_moving = true;
  $scope.show_intro = false;
  $scope.show_buff_info = false;

  $scope.pressed_intro = function() {
    $scope.$apply(function() {
      $scope.show_buff_info = false;
      $scope.show_intro = true;
    });
  };

  $scope.pressed_buff = function() {
    $scope.$apply(function() {
      $scope.show_intro = false;
      $scope.show_buff_info = true;
    });
  };

  $scope.clear_hint = function() {
    $scope.$apply(function() {
      $scope.show_intro = false;
      $scope.show_buff_info = false;
    });
  };

  $scope.pressed_attack_button = function() {
    if (game.firstMove() && !game.isGameOver()) return;
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