;
var game;
(function (game) {
    game.$rootScope = null;
    game.$timeout = null;
    // Global variables are cleared when getting updateUI.
    // I export all variables to make it easy to debug in the browser by
    // simply typing in the console, e.g.,
    // game.currentUpdateUI
    game.currentUpdateUI = null;
    game.didMakeMove = false; // You can only make one move per updateUI
    game.animationEndedTimeout = null;
    game.state = null;
    // For community games.
    game.proposals = null;
    game.yourPlayerInfo = null;
    game.prev_turn_index = null;
    game.turn_index = null;
    game.audio_enabled = true;
    function init($rootScope_, $timeout_) {
        game.$rootScope = $rootScope_;
        game.$timeout = $timeout_;
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
    game.init = init;
    function registerServiceWorker() {
        // I prefer to use appCache over serviceWorker
        // (because iOS doesn't support serviceWorker, so we have to use appCache)
        // I've added this code for a future where all browsers support serviceWorker (so we can deprecate appCache!)
        if (!window.applicationCache && 'serviceWorker' in navigator) {
            var n = navigator;
            log.log('Calling serviceWorker.register');
            n.serviceWorker.register('service-worker.js').then(function (registration) {
                log.log('ServiceWorker registration successful with scope: ', registration.scope);
            }).catch(function (err) {
                log.log('ServiceWorker registration failed: ', err);
            });
        }
    }
    function getTranslations() {
        return {};
    }
    function communityUI(communityUI) {
        log.info("Game got communityUI:", communityUI);
        // If only proposals changed, then do NOT call updateUI. Then update proposals.
        var nextUpdateUI = {
            playersInfo: [],
            playMode: communityUI.yourPlayerIndex,
            numberOfPlayers: communityUI.numberOfPlayers,
            state: communityUI.state,
            turnIndex: communityUI.turnIndex,
            endMatchScores: communityUI.endMatchScores,
            yourPlayerIndex: communityUI.yourPlayerIndex,
        };
        if (angular.equals(game.yourPlayerInfo, communityUI.yourPlayerInfo) &&
            game.currentUpdateUI && angular.equals(game.currentUpdateUI, nextUpdateUI)) {
        }
        else {
            // Things changed, so call updateUI.
            updateUI(nextUpdateUI);
        }
        // This must be after calling updateUI, because we nullify things there (like playerIdToProposal&proposals&etc)
        game.yourPlayerInfo = communityUI.yourPlayerInfo;
        var playerIdToProposal = communityUI.playerIdToProposal;
        game.didMakeMove = !!playerIdToProposal[communityUI.yourPlayerInfo.playerId];
        game.proposals = [];
        for (var i = 0; i < gameLogic.ROWS; i++) {
            game.proposals[i] = [];
            for (var j = 0; j < gameLogic.COLS; j++) {
                game.proposals[i][j] = 0;
            }
        }
        for (var playerId in playerIdToProposal) {
            var proposal = playerIdToProposal[playerId];
            var delta = proposal.data;
            game.proposals[delta.row][delta.col]++;
        }
    }
    game.communityUI = communityUI;
    function isProposal(row, col) {
        return game.proposals && game.proposals[row][col] > 0;
    }
    game.isProposal = isProposal;
    function isProposal1(row, col) {
        return game.proposals && game.proposals[row][col] == 1;
    }
    game.isProposal1 = isProposal1;
    function isProposal2(row, col) {
        return game.proposals && game.proposals[row][col] == 2;
    }
    game.isProposal2 = isProposal2;
    function hasBuff() {
        if (yourPlayerIndex() !== 0 && yourPlayerIndex() !== 1)
            return '';
        return game.state.currentBuffs[yourPlayerIndex()];
    }
    game.hasBuff = hasBuff;
    function buffDescription(buffName) {
        if (game.state.currentBuffs[yourPlayerIndex()] === 'grenade') {
            return 'Your next attack will hit 3 windows!';
        }
        else if (game.state.currentBuffs[yourPlayerIndex()] === 'air strike') {
            return 'Your next attack will destroy all windows in the selected column!';
        }
        return '';
    }
    game.buffDescription = buffDescription;
    function isGrenade() {
        return (game.state.currentBuffs[yourPlayerIndex()] === 'grenade');
    }
    game.isGrenade = isGrenade;
    function isAirStrike() {
        return (game.state.currentBuffs[yourPlayerIndex()] === 'air strike');
    }
    game.isAirStrike = isAirStrike;
    game.gameWinner = null;
    function updateUI(params) {
        log.info("Game got updateUI:", params);
        game.didMakeMove = false; // Only one move per updateUI
        game.currentUpdateUI = params;
        clearAnimationTimeout();
        game.state = params.state;
        if (isFirstMove()) {
            game.state = gameLogic.getInitialState();
        }
        if (params.endMatchScores != null) {
            game.gameWinner = (params.endMatchScores[0] > params.endMatchScores[1]) ? 1 : 2;
        }
        else {
            game.gameWinner = null;
        }
        game.prev_turn_index = game.turn_index;
        game.turn_index = params.turnIndex;
        // if (!isMyTurn()) playAudio(state);
        playAudio(game.state);
        resetHighlights();
        updateButtonIcons();
        // We calculate the AI move only after the animation finishes,
        // because if we call aiService now
        // then the animation will be paused until the javascript finishes.
        game.animationEndedTimeout = game.$timeout(animationEndedCallback, 500);
    }
    game.updateUI = updateUI;
    function toggleAudio() {
        game.audio_enabled = !game.audio_enabled;
    }
    game.toggleAudio = toggleAudio;
    // Currently set to play audio every time updateUI is called
    function playAudio(state) {
        if (state.delta === null || !game.audio_enabled)
            return;
        var audio = new Audio();
        if (state.delta.moveType === 'attack') {
            // Attack-audio sounds
            if (state.delta.attackType === '' || state.delta.attackType === 'F') {
                audio = new Audio('audio/rifle.wav');
            }
            else if (state.delta.attackType === 'G') {
                audio = new Audio('audio/grenade.wav');
            }
            else if (state.delta.attackType === 'A') {
                audio = new Audio('audio/air_strike.wav');
            }
            else if (state.delta.attackType === 'S') {
                audio = new Audio('audio/rifle.wav');
            }
        }
        audio.play();
    }
    function animationEndedCallback() {
        log.info("Animation ended");
        maybeSendComputerMove();
    }
    function clearAnimationTimeout() {
        if (game.animationEndedTimeout) {
            game.$timeout.cancel(game.animationEndedTimeout);
            game.animationEndedTimeout = null;
        }
    }
    function maybeSendComputerMove() {
        if (!isComputerTurn())
            return;
        var move = aiService.generateComputerMove(game.state, game.currentUpdateUI.turnIndex);
        log.info("Computer move: ", move);
        makeMove(move);
    }
    function makeMove(move) {
        if (game.didMakeMove) {
            return;
        }
        game.didMakeMove = true;
        if (!game.proposals) {
            gameService.makeMove(move);
        }
        else {
            var delta = move.state.delta;
            var myProposal = {
                data: delta,
                chatDescription: '' + (delta.row + 1) + 'x' + (delta.col + 1),
                playerInfo: game.yourPlayerInfo,
            };
            // Decide whether we make a move or not (if we have 2 other proposals supporting the same thing).
            if (game.proposals[delta.row][delta.col] < 2) {
                move = null;
            }
            gameService.communityMove(myProposal, move);
        }
    }
    game.makeMove = makeMove;
    function isFirstMove() {
        return !game.currentUpdateUI.state;
    }
    function yourPlayerIndex() {
        return game.currentUpdateUI.yourPlayerIndex;
    }
    game.yourPlayerIndex = yourPlayerIndex;
    function isComputer() {
        var playerInfo = game.currentUpdateUI.playersInfo[game.currentUpdateUI.yourPlayerIndex];
        // In community games, playersInfo is [].
        return playerInfo && playerInfo.playerId === '';
    }
    function isComputerTurn() {
        return isMyTurn() && isComputer();
    }
    function isHumanTurn() {
        return isMyTurn() && !isComputer();
    }
    function isMyTurn() {
        return !game.didMakeMove &&
            game.currentUpdateUI.turnIndex >= 0 &&
            game.currentUpdateUI.yourPlayerIndex === game.currentUpdateUI.turnIndex; // it's my turn
    }
    game.isMyTurn = isMyTurn;
    game.theWinner = '';
    // USE THIS TO THROW UP A STATUS MESSAGE SHOWING YOUR ATTACK WAS CANCELLED OUT
    game.wasOpponentFortified = false;
    function cellClicked(row, col, moveType) {
        log.info("Clicked on cell:", row, col);
        if (!isHumanTurn())
            return;
        var nextMove = null;
        game.wasOpponentFortified = (game.state.currentBuffs[(1 - yourPlayerIndex())] === 'F');
        try {
            nextMove = gameLogic.createMove(game.state, row, col, moveType, game.currentUpdateUI.turnIndex);
        }
        catch (e) {
            log.info(e.message);
            return;
        }
        // Move is legal, make it!
        // playAudio(nextMove.state);
        makeMove(nextMove);
    }
    game.cellClicked = cellClicked;
    function shouldShowImage(row, col) {
        return game.state.board[0][row][col] !== "" || isProposal(row, col);
    }
    game.shouldShowImage = shouldShowImage;
    function isPiece(board, row, col, pieceKind) {
        var board_number = (board + yourPlayerIndex());
        if (yourPlayerIndex() === -2)
            return;
        if (game.currentUpdateUI.playMode === 'playAgainstTheComputer')
            board_number = board;
        if (yourPlayerIndex() === -1) {
            if (game.gameWinner != null)
                board_number = (board + game.gameWinner - 1);
            else
                return;
        }
        return game.state.board[board_number][row][col] === pieceKind;
    }
    function isPos(board, row, col) {
        return isPiece(board, row, col, 'P');
    }
    game.isPos = isPos;
    function isBroken(board, row, col) {
        return isPiece(board, row, col, 'B');
    }
    game.isBroken = isBroken;
    function isBlank(board, row, col) {
        return isPiece(board, row, col, '');
    }
    game.isBlank = isBlank;
    function isDead(board, row, col) {
        return isPiece(board, row, col, 'D');
    }
    game.isDead = isDead;
    function isBuff(board, row, col) {
        if (isPiece(board, row, col, 'grenade'))
            return true;
        else if (isPiece(board, row, col, 'air strike'))
            return true;
        else
            return false;
    }
    game.isBuff = isBuff;
    function firstMove() {
        if (yourPlayerIndex() !== 0 && yourPlayerIndex() !== 1)
            return;
        return (game.state.turnCounts[yourPlayerIndex()] == 0);
    }
    game.firstMove = firstMove;
    function shouldSlowlyAppear(row, col) {
        return game.state.delta &&
            game.state.delta.row === row && game.state.delta.col === col;
    }
    game.shouldSlowlyAppear = shouldSlowlyAppear;
    function isP1() {
        if (game.currentUpdateUI.playMode === 'playAgainstTheComputer')
            return true;
        else if ((yourPlayerIndex() !== 0) && (yourPlayerIndex() !== 1) &&
            isGameOver() && (game.gameWinner === 1))
            return true;
        else
            return (yourPlayerIndex() === 0);
    }
    game.isP1 = isP1;
    function isP2() {
        if (game.currentUpdateUI.playMode === 'playAgainstTheComputer')
            return false;
        else if ((yourPlayerIndex() !== 0) && (yourPlayerIndex() !== 1) &&
            isGameOver() && (game.gameWinner === 2))
            return true;
        else
            return (yourPlayerIndex() === 1);
    }
    game.isP2 = isP2;
    function isGameOver() {
        return (game.currentUpdateUI.turnIndex === -1);
    }
    game.isGameOver = isGameOver;
    var buttonList = [
        'toggleGrenade',
        'toggleAirStrike',
        'toggleSprayBullets',
        'toggleFortify'
    ];
    function buttonPreCheck() {
        if (yourPlayerIndex() !== 0 && yourPlayerIndex() !== 1)
            return false;
        else if (document.getElementById('attackBoard') === null)
            return false;
        else if (game.state.buffCDs === null)
            return false;
        else
            return true;
    }
    function updateButtonIcons() {
        if (!buttonPreCheck())
            return;
        for (var i = 0; i < buttonList.length; i++) {
            var thisEle = document.getElementById(buttonList[i]);
            var buffCSSClass = buttonList[i].replace('toggle', '');
            var buffID = buttonList[i].replace('toggle', '')[0];
            buffCSSClass = buffID.toLowerCase() + buffCSSClass.slice(1);
            var cdRemaining = gameLogic.checkCD(buffID, game.state.buffCDs, yourPlayerIndex());
            if (cdRemaining > 0) {
                thisEle.className = "btn btn-buff " + buffCSSClass + " t" + cdRemaining;
            }
            else {
                thisEle.className = "btn btn-buff " + buffCSSClass;
            }
        }
    }
    function resetHighlights() {
        if (!buttonPreCheck())
            return;
        for (var i = 0; i < buttonList.length; i++) {
            var thisEle = document.getElementById(buttonList[i]);
            thisEle.className = thisEle.className.replace(/(?:^|\s)highlighted(?!\S)/g, '');
        }
    }
    game.resetHighlights = resetHighlights;
    function toggleBuff(buttonID) {
        if (!buttonPreCheck())
            return;
        var elementToggled = document.getElementById(buttonID);
        var buffID = buttonID.replace('toggle', '')[0];
        var cdRemaining = gameLogic.checkCD(buffID, game.state.buffCDs, yourPlayerIndex());
        if (cdRemaining > 0)
            return;
        // BUTTON IS ON, TURN IT OFF
        if (elementToggled.className.match(/(?:^|\s)highlighted(?!\S)/)) {
            elementToggled.className = elementToggled.className.replace(/(?:^|\s)highlighted(?!\S)/g, '');
            game.state.currentBuffs[yourPlayerIndex()] = '';
        }
        else {
            // TURN OFF OTHER HIGHLIGHTS BEFORE HIGHLIGHTING THIS BUTTON
            resetHighlights();
            elementToggled.className += " highlighted";
            game.state.currentBuffs[yourPlayerIndex()] = buffID;
        }
    }
    game.toggleBuff = toggleBuff;
})(game || (game = {}));
// CONTROLLER
var app = angular.module('myApp', ['gameServices']);
app.run(['$rootScope', '$timeout',
    function ($rootScope, $timeout) {
        log.info("Started app");
        $rootScope['game'] = game;
        game.init($rootScope, $timeout);
    }]);
app.controller('MainController', ['$scope', '$rootScope', function ($scope, $rootScope) {
        // BOARD ATTRIBUTES //
        $scope.board_size = .8;
        $scope.is_attacking = true;
        $scope.is_moving = false;
        $scope.show_intro = false;
        $scope.show_buff_info = false;
        $scope.pressed_intro = function () {
            $scope.$apply(function () {
                $scope.show_buff_info = false;
                $scope.show_intro = true;
            });
        };
        $scope.pressed_buff = function () {
            $scope.$apply(function () {
                $scope.show_intro = false;
                $scope.show_buff_info = true;
            });
        };
        $scope.clear_hint = function () {
            $scope.$apply(function () {
                $scope.show_intro = false;
                $scope.show_buff_info = false;
            });
        };
        $scope.pressed_attack_button = function () {
            if (game.firstMove() && !game.isGameOver())
                return;
            $scope.$apply(function () {
                $scope.is_attacking = true;
                $scope.is_moving = false;
            });
        };
        $scope.pressed_move_button = function () {
            $scope.$apply(function () {
                $scope.is_moving = true;
                $scope.is_attacking = false;
            });
        };
        // ROWS //
        var rows_as_list = [];
        for (var i = 0; i < gameLogic.ROWS; i++) {
            rows_as_list[i] = i;
        }
        $scope.num_rows_as_list = rows_as_list;
        $scope.num_rows = gameLogic.ROWS;
        $scope.row_size = (100 / (gameLogic.ROWS + 1));
        // COLUMNS //
        var cols_as_list = [];
        for (var i = 0; i < gameLogic.COLS; i++) {
            cols_as_list[i] = i;
        }
        $scope.num_cols_as_list = cols_as_list;
        $scope.num_cols = gameLogic.COLS;
        $scope.col_size = (100 / gameLogic.COLS);
        // CONTROLS ATTRIBUTES //
        $scope.controls_size = (1.0 - $scope.board_size);
        $scope.controls_top_pos = (($scope.board_size * 100));
    }]);
//# sourceMappingURL=game.js.map