var Canvas;

var load = 0;

var mode = 0;
var chord = 0;

var mousecheck = 0;

var newCircle = [];
var newArrow = [];

function Circle(x, y, d, col){

   this.display = function(){

      colorMode(HSB);
      fill(col, 255, 255);

      colorMode(RGB);
      strokeWeight(4);
      stroke(255, 255, 255);

      ellipse(x,y,d,d);
   }
}

function Arrow(xfrom, yfrom, xto, yto){

   var len = 20;
   var angle = Math.abs(Math.atan2(yto - yfrom, xto - xfrom));

   this.display = function(){

      colorMode(RGB);
      strokeWeight(4);
      stroke(255, 255, 255);

      line(xfrom, yfrom, xto, yto);

      if(yto <= yfrom){
         line(xto, yto, xto-len*Math.sin(Math.PI/3-angle), yto+len*Math.cos(Math.PI/3-angle));
         line(xto, yto, xto-len*Math.cos(angle-Math.PI/6), yto+len*Math.sin(angle-Math.PI/6));         
      }

      else{
         line(xto, yto, xto-len*Math.sin(Math.PI/3-angle), yto-len*Math.cos(Math.PI/3-angle));
         line(xto, yto, xto-len*Math.cos(angle-Math.PI/6), yto-len*Math.sin(angle-Math.PI/6));         
      }

   }

}

/* time */
dt = 0.02;

/* particles information */
var x = [];
var xnew;

var y = [];
var ynew;

var vx = [];
var vxnew;

var vy = [];
var vynew;

var ax = [];
var axnew = 0;

var ay = [];
var aynew = 0;

var m = [];
var mnew;

var pcolor = []; // colors of particles
var pcolornew;

/* oscillators */
var osc = [];
var oscnew;

/* UIs */
var guitarButton;
var oscButton;
var resetButton;

var volumeSlider;
var volumeP;

var gravitySlider;
var gravityP;

var loadP;

var tutorP;
var nameP;

/* guitar notes */
var guitar = [[],[[],[],[],[],[],[],[]],[[],[],[],[],[],[],[]],[[],[],[],[],[],[],[]],[[],[],[],[],[],[],[]]];
var guitarnew = [[],[],[],[],[]];


function windowResized(){

      Canvas.position(0.5*windowWidth-0.5*width, 0.5*windowHeight-0.5*height-30-18);
   TitleP.position(0.5*windowWidth-0.5*width+97 , 0.5*windowHeight-0.5*height -30 - 100 -18);
   guitarButton.position(0.5*windowWidth-0.5*width, 0.5*windowHeight+0.5*height-20);
   oscButton.position(0.5*windowWidth-0.5*width+100, 0.5*windowHeight+0.5*height-20);
   resetButton.position(0.5*windowWidth-0.5*width+215, 0.5*windowHeight+0.5*height-20);
   volumeP.position(0.5*windowWidth-0.5*width+337, 0.5*windowHeight+0.5*height-10-20);
   volumeSlider.position(0.5*windowWidth-0.5*width+407, 0.5*windowHeight+0.5*height+9-20);      
   gravityP.position(0.5*windowWidth-0.5*width+337, 0.5*windowHeight+0.5*height+27-20);
   gravitySlider.position(0.5*windowWidth-0.5*width+407, 0.5*windowHeight+0.5*height+47-20);
   loadP.position(0.5*windowWidth-58+19, 0.5*windowHeight-80);   
   tutorP.position(0.5*windowWidth-0.5*width-89, 0.5*windowHeight+0.5*height+75-18);
   nameP.position(0.5*windowWidth-0.5*width+97, 0.5*windowHeight+0.5*height+101-18);

}



