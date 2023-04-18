// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
var imgIn;
var matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];

allFilters = []; // Step 5: empty array that will later on in the program will be populated with the filters

filterNumber = 0; // Step 5: filter number from the array

/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas((imgIn.width * 2), imgIn.height);
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgIn, 0, 0);
    image(earlyBirdFilter(imgIn), imgIn.width, 0);
    noLoop();
}
/////////////////////////////////////////////////////////////////
function mousePressed(){
  // Step 5: When the mouse is pressed inside the canvas, the filters applied to the second image are switching between them 
  filterNumber = (filterNumber + 1) % allFilters.length; 
  loop();
}
/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img){
  var resultImg = imgIn;
  
  // Step 5: The output image has applied on it the filter from the array allfilters. 
  // The filter applied will switch in between the filters from the array, based on mouse clicks inside the canvas
  resultImg = allFilters[filterNumber](resultImg);

  return resultImg;
}

function sepiaFilter(imgIn){ // Step 1: Implements the sepiaFilter() 
  var imgOut = createImage(imgIn.width, imgIn.height);

  imgOut.loadPixels();
  imgIn.loadPixels();

  for(var x=0; x<imgOut.width; x++){
      for(var y=0; y<imgOut.height; y++){
          var index = (y*imgOut.width + x) * 4;
          // Step 1: Turns the image into sepia
          var r = (imgIn.pixels[index + 0] * .393) + 
                  (imgIn.pixels[index + 1] *.769) +
                  (imgIn.pixels[index + 2] *.189);

          var g = (imgIn.pixels[index + 0] * .349) + 
                  (imgIn.pixels[index + 1] *.686) +
                  (imgIn.pixels[index + 2] *.168);
          
          var b = (imgIn.pixels[index + 0] * .272) + 
                  (imgIn.pixels[index + 1] *.534) +
                  (imgIn.pixels[index + 2] *.131);

          imgOut.pixels[index + 0] = r;
          imgOut.pixels[index + 1] = g;
          imgOut.pixels[index + 2] = b;
          imgOut.pixels[index + 3] = 255;
      }
  }

  imgOut.updatePixels();

  return imgOut; // Step 1: returns the resulting image
}

allFilters.push(sepiaFilter); // Step 5: pushes the filter to the array

function darkCorners(imgIn) {
  var resultImg = createImage(imgIn.width, imgIn.height);

  resultImg.loadPixels();
  imgIn.loadPixels();

  for(var x=0; x<resultImg.width; x++){
      for(var y=0; y<resultImg.height; y++){
          var index = (y*resultImg.width + x) * 4;

          index = constrain(index, 0, imgIn.pixels.length - 1); // Step 2: constrain() is used defensively to make sure that the pixel to be looking at is actually img.pixels.length minus 1
          
          var dynLum = 1; // Step 2: variable to hold the scaling that will be required for each channel

          // Step 2: If statements to adjust the luminosity/brightness of the pixel by scaling each colour channel

          if(dist(x, y, resultImg.width/2, resultImg.height/2) < 300) {
            // Step 2: we leave dynLum at 1
          }
          else if(dist(x, y, resultImg.width/2, resultImg.height/2) >= 300 && dist(x, y, resultImg.width/2, resultImg.height/2) < 450) {
            // Step 2: remaps the distance of each pixel to the new variable called dynLum
            dynLum = map(dist(x, y, imgIn.width/2, imgIn.height/2), 300, 450, 1, 0.4);
          }
          else if(dist(x, y, resultImg.width/2, resultImg.height/2) > 450) {
            // Step 2: remaps the distance of each pixel to the new variable called dynLum
            dynLum = map(dist(x, y, imgIn.width/2, imgIn.height/2), 450, imgIn.width, 0.4, 0);
          }
          resultImg.pixels[index + 0] = imgIn.pixels[index + 0] * dynLum;
          resultImg.pixels[index + 1] = imgIn.pixels[index + 1] * dynLum;
          resultImg.pixels[index + 2] = imgIn.pixels[index + 2] * dynLum;
          resultImg.pixels[index + 3] = 255;
      }
  }
   resultImg.updatePixels();

   return resultImg;
}

allFilters.push(darkCorners);  // Step 5: pushes the filter to the array

function radialBlurFilter(imgIn){
  var resultImg = createImage(imgIn.width, imgIn.height);

  var matrixSize = matrix.length;

  resultImg.loadPixels();
  imgIn.loadPixels();

  for(var x=0; x<resultImg.width; x++){
      for(var y=0; y<resultImg.height; y++){
          var index = (y*resultImg.width + x) * 4;

          var r = imgIn.pixels[index + 0];
          var g = imgIn.pixels[index + 1];
          var b = imgIn.pixels[index + 2];

          var c = convolution(x, y, matrix, matrixSize, imgIn);

          // Step 3: dynBlur is a value generated using the distance from the mouse
          // Step 3: constrains the returned value from 0 to 1 with the boolean from the map function
          var dynBlur = map(dist(x, y, mouseX, mouseY), 100, 300, 0, 1, true);

          // Step 3: c[0] is the red channel returned from the convolution, r / g / b are the channels in the original image
          resultImg.pixels[index + 0] = c[0]*dynBlur + r*(1-dynBlur);
          resultImg.pixels[index + 1] = c[1]*dynBlur + g*(1-dynBlur);
          resultImg.pixels[index + 2] = c[2]*dynBlur + b*(1-dynBlur);
          resultImg.pixels[index + 3] = 255;
      }
  }

  resultImg.updatePixels();

  return resultImg;
}

function convolution(x, y, matrix, matrixSize, resultImg){

  var totalRed = 0;
  var totalGreen = 0;
  var totalBlue = 0;

  var offset = floor(matrixSize / 2);

  for(var i=0; i<matrixSize; i++){
      for(var j=0; j<matrixSize; j++){
          var xloc = x + i - offset;
          var yloc = y + j - offset;

          var index = (resultImg.width * yloc + xloc) * 4;

          index = constrain(index, 0, resultImg.pixels.length - 1);

          totalRed += resultImg.pixels[index + 0] * matrix[i][j]; 
          totalGreen += resultImg.pixels[index + 1] * matrix[i][j]; 
          totalBlue += resultImg.pixels[index + 2] * matrix[i][j]; 
      }
  }

  return[totalRed, totalGreen, totalBlue];
}

allFilters.push(radialBlurFilter);  // Step 5: pushes the filter to the array

function borderFilter(imgIn) {
  imgIn.loadPixels();

  // Step 4: Local buffer of the same size as the input image
  buffer = createGraphics(imgIn.width, imgIn.height);

  // Step 4: Draws the input impage onto the buffer
  buffer.image(imgIn, 0, 0);

  // Step 4: Draws the rectangle with rounded corners around the image
  buffer.noFill();
  buffer.strokeWeight(20); // the strokeWeight is adapted to make sure that the first rectangle is creating the border and that the second rectangle is getting rid of the little triangles from the corners
  buffer.stroke(255); 

  buffer.rect(0, 0, buffer.width, buffer.height, 50);

  // Step 4: Draws a second rectangle without rounded corners around the image
  buffer.rect(0, 0, buffer.width, buffer.height);

  return buffer; // Step 4: Returns the buffer at the end of the function
}

allFilters.push(borderFilter);  // Step 5: pushes the filter to the array