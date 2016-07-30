// which will try to choose the best renderer for the environment you are in.
var renderer = new PIXI.CanvasRenderer(window.innerWidth, window.innerHeight)

// set background's color
renderer.backgroundColor = 0x00a0e4;

// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();

// create the graphics objects for drawing primitive shapes
var graphics = new PIXI.Graphics();

// create a generic resource loader
var loader = new PIXI.loaders.Loader();

// Offset of each block
var offset = 35;

// Basic settings
var TotalCups = 2;
var MinCups = 2;
var MaxCups = 6;
var objectWidth = 135;

// load the resources of cups and bins
var resourcePath = "public/imgs/";
var CupsTexture = [['cup1', resourcePath+'g1.png'], ['cup2', resourcePath+'g2.png']];
var BinsTexture = [['bin1', resourcePath+'g3.png'], ['bin2', resourcePath+'g4.png']];
for (var i = 0; i < CupsTexture.length; i++) {
    loader.add(CupsTexture[i][0], CupsTexture[i][1]);
    loader.add(BinsTexture[i][0], BinsTexture[i][1]);
    console.log(CupsTexture[i][0]);
    console.log(CupsTexture[i][1]);
    console.log(BinsTexture[i][0]);
    console.log(BinsTexture[i][1]);
};

var res = GenerateRandomTexture(TotalCups);
console.log(res);
var CupsObjs = res.c_objs;
var BinsObjs = res.b_objs;
var CupsValues = res.c_values;
var BinsValues = res.b_values;
console.log(CupsObjs);
console.log(BinsObjs);
console.log(CupsValues);
console.log(BinsValues);

// Record previous click and count click times
var preClick;
var clickCount = 0;

// Timer and Score
var TotalTime = 0;
var TotalScore = 0;

// Create the objects of timer and score and set up its style
var Scorestyle = {
    font : '30px Arial',
    fill : 0xFFFFFF,
    align : 'center'
};

var Timerstyle = {
    font : '30px Arial',
    fill : 0xFFFFFF,
    align : 'center'
};

var scorelabelText = new PIXI.Text('Score:', Scorestyle);
var scoreText = new PIXI.Text(TotalScore, Scorestyle);

var TimelabelText = new PIXI.Text('Time:', Timerstyle);
var TimeText = new PIXI.Text(TotalTime, Timerstyle);

// Position of the inside window
var totalWidth = MaxCups*objectWidth+(MaxCups+1)*offset;
var startX = (window.innerWidth-totalWidth)/2;
var startY = (window.innerHeight-totalWidth)/2;

// Initial position
graphics.moveTo(startX, startY);

// Cups & Bins position
var DynamicWidth = TotalCups * objectWidth + (TotalCups + 1) * offset; // a total width of cups depending on how many of them
var DynamicY; // would be increased depending on the number of cups
var y_centre = 300; // draw the round started at the centre of window
var FirstOutsideX = startX + objectWidth;
var FirstOutsideY = startY - offset + y_centre;
var FirstOutsidewidth = objectWidth + offset*4;
var FirstOutsideheight = DynamicWidth + offset*2;

var SecondOutsideX = startX + offset * 3 + objectWidth * 4;
var SecondOutsideY = startY - offset + y_centre;
var SecondOutsidewidth = objectWidth + offset*4
var SecondOutsideheight = DynamicWidth + offset*2;

var start_point = 150; // a start point of its inside round
var intervals = 170; // the space (up to down) between two cups/bins

var FirstInsideX = startX+offset*2+objectWidth*1;
var FirstInsidewidth = objectWidth;
var FirstInsideheight = objectWidth;

var SecondInsideX = startX+offset*5+objectWidth*4;
var SecondInsidewidth = objectWidth;
var SecondInsideheight = objectWidth;

function Drawbackground() {

    // Draw the area of scord board
    graphics.beginFill(0x00235d);
    graphics.drawRect(0, startY/2-objectWidth, window.innerWidth, window.innerHeight/7, 0);
    graphics.endFill();

    stage.addChild(graphics);
}