function setup() {

   Canvas = createCanvas(1200*0.5, 700*0.6);
      Canvas.style('z-index',-1);
      background(0);
      Canvas.position(0.5*windowWidth-0.5*width, 0.5*windowHeight-0.5*height-30-18);


   /* Title */
   TitleP = createP('The Music of Gravitational Field');
   TitleP.position(0.5*windowWidth-0.5*width+97 , 0.5*windowHeight-0.5*height -30 - 100 -18);
   TitleP.style('font-family', 'Fjalla One');
   TitleP.style('font-size', '25pt')


   /* User Interactions */
   Canvas.mousePressed(drawCircle);

   /* Mode Change Buttons */
   guitarButton = createButton("Guitar");
   guitarButton.size(100,70);
   guitarButton.position(0.5*windowWidth-0.5*width, 0.5*windowHeight+0.5*height-20);
   guitarButton.style('font-family', 'Roboto');
   guitarButton.style('font-size', '11pt');
   guitarButton.style('color', 'green');

   guitarButton.mousePressed(guitarMode);


   oscButton = createButton("Oscilloator");
   oscButton.size(100,70);
   oscButton.position(0.5*windowWidth-0.5*width+100, 0.5*windowHeight+0.5*height-20);
   oscButton.style('font-family', 'Roboto');
   oscButton.style('font-size', '11pt');

   oscButton.mousePressed(oscMode);


   resetButton = createButton("Reset");
   resetButton.size(100,70);
   resetButton.position(0.5*windowWidth-0.5*width+215, 0.5*windowHeight+0.5*height-20);
   resetButton.style('font-family', 'Roboto');
   resetButton.style('font-size', '11pt');

   resetButton.mousePressed(resetParticles);


   /* UI sliders */
   volumeP = createP("Volume:");
   volumeP.position(0.5*windowWidth-0.5*width+337, 0.5*windowHeight+0.5*height-10-20);
   volumeP.style('font-family', 'Roboto');

   volumeSlider = createSlider(0, 1, 0.7, 0.01);
   volumeSlider.position(0.5*windowWidth-0.5*width+407, 0.5*windowHeight+0.5*height+9-20);
   volumeSlider.size(191, 10);

   gravityP = createP("Gravity:");
   gravityP.position(0.5*windowWidth-0.5*width+337, 0.5*windowHeight+0.5*height+27-20);
   gravityP.style('font-family', 'Roboto');

   gravitySlider = createSlider(0, 1, 0.7, 0.01);
   gravitySlider.position(0.5*windowWidth-0.5*width+407, 0.5*windowHeight+0.5*height+47-20);
   gravitySlider.size(191, 10);

   loadP = createP("Loading...");
   loadP.position(0.5*windowWidth-58+19, 0.5*windowHeight-80);
   loadP.style('font-family', 'Roboto');
   loadP.style('color', 'white');
   loadP.style('font-size', '16pt');
   loadP.hide();

   tutorP = createP("Tutorial: 1) Click on the Black Space. 2) Drag and Release Your Mouse. 3) Repeat. Now You Know How It Woks.");
   tutorP.style('font-family', 'Roboto');
   tutorP.position(0.5*windowWidth-0.5*width-89, 0.5*windowHeight+0.5*height+75-18);


   nameP = createP("Soohyun Kim, Dec 11th, 2017.  Contact: tn456963@kaist.ac.kr");
   nameP.position(0.5*windowWidth-0.5*width+97, 0.5*windowHeight+0.5*height+101-18);
   nameP.style('font-family', 'Roboto');


   /* chord change */
   setTimeout(chordChange, 4000);

}


function guitarLoad() {

   load += 1;

   if(load%24 == 0){

      for(var i=1; i<=4; i++){
         for(var j=1; j<=6; j++){
            guitar[i][j].push(guitarnew[i][j]);
         }
      }   

   }

}


function chordChange() {

   chord += 1;
   chord %= 4;

//   console.log(chord);

   setTimeout(chordChange, 4000);

}


///////////////////////
/* User Interactions */
///////////////////////


/* Button Interactions */

