let video;
let predictions = [];
let pixels = [];
let rectwidth =6;
let dotwidth = 50
let x = 200;
let move = 550

let brushCol;
let colourHolder;
let brushSize = 25;
let isColPal = false;
let backgroundCol;


function setup() {
  createCanvas(screenX, screenY);
  video = createCapture(VIDEO);
  video.size(width, height);
  print("loading")

  handpose = ml5.handpose(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("predict", function(results) {
    predictions = results;
  });

  createCanvas(600, 600);
  colorMode(HSB);
  frameRate(60);
  backgroundCol = color('white');
  background(backgroundCol);
  noStroke();
  colorMode(HSB, 360, 100, 100, 100);
  brushCol = color(0,0,0,50);
  colourHolder = brushCol;
  
  for (let i = 0; i < height; i += rectwidth) {
    for (let j = 0; j < width; j += rectwidth) {
      let holder = new Pixel(j, i, rectwidth);
      pixels.push(holder);
      
      } 
    } 


  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {


  // We can call both functions to draw all keypoints and the skeletons
  drawObject();

  colorMode(HSB);
  noStroke();
  

  if(mouseIsPressed&& !isColPal){
    fill(brushCol);
    circle(mouseX * -1,mouseY * -1, brushSize);
  }else if(isColPal){
    push();
    stroke(0,100,100,100);
    
    let h = map(mouseX,0,width,0,360);
    let b = map(mouseY,0,height,0,100);
    brushCol = color(h,100,b,50);
    colourHolder = brushCol;
    
    fill(brushCol);
    square(width*0.90, height*0.90, width*0.1);
    pop();
  }else if(!isColPal){
    push();
    stroke(0,100,100,100);
    fill(brushCol);
    square(width*0.90, height*0.90, width*0.1);
    pop();
  }
  
  //circle(x, y, 50);
  for(let i = 0; i<pixels.length; i++){
    pixels[i].show();
  }

}

function keyPressed(){
  if(key == 'x'){
    background('white');
  }else if(key == 'c'){
    isColPal = !isColPal;
  }else if(key == ']'){
    brushSize= brushSize+10;
  }else if(key == '[' && brushSize > 0){
    brushSize= brushSize-10;
  }else if(key =='e'){
    brushCol = backgroundCol;
  }else if(key == 'b'){
    brushCol = colourHolder;
  }
  
}

// A function to draw a ball at the tip of the fingers
function drawObject() {
  if (predictions.length > 0) {
    let prediction = predictions[0];
    //index finger
    let indexX = prediction.annotations.indexFinger[3][0]
    let indexY = prediction.annotations.indexFinger[3][1]
    //middle finger    
    let middleX = prediction.annotations.middleFinger[3][0]
    let middleY = prediction.annotations.middleFinger[3][1]
    //ring finger
    let ringX = prediction.annotations.ringFinger[3][0]
    let ringY = prediction.annotations.ringFinger[3][1]

    noStroke();


    // Bottom circle
    ellipse(round(indexX) , round(indexY), 33, 33);    // Top circle
  }
}


class Pixel {
  constructor(pixX, pixY, rectwidth, colour) {
    this.x = pixX;
    this.y = pixY;
    this.rectwidth = rectwidth;
    this.col = colour;  
    
  }
  
  show() {
    
    noStroke();
    colorMode(RGB);
    this.col = get(this.x + rectwidth/2 , this.y + rectwidth/2);
    fill(this.col);
    rect(this.x, this.y, this.rectwidth, this.rectwidth);
    
  }
  
  
}