function GenerateRandomTexture(cups) {

    var C_Obj = [];
    var B_Obj = [];
    var C_Val = [];
    var B_Val = [];
    var res  = {};
    var rate = 0.5;

    for(var i = 0; i < cups; i++) {

        var random = Math.random();

        if (random < rate) {
            random = 1;
        } else {
            random = 0;
        }

        var cups_temp = new PIXI.Sprite.fromImage(CupsTexture[random][1]);
        var bins_temp = new PIXI.Sprite.fromImage(BinsTexture[random][1]);

        C_Obj.push(cups_temp);
        C_Val.push(random);
        B_Obj.push(bins_temp);
        B_Val.push(random);
    }

    res.c_objs = C_Obj;
    res.c_values = C_Val;
    res.b_objs = B_Obj;
    res.b_values = B_Val;

    return res;
}

function Drawcups(NumberOfCups) {

    var cups = NumberOfCups;

    if(cups < MinCups || cups > MaxCups) {
        throw new Error("invalidate the number of cups");
    } else {
        if(cups == 2) {
            DynamicY = 0;
        } else if (cups == 3) {
            DynamicY = 100;
        } else if (cups == 4 ) {
            DynamicY = 200;
        } else {
            DynamicY = 300;
        }
    }

    // Draw cups outside round rect
    graphics.beginFill(0x015b9c);
    graphics.drawRoundedRect(FirstOutsideX, FirstOutsideY-DynamicY, FirstOutsidewidth, FirstOutsideheight, 15);
    graphics.drawRoundedRect(SecondOutsideX, SecondOutsideY-DynamicY, SecondOutsidewidth, SecondOutsideheight, 15);
    graphics.endFill();

    // Draw cups inside round rect
    graphics.beginFill(0x00a0e4);
    for (var i = 0; i < cups; i++) {

        var __intervals = intervals * i;

        graphics.drawRoundedRect(FirstInsideX, start_point + __intervals + y_centre-DynamicY, FirstInsidewidth, FirstInsideheight, 10);

        graphics.drawRoundedRect(SecondInsideX, start_point + __intervals + y_centre-DynamicY, SecondInsidewidth, SecondInsideheight, 10);

    }
    graphics.endFill();

    stage.addChild(graphics);
}

function PutAllObjecs() {

    console.log("LOADER");

    for (var i = 0; i < TotalCups; i++ ) {

        var __intervals = intervals * i;

        CupsObjs[i].x = FirstInsideX;
        CupsObjs[i].y = start_point + __intervals + y_centre-DynamicY;
        stage.addChild(CupsObjs[i]);

        BinsObjs[i].x = SecondInsideX;
        BinsObjs[i].y = start_point + __intervals + y_centre-DynamicY;
        stage.addChild(BinsObjs[i]);

    }

    setInterval(function(){
        TotalTime++;
        TimeText.text = TotalTime;
    }, 1000);

}

function DrawSocreBoard() {

    scorelabelText.position.x = offset+3 * objectWidth;
    scorelabelText.position.y = startY/2 -objectWidth + window.innerHeight*2/21 +window.innerHeight/63;

    scoreText.position.x = offset+3*objectWidth + scorelabelText.width + offset;
    scoreText.position.y = startY/2-objectWidth+window.innerHeight*2/21+window.innerHeight/63;

    stage.addChild(scorelabelText);
    stage.addChild(scoreText);

}

function DrawTimeBoard() {

    TimelabelText.position.x = objectWidth/2;
    TimelabelText.position.y = startY/2-objectWidth+window.innerHeight*2/21+window.innerHeight/63;

    TimeText.position.x = objectWidth/2+TimelabelText.width+offset;
    TimeText.position.y = startY/2-objectWidth+window.innerHeight*2/21+window.innerHeight/63;

    stage.addChild(TimelabelText);
    stage.addChild(TimeText);
}

function DrawName() {

    var style = {
        font : '70px Arial',
        fill : 0xFFFFFF,
        align : 'center',
    };

    var GameNameText = new PIXI.Text('Coffee Cup Sort', style);

    GameNameText.x = objectWidth/2+offset;
    GameNameText.y = startY/3-objectWidth+window.innerHeight/14;

    stage.addChild(GameNameText);
}

function animate() {
    requestAnimationFrame(animate);

    // render the container
    renderer.render(stage);
}



function DrawThemes() {

    Drawbackground();

    Drawcups(TotalCups);

    loader.load(PutAllObjecs);

    DrawSocreBoard();

    DrawTimeBoard();

    DrawName();

    // render the container
    renderer.render(stage);
}

DrawThemes();
animate();