function guitarMode() {

   mode = 0;
   guitarButton.style('color', 'green');
   oscButton.style('color', 'black');

   for(var i = 0; i<osc.length; i++)
      osc[i].amp(0,0.2);

}


function oscMode() {

   mode = 1;
   oscButton.style('color', 'green');
   guitarButton.style('color', 'black');
   

   for(var i = 1; i<7; i++){
      for(var j=0; j<guitar[chord+1][i].length; j++){
         guitar[chord+1][i][j].setVolume(0,0.2);
      }
   }

}

function resetParticles() {

   if(load%24 == 0){

      x.splice(0, x.length);
      y.splice(0, y.length);

      vx.splice(0, vx.length);
      vy.splice(0, vy.length);

      ax.splice(0, ax.length);
      ay.splice(0, ay.length);

      m.splice(0, m.length);   

      pcolor.splice(0, pcolor.length);

      for(var i = 0; i<osc.length; i++)
         osc[i].amp(0,0.2);

      osc.splice(0, osc.length);


   }

}


/* Canvas Interaction */

function drawCircle() {

   if(load%24 == 0){
      xnew = mouseX;
      ynew = mouseY;

      mnew = random(10, 40);

      pcolornew = random(0, 359);

      c = new Circle(xnew, ynew, mnew, pcolornew);
      newCircle.push(c);

      mousecheck = 1;
   }
}


function mouseDragged() {

   if(load%24 == 0){

      if(mousecheck == 1){

         newArrow.splice(0, 1);

         if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){

            a = new Arrow(xnew, ynew, mouseX, mouseY);
            newArrow.push(a);

            vxnew = mouseX - xnew;
            vynew = mouseY - ynew;

         }

         else{
            vxnew = 0;
            vynew = 0;
         }

      }

   }



}


function mouseReleased() {

   if(load%24 == 0){

      if(mousecheck == 1){

         newCircle.splice(0, 1);
         newArrow.splice(0, 1);

         if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){

            x.push(xnew);
            y.push(ynew);

            vx.push(vxnew);
            vy.push(vynew);

            ax.push(axnew);
            ay.push(aynew);

            m.push(mnew);

            pcolor.push(pcolornew);

            /* osc generating */
            oscnew = new p5.Oscillator();
            osc.push(oscnew);
            osc[osc.length-1].start();
            osc[osc.length-1].amp(0);

            /* guitar notes */
            guitarnew[1][1] = loadSound('guitar11.wav', guitarLoad);
            guitarnew[1][2] = loadSound('guitar12.wav', guitarLoad);
            guitarnew[1][3] = loadSound('guitar13.wav', guitarLoad);
            guitarnew[1][4] = loadSound('guitar14.wav', guitarLoad);
            guitarnew[1][5] = loadSound('guitar15.wav', guitarLoad);
            guitarnew[1][6] = loadSound('guitar16.wav', guitarLoad);

            guitarnew[2][1] = loadSound('guitar21.wav', guitarLoad);
            guitarnew[2][2] = loadSound('guitar22.wav', guitarLoad);
            guitarnew[2][3] = loadSound('guitar23.wav', guitarLoad);
            guitarnew[2][4] = loadSound('guitar24.wav', guitarLoad);
            guitarnew[2][5] = loadSound('guitar25.wav', guitarLoad);
            guitarnew[2][6] = loadSound('guitar26.wav', guitarLoad);

            guitarnew[3][1] = loadSound('guitar31.wav', guitarLoad);
            guitarnew[3][2] = loadSound('guitar32.wav', guitarLoad);
            guitarnew[3][3] = loadSound('guitar33.wav', guitarLoad);
            guitarnew[3][4] = loadSound('guitar34.wav', guitarLoad);
            guitarnew[3][5] = loadSound('guitar35.wav', guitarLoad);
            guitarnew[3][6] = loadSound('guitar36.wav', guitarLoad);

            guitarnew[4][1] = loadSound('guitar41.wav', guitarLoad);
            guitarnew[4][2] = loadSound('guitar42.wav', guitarLoad);
            guitarnew[4][3] = loadSound('guitar43.wav', guitarLoad);
            guitarnew[4][4] = loadSound('guitar44.wav', guitarLoad);
            guitarnew[4][5] = loadSound('guitar45.wav', guitarLoad);
            guitarnew[4][6] = loadSound('guitar46.wav', guitarLoad);    

         }


         mousecheck = 0;
      }


   }


}



