// Offset of each block
var offset = 35;

// Basic settings
var objectNumber = 6;
var objectWidth = 135;

var preClick;
var clickCount = 0;

// which will try to choose the best renderer for the environment you are in.
var renderer = new PIXI.CanvasRenderer(window.innerWidth, window.innerHeight)
renderer.backgroundColor = 0x00a0e4;

// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view);

// You need to create a root container that will hold the scene you want to draw.
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


// Draw background round rect
graphics.beginFill(0x015b9c);
graphics.drawRoundedRect(startX+objectWidth*1, startY-offset, objectWidth+offset*4, totalWidth+offset*2, 15);
graphics.drawRoundedRect(startX+offset*3+objectWidth*4, startY-offset, objectWidth+offset*4, totalWidth+offset*2, 15);
graphics.endFill();

// Draw tiny round rect block
graphics.beginFill(0x00a0e4);


for (var i = 0; i < objectNumber * 2; i++){
    if(i % 2 == 0){
        graphics.drawRoundedRect(startX+offset*2+objectWidth*1, startY+offset*((i/2)+1)+objectWidth*((i/2)), objectWidth, objectWidth, 10);
    }else{
        graphics.drawRoundedRect(startX+offset*5+objectWidth*4, startY+offset*(((i-1)/2)+1)+objectWidth*(((i-1)/2)), objectWidth, objectWidth, 10);
    }
}

graphics.endFill();

var resourcePath = "public/imgs/";
// Prelaod the asset
var textureArray = [['material1', resourcePath+'g1.png'], ['material2', resourcePath+'g2.png']];

var textureRubArray = [['material3', resourcePath+'g3.png'], ['material4', resourcePath+'g4.png']];


for (var i = 0; i < textureArray.length; i++) {
    PIXI.loader.add(textureArray[i][0], textureArray[i][1]);
};

var clickObjs = [];
var valObjs = [];

var rtnValue = generateTexture(objectNumber, textureArray, textureRubArray);
clickObjs = rtnValue.clkObj;
valObjs = rtnValue.clkcValue;
        console.log(valObjs);
var explosionTexture = [];

var explosionArray = [];

var totalTime = 0;


var totalScore = 0;
var scoreLabel = new PIXI.Text('Score:',{font : '30px Arial', fill : 0xFFFFFF, align : 'center'});
var scoreTextLabel = new PIXI.Text(totalScore, {font : '30px Arial', fill : 0xFFFFFF, align : 'center'});


var timeLabel = new PIXI.Text('Time:',{font : '30px Arial', fill : 0xFFFFFF, align : 'center'});
var timeTextLabel = new PIXI.Text(totalTime,{font : '30px Arial', fill : 0xFFFFFF, align : 'center'});


var gameNameLabel = new PIXI.Text('Coffee Cup Sort', {font : '85px Arial', fill : 0xFFFFFF, align : 'center'});

var stopFlag = false;

PIXI.loader.load(function (loader, resources) {

    for(var i = 1; i <= 9; i++){
        var texture = PIXI.Texture.fromImage(resourcePath+'explosion1_000'+i+'.png');
        explosionTexture.push(texture);
    }

    for(var i = 10; i <= 90; i++){
        var texture = PIXI.Texture.fromImage(resourcePath+'explosion1_00'+i+'.png');
        explosionTexture.push(texture);
    }

    for (var i = 0; i < objectNumber*2 ; i++){
        var tempexplosion = new PIXI.extras.MovieClip(explosionTexture);
        tempexplosion.loop = false;
        explosionArray.push(tempexplosion);
    }

    // Set position
    console.log(clickObjs.length);
    for(var i = 0; i < objectNumber*2; i++){
        clickObjs[i].scale.x = 1;
        clickObjs[i].scale.y = 1;
        if(i % 2 == 0){
            clickObjs[i].position.x = startX+offset*2+objectWidth*1;
            clickObjs[i].position.y = startY+offset*((i/2)+1)+objectWidth*((i/2));
        }else{
            clickObjs[i].position.x = startX+offset*5+objectWidth*4;
            clickObjs[i].position.y = startY+offset*(((i-1)/2)+1)+objectWidth*(((i-1)/2));
        }
        clickObjs[i].interactive = true;
        clickObjs[i].on('mousedown', function(){
            pairwiseCheck(this);
        }).on('tap', function(){
            pairwiseCheck(this);
        });
    }

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

    stage.addChild(timeLabel);

    stage.addChild(timeTextLabel);

    stage.addChild(gameNameLabel);

    stage.addChild(scoreLabel);

    stage.addChild(scoreTextLabel);


    for (var i = 0; i < clickObjs.length; i++) {
        stage.addChild(clickObjs[i]);
    }

    setInterval(updateTimer, 1000);

    renderer.render(stage);
});


function updateTimer(){
    totalTime++;
    if(totalTime > 60)
        totalTime = 60;
    timeTextLabel.text = totalTime;
    renderer.render(stage);
}

