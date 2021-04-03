var game;
var gameOptions = {
    tileSize: 200,
    tweenSpeed: 50,
    tileSpacing: 20
}
window.onload = function() {
    var gameConfig = {
       type: Phaser.CANVAS,
       width: gameOptions.tileSize * 4 + gameOptions.tileSpacing * 5,
       height: gameOptions.tileSize * 4 + gameOptions.tileSpacing * 5,
       backgroundColor: 0xecf0f1,
       scene: [playGame]
   };
    game = new Phaser.Game(gameConfig);
    window.focus()
    resize();
    window.addEventListener("resize", resize, false);
}

var playGame = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function playGame(){
        Phaser.Scene.call(this, {key: "PlayGame"});
    },
    preload: function(){
        // this.load.image("tile", "tile.png");
        this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
            frameWidth: gameOptions.tileSize,
            frameHeight: gameOptions.tileSize
        });
    },
    create: function(){
        this.score = 0
        this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, {color: '#000', fontSize: '20px'})
        this.result = this.add.text(200, 10, 'none', {color: '#000'})
        this.fieldArray = [];
        this.fieldGroup = this.add.group();
        for(var i = 0; i < 4; i++){
            this.fieldArray[i] = [];
            for(var j = 0; j < 4; j++){
                var two = this.add.sprite(this.tileDestination(j), this.tileDestination(i), "tiles");
                two.alpha = 0;
                two.visible = 0;
                this.fieldGroup.add(two);
                this.fieldArray[i][j] = {
                    tileValue: 0,
                    tileSprite: two,
                    canUpgrade: true
                }
            }
        }
        // for keyboard use
        this.input.keyboard.on("keydown", this.handleKey, this);
        // for touch use
        this.input.on("pointerup", this.endSwipe, this);

        this.canMove = false;
        this.addTwo();
        this.addTwo();
    },

    endSwipe: function(e){
        var swipeTime = e.upTime - e.downTime;
        var swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
        var swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
        var swipeNormal = new Phaser.Geom.Point(swipe.x / swipeMagnitude, swipe.y / swipeMagnitude);
        if(swipeMagnitude > 20 && swipeTime < 1000 && (Math.abs(swipeNormal.y) > 0.8 || Math.abs(swipeNormal.x) > 0.8)){
            if(swipeNormal.x > 0.8) {
                this.handleMove(0, 1);
            }
            if(swipeNormal.x < -0.8) {
                this.handleMove(0, -1);
            }
            if(swipeNormal.y > 0.8) {
                this.handleMove(1, 0);
            }
            if(swipeNormal.y < -0.8) {
                this.handleMove(-1, 0);
            }
        }
    },

    addTwo: function(){
        var emptyTiles = this.emptyCells();
        var chosenTile = Phaser.Utils.Array.GetRandomElement(emptyTiles);
        this.fieldArray[chosenTile.row][chosenTile.col].tileValue = 1;
        this.fieldArray[chosenTile.row][chosenTile.col].tileSprite.visible = true;
        this.fieldArray[chosenTile.row][chosenTile.col].tileSprite.setFrame(0);
        this.tweens.add({
            targets: [this.fieldArray[chosenTile.row][chosenTile.col].tileSprite],
            alpha: 1,
            duration: gameOptions.tweenSpeed,
            onComplete: function(tween){
                tween.parent.scene.canMove = true;
            },
        });
	},

    handleKey: function(e){
        if(this.canMove){
            switch(e.code){
                case "KeyA":
                case "ArrowLeft":
                    this.handleMove(0, -1);
                    break;
                case "KeyD":
                case "ArrowRight":
                    this.handleMove(0, 1);
                    break;
                case "KeyW":
                case "ArrowUp":
                    this.handleMove(-1, 0);
                    break;
                case "KeyS":
                case "ArrowDown":
                    this.handleMove(1, 0);
                    break;
            }
        }
    },

    handleMove: function(deltaRow, deltaCol){
        this.canMove = false;
        var somethingMoved = false;
        this.movingTiles = 0;
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                var colToWatch = deltaCol == 1 ? 3 - j : j;
                var rowToWatch = deltaRow == 1 ? 3 - i : i;
                var tileValue = this.fieldArray[rowToWatch][colToWatch].tileValue;
                if(tileValue != 0){
                    var colSteps = deltaCol;
                    var rowSteps = deltaRow;
                    while(this.isInsideBoard(rowToWatch + rowSteps, colToWatch + colSteps) 
                    && this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps].tileValue == 0){
                        colSteps += deltaCol;
                        rowSteps += deltaRow;
                    }
                    // if change number
                    if(this.isInsideBoard(rowToWatch + rowSteps, colToWatch + colSteps) 
                    && (this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps].tileValue == tileValue) 
                    && this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps].canUpgrade 
                    && this.fieldArray[rowToWatch][colToWatch].canUpgrade) {
                        this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps].tileValue ++;
                        this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps].canUpgrade = false;
                        this.fieldArray[rowToWatch][colToWatch].tileValue = 0;
                        this.moveTile(this.fieldArray[rowToWatch][colToWatch], rowToWatch + rowSteps, colToWatch + colSteps, Math.abs(rowSteps + colSteps), true);
                        somethingMoved = true;
                        this.tileMatchesAvailable(true);
                    }
                    // if not change number
                    else {
                        colSteps = colSteps - deltaCol;
                        rowSteps = rowSteps - deltaRow;
                        if(colSteps != 0 || rowSteps != 0){
                            this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps].tileValue = tileValue;
                            this.fieldArray[rowToWatch][colToWatch].tileValue = 0;
                            this.moveTile(this.fieldArray[rowToWatch][colToWatch], rowToWatch + rowSteps, colToWatch + colSteps, Math.abs(rowSteps + colSteps), false);
                            somethingMoved = true;
                            this.tileMatchesAvailable(false);
                        }
                    }
                }
            }
        }
        if(!somethingMoved){
            this.canMove = true;
        }
    },

    moveTile: function(tile, row, col, distance, changeNumber){
        this.movingTiles ++;
        this.tweens.add({
            targets: [tile.tileSprite],
            x: this.tileDestination(col),
            y: this.tileDestination(row),
            duration: gameOptions.tweenSpeed * distance,
            onComplete: function(tween){
                tween.parent.scene.movingTiles --;
                if(changeNumber){
                    tween.parent.scene.transformTile(tile, row, col);
                }
                if(tween.parent.scene.movingTiles == 0){
                    tween.parent.scene.resetTiles();
                    tween.parent.scene.addTwo();
                }
            }
        })
    },
    transformTile: function(tile, row, col){
        this.movingTiles ++;
        this.score ++;
        tile.tileSprite.setFrame(this.fieldArray[row][col].tileValue - 1);
        this.tweens.add({
            targets: [tile.tileSprite],
            scaleX: 1.1,
            scaleY: 1.1,
            duration: gameOptions.tweenSpeed,
            yoyo: true,
            repeat: 1,
            onComplete: function(tween){
                tween.parent.scene.movingTiles --;
                if(tween.parent.scene.movingTiles == 0){
                    tween.parent.scene.resetTiles();
                    tween.parent.scene.addTwo();
                }
            }
        })
    },
    resetTiles: function(){
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                this.fieldArray[i][j].canUpgrade = true;
                this.fieldArray[i][j].tileSprite.x = this.tileDestination(j);
                this.fieldArray[i][j].tileSprite.y = this.tileDestination(i);
                if(this.fieldArray[i][j].tileValue > 0){
                    this.fieldArray[i][j].tileSprite.alpha = 1;
                    this.fieldArray[i][j].tileSprite.visible = true;
                    this.fieldArray[i][j].tileSprite.setFrame(this.fieldArray[i][j].tileValue - 1);
                }
                else{
                    this.fieldArray[i][j].tileSprite.alpha = 0;
                    this.fieldArray[i][j].tileSprite.visible = false;
                }
            }
        }
    },
    isInsideBoard: function(row, col){
        return (row >= 0) && (col >= 0) && (row < 4) && (col < 4);
    },
    tileDestination: function(pos){
        return pos * (gameOptions.tileSize + gameOptions.tileSpacing) + gameOptions.tileSize / 2 + gameOptions.tileSpacing
    },
    emptyCells: function() {
        var emptyTiles = [];
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                if(this.fieldArray[i][j].tileValue == 0){
                    emptyTiles.push({
                        row: i,
                        col: j
                    })
                }
            }
        }
        return emptyTiles;
    },
    cellAvailable: function() {
        return !!this.emptyCells().length
    },
    tileMatchesAvailable: function(status) {
        console.log(status);
        return status;
    },
    movesAvailable: function() {
        return this.cellAvailable() || this.tileMatchesAvailable();
    },
    update() {
        this.scoreText.setText(`Score: ${this.score}`);
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                if(this.fieldArray[i][j].tileValue == 11){
                    this.result.setText("You win!")
                }
            }
        }
        if (!this.movesAvailable()) {
            this.result.setText("You lose!")
        }
    }
});

// for visual use
function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
