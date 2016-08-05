// Offset of each block
var offset = 15;

// Basic settings
var objectNumber = 6;
var objectWidth = 128;

// which will try to choose the best renderer for the environment you are in.
var renderer = new PIXI.CanvasRenderer(window.innerWidth, window.innerHeight)
renderer.backgroundColor = 0x00a0e4;

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

graphics.beginFill(0x00235d);
graphics.drawRect(0, startY/2-objectWidth, window.innerWidth, window.innerHeight/7, 0);
graphics.endFill();

var totalTime = 0;
var resourcePath = "imgs/";

var textureArray = [['material1', resourcePath+'c1.png'], ['material2', resourcePath+'c2.png'], ['material3', resourcePath+'c3.png'], ['material4', resourcePath+'c4.png']];


var totalScore = 0;
var scoreLabel = new PIXI.Text('Score:',{font : '30px Arial', fill : 0xFFFFFF, align : 'center'});
var scoreTextLabel = new PIXI.Text(totalScore, {font : '30px Arial', fill : 0xFFFFFF, align : 'center'});


var timeLabel = new PIXI.Text('Time:',{font : '30px Arial', fill : 0xFFFFFF, align : 'center'});
var timeTextLabel = new PIXI.Text(totalTime,{font : '30px Arial', fill : 0xFFFFFF, align : 'center'});


var gameNameLabel = new PIXI.Text('Container Sort', {font : '85px Arial', fill : 0xFFFFFF, align : 'center'});


for (var i = 0; i < textureArray.length; i++) {
    PIXI.loader.add(textureArray[i][0], textureArray[i][1]);
};


graphics.beginFill(0xbbada0);
graphics.drawRoundedRect(startX, startY, totalWidth, totalWidth, 10);
graphics.endFill();

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

document.onmousemove = checkKey;
stage.interactive = true;

PIXI.loader.load(function (loader, resources) {


    barGraphics.beginFill(0xffce43);
    barGraphics.drawRoundedRect(bstartX, bstartY, barWidth, barHeight, 10);
    barGraphics.endFill();

    scoreLabel.position.x = offset+3*objectWidth;
    scoreLabel.position.y = startY/2-objectWidth+window.innerHeight*2/21+window.innerHeight/63;

    scoreTextLabel.position.x = offset+3*objectWidth+scoreLabel.width+offset;
    scoreTextLabel.position.y = startY/2-objectWidth+window.innerHeight*2/21+window.innerHeight/63;

    timeLabel.position.x = objectWidth/2;
    timeLabel.position.y = startY/2-objectWidth+window.innerHeight*2/21+window.innerHeight/63;

    timeTextLabel.position.x = objectWidth/2+timeLabel.width+offset;
    timeTextLabel.position.y = startY/2-objectWidth+window.innerHeight*2/21+window.innerHeight/63;

    gameNameLabel.x = objectWidth/2+offset;
    gameNameLabel.y = startY/3-objectWidth+window.innerHeight/14;

    graphics.beginFill(0x0163a7);
    graphics.drawRect(0, startY/2-objectWidth+window.innerHeight*2/21, window.innerWidth*2/3, window.innerHeight/21);

    graphics.endFill();

    stage.addChild(graphics);
    stage.addChild(scoreLabel);
    stage.addChild(scoreTextLabel);
    stage.addChild(barGraphics);
    stage.addChild(timeTextLabel);
    stage.addChild(timeLabel);
    stage.addChild(gameNameLabel);

    setInterval(updateTimer, 1000);

    requestAnimationFrame(animate);
});

function updateTimer(){
    totalTime++;
    if(totalTime>60)
        totalTime = 60;
    timeTextLabel.text = totalTime;
    renderer.render(stage);
}


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

    // stage.addChild(graphics);
    // Check object fall on the bar
    for (var i = 0; i < objectFall.length; i++) {
        if(objectFall[i].position.y <= bstartY){
            var objCenter_X = objectFall[i].position.x + objectFall[i].width/2;
            var objCenter_Y = objectFall[i].position.y + objectFall[i].height;
            if( (objCenter_X>=bstartX) && (objCenter_X<=bstartX+barWidth) && (bstartY - objCenter_Y <= fallStep) ){
                totalScore += 50;
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

    graphics = new PIXI.Graphics();
    graphics.beginFill(0x00235d);
    graphics.drawRect(0, startY/2-objectWidth, window.innerWidth, window.innerHeight/7, 0);
    graphics.endFill();
    stage.addChild(graphics);


    for (var i = 0; i < objectFall.length; i++) {
        stage.removeChild(objectFall[i]);
    };
    count++;

    // redraw bar
    barGraphics = new PIXI.Graphics();

    barGraphics.beginFill(0xffce43);
    barGraphics.drawRoundedRect(bstartX, bstartY, barWidth, barHeight, 10);
    barGraphics.endFill();

    // Check add the new object
    if(count%50==0 && objectFall.length < 20){
        count = 0;
        if(totalTime<60 && objectFall.length < 20){
            var objIndex = Math.floor(Math.random()*textureArray.length+1);
            var tempTexture = new PIXI.Sprite.fromImage(textureArray[objIndex-1][1]);
            tempTexture.scale.x = 1;
            tempTexture.scale.y = 1;
            var posX = startX+Math.floor(Math.random()*(totalWidth-objectWidth)+1);
            tempTexture.position.x = posX;
            tempTexture.position.y = startY-objectWidth;
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
    stage.removeChild(timeLabel);
    stage.removeChild(timeTextLabel);
    stage.removeChild(gameNameLabel);


    // Add score label
    scoreTextLabel.text = totalScore;

    scoreLabel.position.x = offset+3*objectWidth;
    scoreLabel.position.y = startY/2-objectWidth+window.innerHeight*2/21+window.innerHeight/63;

    scoreTextLabel.position.x = offset+3*objectWidth+scoreLabel.width+offset;
    scoreTextLabel.position.y = startY/2-objectWidth+window.innerHeight*2/21+window.innerHeight/63;

    timeLabel.position.x = objectWidth/2;
    timeLabel.position.y = startY/2-objectWidth+window.innerHeight*2/21+window.innerHeight/63;

    timeTextLabel.position.x = objectWidth/2+timeLabel.width+offset;
    timeTextLabel.position.y = startY/2-objectWidth+window.innerHeight*2/21+window.innerHeight/63;

    gameNameLabel.x = objectWidth/2+offset;
    gameNameLabel.y = startY/3-objectWidth+window.innerHeight/14;


    stage.addChild(scoreLabel);
    stage.addChild(scoreTextLabel);
    stage.addChild(barGraphics);
    stage.addChild(timeTextLabel);
    stage.addChild(timeLabel);
    stage.addChild(gameNameLabel);

    renderer.render(stage);

    gameOver = (totalTime >= 54)? true : false;


    requestAnimationFrame(animate);
}