function draw() {

   background(0);

   if(load%24 == 0 || load == 0)
      loadP.hide();
   else
      loadP.show();


   if(mode == 0){

      colorMode(RGB);
      stroke(255, 255, 255);

      strokeWeight(1);
      line(0, 60, width, 60);

      strokeWeight(2);
      line(0, 120, width, 120);            

      strokeWeight(3);
      line(0, 180, width, 180);   

      strokeWeight(4);
      line(0, 240, width, 240);   

      strokeWeight(5);
      line(0, 300, width, 300);   

      strokeWeight(6);
      line(0, 360, width, 360);  

   }

   /* draw a new Circle */
   for(var i=0; i<newCircle.length; i++)
      newCircle[i].display();

   /* draw a new Arrow */
   for(var i=0; i<newArrow.length; i++)
      newArrow[i].display();

   /* draw the current particles */
   for(var i=0; i<x.length; i++){

      ax[i] = 0;
      ay[i] = 0;

      for(var j=0; j<x.length; j++){

         if(j != i){

            var dist = Math.pow(Math.hypot(x[j]-x[i]+20,y[j]-y[i])+20,2);

            ax[i] += (1000*m[j]*(x[j]-x[i])*gravitySlider.value())/(dist*0.7);
            ay[i] += (1000*m[j]*(y[j]-y[i])*gravitySlider.value())/(dist*0.7);

         }
      }

      vx[i] += ax[i] * dt;
      vy[i] += ay[i] * dt;

      var yold = y[i];

      var xtemp = x[i] + vx[i] * dt
      var ytemp = y[i] + vy[i] * dt

      /* Collision */

      if(xtemp < (m[i]/2) || xtemp > (width-(m[i]/2)))
         vx[i] = -vx[i];

      if(ytemp < (m[i]/2) || ytemp > (height-(m[i]/2)))
         vy[i] = -vy[i];



      x[i] += vx[i] * dt;
      y[i] += vy[i] * dt;


      colorMode(HSB);
      fill(pcolor[i], 255, 255);

      colorMode(RGB);
      strokeWeight(4);
      stroke(255, 255, 255);

      ellipse(x[i],y[i],m[i],m[i]);


      /* Volume Setting */
      var volmax = volumeSlider.value();
      var vol = map(m[i], 10, 40, volmax/4, volmax);

      vol *= Math.hypot(vx[i],vy[i])/700;

      if(vol > 1){
         vol = 1;
      }

      /* Pan Setting */
      var pan = map(x[i], 0, width, -1, 1);


      /* Guitar Mode */
      if(mode == 0){

         for(var j=1; j<=6; j++){

            if((i+1)<=(load/24)){

               if(((yold<=(60*j)) && (y[i] > (60*j))) || ((yold>=(60*j)) && (y[i]<(60*j)))){

//                  guitar[chord+1][j][i].setVolume(0);
                  guitar[chord+1][j][i].pan(pan);
                  guitar[chord+1][j][i].play();               
                  guitar[chord+1][j][i].setVolume(vol);

               }

            }
         }

      }


      /* Osc Mode */
      if(mode == 1){

         osc[i].amp(vol/3);

         var oscfreq = map(y[i], 0, height, 700, 100);

         osc[i].freq(oscfreq);

         osc[i].pan(pan);   
                     
      }

   }
         



}
