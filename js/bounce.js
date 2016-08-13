// Offset of each block
var offset = 15;

// Basic settings
var objectNumber = 6;
var objectWidth = 128;

// which will try to choose the best renderer for the environment you are in.
var renderer = new PIXI.CanvasRenderer(window.innerWidth, window.innerHeight)
renderer.backgroundColor = 0xfaf8ef;

// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();

var graphics = new PIXI.Graphics();

var totalWidth = objectNumber*objectWidth+(objectNumber+1)*offset;

// Position of the inside window
var startX = (window.innerWidth-totalWidth)/2;
var startY = (window.innerHeight-totalWidth)/2;

// Initial position
graphics.moveTo(startX, startY);

var resourcePath = "imgs/";

var textureArray = [['material1', resourcePath+'g1.png'], ['material2', resourcePath+'g2.png'], ['material3', resourcePath+'g3.png'], ['material4', resourcePath+'g4.png']];


var totalScore = 0;
var scoreLabel = new PIXI.Text('Score',{font : '20px Arial', fill : 0xFFFFFF, align : 'center'});
var scoreTextLabel = new PIXI.Text(totalScore, {font : '25px Arial', fill : 0xFFFFFF, align : 'center'});


for (var i = 0; i < textureArray.length; i++) {
    PIXI.loader.add(textureArray[i][0], textureArray[i][1]);
};

graphics.beginFill(0xbbada0);
graphics.drawRoundedRect(startX, startY, totalWidth, totalWidth, 10);
graphics.endFill();

var clickObjs = [];

var barWidth = 150;
var barHeight = 10;
var bstartX = window.innerWidth/2-barWidth/2;
var bstartY = startY+totalWidth-4*barHeight;
var barstepLength = 50;

// Bar canvas
var barGraphics = new PIXI.Graphics();

var objectFall = [];
var count = 0;

// Fall speed
var fallStep = 5;

var gameOver = false;

// Game over threshold
var gameThreshold = 300;

document.onmousemove = checkKey;
stage.interactive = true;

PIXI.loader.load(function (loader, resources) {

    for (var i = 0; i < objectNumber*objectNumber; i++) {
        var objIndex = Math.floor(Math.random()*textureArray.length+1);
        var tempTexture = new PIXI.Sprite.fromImage(textureArray[objIndex-1][1]);
        clickObjs.push(tempTexture);
    }


    barGraphics.beginFill(0xf2b179);
    barGraphics.drawRoundedRect(bstartX, bstartY, barWidth, barHeight, 10);
    barGraphics.endFill();

    scoreLabel.position.x = (startX+offset*(objectNumber+1)+objectNumber*objectWidth-objectWidth/2)-scoreLabel.width/2;
    scoreLabel.position.y = startY/2-(scoreLabel.height+scoreTextLabel.height)*1.3/2;

    scoreTextLabel.position.x = (startX+offset*(objectNumber+1)+objectNumber*objectWidth-objectWidth/2)-scoreTextLabel.width/2;
    scoreTextLabel.position.y = startY/2;

    graphics.beginFill(0xcdc1b4);
    graphics.drawRoundedRect(startX+offset*(objectNumber+1)+objectNumber*objectWidth-objectWidth, startY/2-(scoreLabel.height+scoreTextLabel.height)*1.3/2, objectWidth, (startY*2/3 > scoreLabel.height+scoreTextLabel.height)?1.3*(scoreLabel.height+scoreTextLabel.height):(startY*2/3), 10)

    graphics.endFill();

    stage.addChild(graphics);
    stage.addChild(scoreLabel);
    stage.addChild(scoreTextLabel);
    stage.addChild(barGraphics);

    requestAnimationFrame(animate);
});

// Touch event
stage.touchmove = function(touchData){
    if(touchData.data.getLocalPosition(stage).x > startX && touchData.data.getLocalPosition(stage).x < startX+totalWidth-barWidth){
        bstartX = touchData.data.getLocalPosition(stage).x;
    }

}

// Key event
function checkKey(e){
    if(e.clientX > startX && e.clientX < startX+totalWidth-barWidth){
        bstartX = e.clientX;
    }
}

// Animation loop
function animate(){

    var updatedFall = [];

    // Check object fall on the bar
    for (var i = 0; i < objectFall.length; i++) {
        if(objectFall[i].position.y <= bstartY){
            var objCenter_X = objectFall[i].position.x + objectFall[i].width/2;
            var objCenter_Y = objectFall[i].position.y + objectFall[i].height;
            if( (objCenter_X>=bstartX) && (objCenter_X<=bstartX+barWidth) && (bstartY - objCenter_Y <= fallStep) ){
                totalScore += 36;
                stage.removeChild(objectFall[i]);
            }else{
                updatedFall.push(objectFall[i]);
            }
        }else{
            updatedFall.push(objectFall[i]);
        }
    };


    objectFall = updatedFall;

    stage.removeChild(barGraphics);
    stage.removeChild(graphics);

    for (var i = 0; i < objectFall.length; i++) {
        stage.removeChild(objectFall[i]);
    };
    count++;

    // redraw bar
    barGraphics = new PIXI.Graphics();

    barGraphics.beginFill(0xf2b179);
    barGraphics.drawRoundedRect(bstartX, bstartY, barWidth, barHeight, 10);
    barGraphics.endFill();

    stage.addChild(graphics);
    stage.addChild(barGraphics);

    // // Update the current fall object
    // var lastestFall = []
    // for (var i = 0; i < objectFall.length; i++) {
    //     if(objectFall[i].position.y < startY+totalWidth){
    //         lastestFall.push(objectFall[i]);
    //     }
    // };
    // objectFall = lastestFall;

    // Check add the new object
    if(count%50==0 && objectFall.length < 10){
        count = 0;
        if(!gameOver && objectFall.length < 10){
            var objIndex = Math.floor(Math.random()*textureArray.length+1);
            var tempTexture = new PIXI.Sprite.fromImage(textureArray[objIndex-1][1]);
            tempTexture.scale.x = 1;
            tempTexture.scale.y = 1;
            var posX = startX+Math.floor(Math.random()*(totalWidth-objectWidth)+1);
            tempTexture.position.x = posX;
            tempTexture.position.y = 0;
            objectFall.push(tempTexture);

        }
    }else{
        for (var i = 0; i < objectFall.length; i++) {
            objectFall[i].position.y += fallStep;

        }
        for (var i = 0; i < objectFall.length; i++) {
            if(objectFall[i].position.y > 2*startY+totalWidth){
                objectFall.shift();
            }
        }
    }

    for (var i = 0; i < objectFall.length; i++) {
        stage.addChild(objectFall[i]);
    }

    stage.removeChild(scoreLabel);
    stage.removeChild(scoreTextLabel);

    // Add score label
    scoreTextLabel.text = totalScore;

    scoreLabel.position.x = (startX+offset*(objectNumber+1)+objectNumber*objectWidth-objectWidth/2)-scoreLabel.width/2;
    scoreLabel.position.y = startY/2-(scoreLabel.height+scoreTextLabel.height)*1.3/2;

    scoreTextLabel.position.x = (startX+offset*(objectNumber+1)+objectNumber*objectWidth-objectWidth/2)-scoreTextLabel.width/2;
    scoreTextLabel.position.y = startY/2;

    stage.addChild(scoreLabel);
    stage.addChild(scoreTextLabel);
    renderer.render(stage);

    gameOver = (totalScore >= gameThreshold)? true : false;


    requestAnimationFrame(animate);
}
