// which will try to choose the best renderer for the environment you are in.
var renderer = new PIXI.CanvasRenderer(window.innerWidth, window.innerHeight)

// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();

// create the graphics objects for drawing primitive shapes
var graphics = new PIXI.Graphics();

// Offset of each block
var offset = 35;

// Basic settings
var MinCups = 2;
var MaxCups = 6;
var objectWidth = 135;

// Record previous click and count click times
var preClick;
var clickCount = 0;

// Timer and Score
var totalTime = 0;
var totalScore = 0;

// Preload the cups and bins
var resourcePath = "public/imgs/";
var textureArray = [['material1', resourcePath+'g1.png'], ['material2', resourcePath+'g2.png']];
var textureRubArray = [['material3', resourcePath+'g3.png'], ['material4', resourcePath+'g4.png']];

for (var i = 0; i < textureArray.length; i++) {
    PIXI.loader.add(textureArray[i][0], textureArray[i][1]);
};

// Position of the inside window
var totalWidth = MaxCups*objectWidth+(MaxCups+1)*offset;
var startX = (window.innerWidth-totalWidth)/2;
var startY = (window.innerHeight-totalWidth)/2;

// Initial position
graphics.moveTo(startX, startY);

function drawbackground() {

    // set background's color
    renderer.backgroundColor = 0x00a0e4;

    // Draw the area of scord board
    graphics.beginFill(0x00235d);
    graphics.drawRect(0, startY/2-objectWidth, window.innerWidth, window.innerHeight/7, 0);
    graphics.endFill();

    stage.addChild(graphics);
}

function drawcups(NumberOfCups) {

    var cups = NumberOfCups;
    var DynamicWidth = cups*objectWidth+(cups+1)*offset; // a total width of cups depending on how many of them
    var DynamicY; // would be increased depending on the number of cups
    var y_centre = 300; // draw the round started at the centre of window

    var FirstOutsideX = startX+objectWidth;
    var FirstOutsideY = startY-offset+y_centre;
    var FirstOutsidewidth = objectWidth+offset*4;
    var FirstOutsideheight = DynamicWidth+offset*2;

    var SecondOutsideX = startX+offset*3+objectWidth*4;
    var SecondOutsideY = startY-offset+y_centre;
    var SecondOutsidewidth = objectWidth+offset*4
    var SecondOutsideheight = DynamicWidth+offset*2;

    var FirstInsideX = startX+offset*2+objectWidth*1;
    var FirstInsidewidth = objectWidth;
    var FirstInsideheight = objectWidth;

    var SecondInsideX = startX+offset*5+objectWidth*4;
    var SecondInsidewidth = objectWidth;
    var SecondInsideheight = objectWidth;

    if(cups < MinCups || cups > MaxCups) {
        console.error("invalidate the number of cups");
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
    for (var i = 0; i < cups * 2; i++){
        if(i % 2 == 0){
            graphics.drawRoundedRect(FirstInsideX, (startY+offset*((i/2)+1)+objectWidth*((i/2)))+y_centre-DynamicY, FirstInsidewidth, FirstInsideheight, 10);
        }else{
            graphics.drawRoundedRect(SecondInsideX, (startY+offset*(((i-1)/2)+1)+objectWidth*(((i-1)/2)))+y_centre-DynamicY, SecondInsidewidth, SecondInsideheight, 10);
        }
    }
    graphics.endFill();

    stage.addChild(graphics);
}

function DrawSocreBoard() {

    var lablestyle = {
        font : '30px Arial',
        fill : 0xFFFFFF,
        align : 'center'
    };

    var scorelabelText = new PIXI.Text('Score:', lablestyle);
    var scoreText = new PIXI.Text(totalScore, lablestyle);

    scorelabelText.position.x = offset+3 * objectWidth;
    scorelabelText.position.y = startY/2 -objectWidth + window.innerHeight*2/21 +window.innerHeight/63;

    scoreText.position.x = offset+3*objectWidth + scorelabelText.width + offset;
    scoreText.position.y = startY/2-objectWidth+window.innerHeight*2/21+window.innerHeight/63;

    stage.addChild(scorelabelText);

    stage.addChild(scoreText);

}


function animate() {

    drawbackground();

    drawcups(2);

    DrawSocreBoard();

    requestAnimationFrame(animate);

    // render the container
    renderer.render(stage);
}

// start animating
animate();
