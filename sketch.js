var num = 3; 
var springs = [];
var hwidth = innerWidth/2;
var hheight = innerHeight/2;

var dimensions;
var position;
var canvasColor;
var studio;

var offsetX = 100;
function setup() {
    position = createVector(offsetX, 0);
    dimensions = createVector(innerWidth, innerHeight-4);
    canvasColor = color(255, 255, 255);
                        //position, dimension, loop, clear, color
    studio = new Studio(position, dimensions, false, false, canvasColor)
    studio.set();
}

function draw() {
    studio.render();
}

/*function rectangle(numb){
    beginShape();
    vertex(hwidth, hheight)
    vertex(hwidth+numb, hheight)
    vertex(hwidth+numb, hheight+numb)
    vertex(hwidth, hheight+numb)
    endShape(CLOSE);
}

function polygon(x, y, radius, npoints) {
  var angle = TWO_PI / npoints;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}*/