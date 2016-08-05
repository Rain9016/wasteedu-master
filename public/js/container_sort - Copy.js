// Offset of each block
var offset = 50;

// Basic settings
var objectNumber = 3;
var objectWidth = 512;

// which will try to choose the best renderer for the environment you are in.
var renderer = new PIXI.CanvasRenderer(window.innerWidth, window.innerHeight)
renderer.backgroundColor = 0x00a0e4;

// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();

var graphics = new PIXI.Graphics();


var totalTime = 0;
var totalScore = 0;
var scoreLabel = new PIXI.Text('Score:',{font : '30px Arial', fill : 0xFFFFFF, align : 'center'});
var scoreTextLabel = new PIXI.Text(totalScore, {font : '30px Arial', fill : 0xFFFFFF, align : 'center'});


var timeLabel = new PIXI.Text('Time:',{font : '30px Arial', fill : 0xFFFFFF, align : 'center'});
var timeTextLabel = new PIXI.Text(totalTime,{font : '30px Arial', fill : 0xFFFFFF, align : 'center'});


var gameNameLabel = new PIXI.Text('Container Sort', {font : '85px Arial', fill : 0xFFFFFF, align : 'center'});


var resourcePath = "public/imgs/";

var textureArray = [['material1', resourcePath+'r1.png'], ['material2', resourcePath+'r2.png'], ['material3', resourcePath+'r3.png']];


var rubbishArray = [];
var rubbishBin = [];


for (var i = 0; i < textureArray.length; i++) {
    PIXI.loader.add(textureArray[i][0], textureArray[i][1]);
    rubbishBin.push(new PIXI.Sprite.fromImage(textureArray[i][1]));
    rubbishBin[i].scale.x = rubbishBin[i].scale.y = 0.5;
};

// console.log(rubbishBin.length);
objectWidth = (rubbishBin.length > 0) ? (objectWidth*rubbishBin[0].scale.x) : objectWidth;

var totalWidth = objectNumber*objectWidth+(objectNumber-1)*offset;

// console.log(window.innerWidth+","+totalWidth);

// Position of the inside window
var startX = (window.innerWidth-totalWidth)/2;
var startY = (window.innerHeight-512*rubbishBin[0].scale.x)/3;


// Initial position
graphics.moveTo(startX, startY);
graphics.beginFill(0x00235d);
graphics.drawRect(0, startY/2-objectWidth, window.innerWidth, window.innerHeight/7, 0);
graphics.endFill();


var rubbishWidth = 512*0.55;
var rbStart_X = startX;
var rbStart_Y = window.innerHeight - rubbishWidth*4;
var rbNumber = 3;

for(var i = 1 ; i <= 3; i++)
{
    PIXI.loader.add("test"+i, resourcePath+"test"+i+".png");
}
stage.interactive = true;

PIXI.loader.load(function (loader, resources) {


    for (var i = 0; i < textureArray.length; i++) {
        rubbishBin[i].position.x = startX+i*(offset+256);
        rubbishBin[i].position.y = startY;
        // console.log(rubbishBin[i].position.x);
        stage.addChild(rubbishBin[i]);
    };



    for (var i = 1; i <= 3; i++) {
        rubbishArray.push(new PIXI.Sprite.fromImage(resourcePath+"test"+i+".png"));
        rubbishArray[i-1].scale.x = 0.55;
        rubbishArray[i-1].scale.y = 0.55;
        rubbishArray[i-1].position.x = rbStart_X + (i-1) * (rubbishWidth);
        rubbishArray[i-1].position.y = rbStart_Y;
        rubbishArray[i-1].interactive = true;


        rubbishArray[i-1]
        // events for drag start
        .on('mousedown', onDragStart)
        .on('touchstart', onDragStart)
        // events for drag end
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        // events for drag move
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);
        stage.addChild(rubbishArray[i-1]);
    };

    graphics.beginFill(0x0163a7);
    graphics.drawRect(0, startY/2-objectWidth+window.innerHeight*2/21, window.innerWidth*2/3, window.innerHeight/21);

    graphics.endFill();


    stage.addChild(graphics);


    scoreLabel.position.x = 2*objectWidth;
    scoreLabel.position.y = startY/2-objectWidth+window.innerHeight*2/21+window.innerHeight/63;

    scoreTextLabel.position.x = offset+2*objectWidth+scoreLabel.width;
    scoreTextLabel.position.y = startY/2-objectWidth+window.innerHeight*2/21+window.innerHeight/63;

    timeLabel.position.x = objectWidth/3;
    timeLabel.position.y = startY/2-objectWidth+window.innerHeight*2/21+window.innerHeight/63;

    timeTextLabel.position.x = objectWidth/3+timeLabel.width+offset;
    timeTextLabel.position.y = startY/2-objectWidth+window.innerHeight*2/21+window.innerHeight/63;

    gameNameLabel.position.x = objectWidth/3+offset;
    gameNameLabel.position.y = startY/3-objectWidth+window.innerHeight/14;




    stage.addChild(scoreLabel);
    stage.addChild(scoreTextLabel);
    stage.addChild(timeTextLabel);
    stage.addChild(timeLabel);
    stage.addChild(gameNameLabel);

    setInterval(updateTimer, 1000);

    // renderer.render(stage);
    // requestAnimationFrame(animate);
});

requestAnimationFrame( animate );

var maxLength = Math.sqrt(2*Math.pow(512*0.5,2));

var binCenter_X = rubbishBin[0].position.x + 512*0.5;
var binCenter_Y = rubbishBin[0].position.y + 512*0.5;

function animate() {

    renderer.render(stage);

    requestAnimationFrame(animate);
}

function updateTimer(){
    totalTime++;
    if(totalTime>60)
        totalTime = 60;
    timeTextLabel.text = totalTime;
    renderer.render(stage);
    // updateTimer();
}

function onDragStart(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}


function onDragEnd()
{
    this.alpha = 1;

    this.dragging = false;

    var distance = Math.sqrt((Math.pow(this.position.x - binCenter_X, 2))+(Math.pow(this.position.y - binCenter_Y, 2)));

    cIndex = rubbishArray.indexOf(this);

    if(distance <= maxLength){
        console.log("true");
        for (var i = cIndex; i < rubbishArray.length; i++){
            if((i+1)<rubbishArray.length){
                rubbishArray[i+1].position.x = rbStart_X + i * (rubbishWidth);
            }
        }
        stage.removeChild(rubbishArray[cIndex]);
        rubbishArray.splice(cIndex, 1);
    }else{
        rubbishArray[cIndex].position.x = rbStart_X + cIndex * (rubbishWidth);
        rubbishArray[cIndex].position.y = rbStart_Y;
    }

    // set the interaction data to null
    this.data = null;
}

function onDragMove()
{
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x-this.width/2;
        this.position.y = newPosition.y-this.height/2;
    }
}