// Check each pairwise
function pairwiseCheck(currentClick){

    clickCount++;

    if(clickCount ==1 || clickCount == 2){
        drawHighLighter(currentClick);
    }

    if(clickCount == 1){
        preClick = currentClick;
    }else if(clickCount == 2){

        var nxtIndex = clickObjs.indexOf(currentClick);
        var preIndex = clickObjs.indexOf(preClick);

        if((nxtIndex%2 != preClick%2) && valObjs[preIndex] == valObjs[nxtIndex] && valObjs[preIndex] >= 0 && valObjs[nxtIndex] >= 0){

            var preClk_X = clickObjs[preIndex].position.x;
            var preClk_Y = clickObjs[preIndex].position.y;
            var nxtClk_X = clickObjs[nxtIndex].position.x;
            var nxtClk_Y = clickObjs[nxtIndex].position.y;

            stopFlag = false;

            explosionEffect(preClk_X+objectWidth/2, preClk_Y+objectWidth/2, preIndex);

            explosionEffect(nxtClk_X+objectWidth/2, nxtClk_Y+objectWidth/2, nxtIndex);

            valObjs[preIndex] = -1;
            valObjs[nxtIndex] = -1;

            setTimeout(function(){
                redrawContainer();
                stopFlag = true;
            },800);

            totalScore += 50;
        }else{
            redrawContainer();
        }
        if(totalScore==36){
            menuShow();
        }
        clickCount = 0;
    }
}

// Show the control menu
function menuShow(){
    // $(document).ready(function(){
    //     $('#myModal').modal('show');
    // });
}

// Draw the select block
function drawHighLighter(currentClick){
    var coverGraphics = new PIXI.Graphics();

    var cIndex = clickObjs.indexOf(currentClick);

    coverGraphics.beginFill(0xf2b179);
    coverGraphics.drawRoundedRect(clickObjs[cIndex].position.x, clickObjs[cIndex].position.y, objectWidth, objectWidth, 10);
    coverGraphics.endFill();
    stage.addChild(coverGraphics);
    stage.addChild(clickObjs[cIndex]);
    renderer.render(stage);
}

// Redraw the whole canvas
function redrawContainer(){

    var coverGraphics = new PIXI.Graphics();

    stage = new PIXI.Container();
    // graphics.beginFill(0xbbada0);
    // graphics.drawRoundedRect(startX, startY, totalWidth, totalWidth, 10);
    // graphics.endFill();

    stage.addChild(graphics);

    for (var i = 0; i < clickObjs.length; i++) {
        if(valObjs[i]!=-1){
            stage.addChild(clickObjs[i]);
        }
    }

    graphics.beginFill(0x00a0e4);
    for (var i = 0; i < objectNumber * 2; i++){
        if(valObjs[i]!=-1){
            if(i % 2 == 0){
                graphics.drawRoundedRect(startX+offset*2+objectWidth*1, startY+offset*((i/2)+1)+objectWidth*((i/2)), objectWidth, objectWidth, 10);
            }else{
                graphics.drawRoundedRect(startX+offset*5+objectWidth*4, startY+offset*(((i-1)/2)+1)+objectWidth*(((i-1)/2)), objectWidth, objectWidth, 10);
            }
        }

    }

    graphics.endFill();

    scoreTextLabel.text = totalScore;
    timeTextLabel.text = totalTime;

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

    stage.addChild(timeLabel);

    stage.addChild(timeTextLabel);

    stage.addChild(gameNameLabel);

    stage.addChild(scoreLabel);

    stage.addChild(scoreTextLabel);

    stage.addChild(coverGraphics);

    renderer.render(stage);

}

// Animation effect
function explosionEffect(expX, expY, expIndex){

    explosionArray[expIndex].position.x = expX;
    explosionArray[expIndex].position.y = expY;
    explosionArray[expIndex].anchor.x = 0.5;
    explosionArray[expIndex].anchor.y = 0.5;

    explosionArray[expIndex].scale.x = 6;
    explosionArray[expIndex].scale.y = 6;
    explosionArray[expIndex].loop = false;

    explosionArray[expIndex].rotation = Math.random() * Math.PI;

    explosionArray[expIndex].gotoAndPlay(0);

    stage.addChild(explosionArray[expIndex]);

    requestAnimationFrame(animate);

    setTimeout(800);
}

// Generate all the texture
function generateTexture(objectNumber, textureArray, textureRubArray){

    var clickObjs = [];
    var valueArray = [];
    var sumTexture = [];

    do{
        clickObjs = [];
        sumTexture = [];
        valueArray = [];

        for (var i = 0; i < textureArray.length+textureRubArray.length; i++) {
            sumTexture.push(0);
        }

        for (var i = 0; i < objectNumber; i++) {
            var objIndex = Math.floor(Math.random()*textureArray.length);
            sumTexture[objIndex]++;
            var tempTexture = new PIXI.Sprite.fromImage(textureArray[objIndex][1]);
            valueArray.push(objIndex);
            clickObjs.push(tempTexture);


            var objIndex2 = 0;
            if(objIndex==1)
                objIndex2 = 1;
            sumTexture[objIndex2+textureArray.length]++;
            var tempTexture2 = new PIXI.Sprite.fromImage(textureRubArray[objIndex2][1]);
            valueArray.push(objIndex);
            clickObjs.push(tempTexture2);
        }
    }while(!validateArray(valueArray));

    return {
        clkObj: clickObjs,
        clkcValue: valueArray
    };
}

// Validate the pairwise
function validateArray(valueArray){
    var zeroCount = 0;
    var oneCount = 0;
    for(var i = 0; i < valueArray.length; i++){
        if(valueArray[i]==0)
            zeroCount++;
        else
            oneCount++;
    }
    if(zeroCount==oneCount)
        return true
    return false;
}

// Animate control
function animate() {

    if(!stopFlag){
        renderer.render(stage);
        requestAnimationFrame(animate);
    }else{
        return true;
    }
    return false;
}
