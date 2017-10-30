var Canvas;

var song = 0;
var songchange = 0;
var timeSliderchange = 0;

var sound;

var amp;
var volhistory = [];
var volhistory_space = [];

var fft;
var fft_rate = 256;

/* Instructions */
var TitleP;
var TutorP;
var NameP;

/* UIs */
var Drop; //File Drop Zone

var playButton;
var stopButton;

var timeP;
var timeSlider;

var volP;
var volSlider;

var speedP;
var speedSlider;


var mode = 0;

var t = 0; //time
var rate = 1;


/* Images */
var space_img;
var sun_space_img;
var earth_space_img;
var moon_space_img;

var day_img;
var sun_day_img;

var night_img;
var moon_night_img;

var ship_img;



/* Physical Variables*/

/* for Space */
var sun_diam = 250;
var earth_diam = 200;
var moon_diam = 50;
var r = 240; //moon orbit radius
var earth_dist = 0.68;


/* for day and night */
var sky_sun_diam = 250;
var sky_moon_diam = sky_sun_diam*0.75;

var ship_diam = 50;



function windowResized(){
   
   	Canvas.position(0.4*windowWidth-0.5*width, 0.5*windowHeight-0.5*height);
	TitleP.position(0.4*windowWidth-0.5*width+10 , 0.5*windowHeight-0.5*height - 87);
	TutorP.position(0.4*windowWidth-0.5*width
					, 0.5*windowHeight+0.5*height+5);
	NameP.position(0.4*windowWidth-0.5*width
				, 0.5*windowHeight+0.5*height+30);
 	Drop.position(0.4*windowWidth+0.5*width+30, 0.5*windowHeight-0.5*height-16);
 	playButton.position(0.4*windowWidth+0.5*width+30
			,0.5*windowHeight-0.5*height+148+50);
	stopButton.position(0.4*windowWidth+0.5*width+30+134+10
			,0.5*windowHeight-0.5*height+148+50);
	timeP.position(0.4*windowWidth+0.5*width+30
				,0.5*windowHeight-0.5*height+148+50+60);

	if(timeSliderchange != 0)
	{
		timeSlider.position(0.4*windowWidth+0.5*width+30
					,0.5*windowHeight-0.5*height+148+50+60+60);		
	}

	volP.position(0.4*windowWidth+0.5*width+30
				,0.5*windowHeight-0.5*height+148+50+60+60+50);
	volSlider.position(0.4*windowWidth+0.5*width+30
				,0.5*windowHeight-0.5*height+148+50+60+60+50+60);
	speedP.position(0.4*windowWidth+0.5*width+30
				,0.5*windowHeight-0.5*height+148+50+60+50+50+60+50);
	speedSlider.position(0.4*windowWidth+0.5*width+30
				,0.5*windowHeight-0.5*height+148+50+60+60+50+60+50+60);	

}

function setup() { 
   	Canvas = createCanvas(1200*0.8, 700*0.8);
   	Canvas.style('z-index',-1);
   	background(0);
   	Canvas.position(0.4*windowWidth-0.5*width, 0.5*windowHeight-0.5*height);

   	angleMode(DEGREES);

   	song = loadSound('song.mp3', gotReady);

   	amp = new p5.Amplitude();
   	fft = new p5.FFT(0.9, fft_rate);
   
   /* This is for test */
//	var P = createP("test");
// 	P.mouseClicked(modeChange);
// 	P.size(200,200);
// 	P.style('border-style','dashed');
// 	P.style('z-index',0);


	/* Title */
	TitleP = createP('Space Full of Music');
	TitleP.position(0.4*windowWidth-0.5*width+10 , 0.5*windowHeight-0.5*height - 87);
	TitleP.style('font-family', 'Fjalla One');
	TitleP.style('font-size', '25pt')

	/* Tutorial */
	TutorP = createP("Tutorial: 1) Click the Earth. 2) Click the Sun. 3) Click the Moon or the Space Ship. Now You Know How It Woks.")
	TutorP.position(0.4*windowWidth-0.5*width
					, 0.5*windowHeight+0.5*height+4);
	TutorP.style('font-family', 'Roboto');

	/* Name */

	NameP = createP("Kim Soohyun, 2017.10.30.  Contact: tn456963@kaist.ac.kr");
	NameP.position()
	NameP.position(0.4*windowWidth-0.5*width
					, 0.5*windowHeight+0.5*height+30);
	NameP.style('font-family', 'Roboto');

 	/* Sound File Drop Zone */
 	Drop = createP("Drag your music file here (This is incomplete. Just press the play button. Use the sample music.)");
 	Drop.position(0.4*windowWidth+0.5*width+30, 0.5*windowHeight-0.5*height-16);
 	Drop.size(200, 100);
 	//Drop.style('font-size', '22pt');
	Drop.style('border-style','dashed');
	Drop.style('padding','24pt');
	Drop.style('font-family', 'Roboto');

	Drop.dragOver(highlight);
	Drop.dragLeave(unhighlight);

	Drop.drop(gotFile, fileLoad);


	/* Play and Stop Buttons */
	playButton = createButton("Loading");
	playButton.size(125,50);
	playButton.position(0.4*windowWidth+0.5*width+30
			,0.5*windowHeight-0.5*height+148+50);
	playButton.style('font-family', 'Roboto');

	playButton.mousePressed(togglePlaying);

	stopButton = createButton("Loading");
	stopButton.size(125,50);
	stopButton.position(0.4*windowWidth+0.5*width+30+134+10
			,0.5*windowHeight-0.5*height+148+50);
	stopButton.style('font-family', 'Roboto');

	stopButton.mousePressed(stopPlaying);


	/* Sliders */
	timeP = createP("CurrentTime:");
	timeP.position(0.4*windowWidth+0.5*width+30
				,0.5*windowHeight-0.5*height+148+50+60);
	timeP.style('font-family', 'Roboto');

	volP = createP("Volume:");
	volP.position(0.4*windowWidth+0.5*width+30
				,0.5*windowHeight-0.5*height+148+50+60+60+50);
	volP.style('font-family', 'Roboto');

	volSlider = createSlider(0,1,0.5,0.01);
	volSlider.size(269, 10);
	volSlider.position(0.4*windowWidth+0.5*width+30
				,0.5*windowHeight-0.5*height+148+50+60+60+50+60);

	speedP = createP("Speed:");
	speedP.position(0.4*windowWidth+0.5*width+30
				,0.5*windowHeight-0.5*height+148+50+60+50+50+60+50);
	speedP.style('font-family', 'Roboto');

	speedSlider = createSlider(0.5,2,1,0.1);
	speedSlider.size(269, 10);
	speedSlider.position(0.4*windowWidth+0.5*width+30
				,0.5*windowHeight-0.5*height+148+50+60+60+50+60+50+60);

	speedSlider.input(updaterate);


   	/*Setting images*/
   	space_img=createImg("space.png");
   	space_img.hide();

   	sun_space_img=createImg("sun_space.png");
   	sun_space_img.hide();

   	earth_space_img=createImg("earth_space.png");
   	earth_space_img.hide();

   	moon_space_img=createImg("moon_space.png");
   	moon_space_img.hide();


   	day_img = createImg("day.png");
   	day_img.hide();

   	sun_day_img = createImg("sun_day.png");
   	sun_day_img.hide();


   	night_img = createImg("night.png");
	night_img.hide();

   	moon_night_img = createImg("moon_night.png");
   	moon_night_img.hide();

   	ship_img = createImg("ship.png");
   	ship_img.hide();

}


function gotReady(){

	playButton.html('play');
	stopButton.html('stop');

}


function updaterate(){
	rate = speedSlider.value();
}


///////////////////////////////////
//// File Get and Play Section ////
///////////////////////////////////

function highlight(){

	Drop.style('background-color','#ccc');
	Drop.html('Drop It!!!');

}

function unhighlight(){

	Drop.style('background-color','#fff');
	Drop.html('Drag your music file here');

}

function fileLoad(){


	Drop.style('background-color','#ccc');
	Drop.html('Loading...');

}

function gotFile(file){

	Drop.style('background-color','#fff');
	Drop.html(file.name);

}


function togglePlaying(){


	if(!song.isPlaying()){ //song is not playing

		playButton.html('pause');
		song.play();
//		console.log('song is played');

		if(songchange == 0)
		{

			if(timeSliderchange != 0){
				timeSlider.remove();				
			}

			timeSlider = createSlider(0, song.duration() ,0, 0.1);
//			console.log(song.duration());
			timeSlider.size(269, 10);
			timeSlider.position(0.4*windowWidth+0.5*width+30
					,0.5*windowHeight-0.5*height+148+50+60+60);

			timeSliderchange++;	

			amp.setInput(song);
		
		}

		songchange ++;
	}

	else{ //song is playing

		playButton.html('play');
		song.pause();
//		console.log('song is paused');

	}


}


function stopPlaying(){

	playButton.html('play');
	song.jump(0);
	song.stop();
//	console.log('song is stopped');
}



///////////////////////////////////
//// Mouse Interaction Section ////
///////////////////////////////////

/* Mouse Click Control */

function mouseReleased(){

	if(mode == 0){

		space_clicked();
	}

	if(mode == 1){

		day_clicked();
	}

	if(mode == 2){

		night_clicked();
	}
}


function space_clicked(){

  	var earth_cen_x = earth_dist*width;
  	var earth_cen_y = 0.5*height;

  	var d = dist(mouseX, mouseY, earth_cen_x, earth_cen_y);

	if(d < 0.5*earth_diam){
		
		mode = 1;

		mouseX = -1;
		mouseY = -1;

	}

}

function day_clicked(){

	var d = dist(mouseX, mouseY, 0.5*width, 0);

	if(d < 0.5*sky_sun_diam && mouseY > 0){

		mode = 2;

		mouseX = -1;
		mouseY = -1;
	}

	if(d > 0.5*sky_sun_diam && mouseX > 0 && mouseX < width 
		&& mouseY > 0 && mouseY < height){

		mode = 0;

		mouseX = -1;
		mouseY = -1;
		
	}	


}

function night_clicked(){

	var d = dist(mouseX, mouseY, 0.5*width, 0);

	if(d < 0.5*sky_moon_diam && mouseY > 0){

		mode = 1;

		mouseX =0;
		mouseY =0;
	}

	if(d > 0.5*sky_moon_diam && mouseX > 0 && mouseX < width 
		&& mouseY > 0 && mouseY < height){

		mode = 0;

		mouseX = -1;
		mouseY = -1;
		
	}	

}


/* MouseMove Control */

function mouseMoved(){

	if(mode == 0){		
		space_moved();
	}

	if(mode == 1){
		day_moved();
	}

	if(mode == 2){
		night_moved();
	}

}


function space_moved(){

	var earth_cen_x = earth_dist*width;
  	var earth_cen_y = 0.5*height;

  	var d = dist(mouseX, mouseY, earth_cen_x, earth_cen_y);

 	if(d < 0.5*earth_diam){
		
		earth_diam = 250;
	}

	else{

		earth_diam = 200;
	}


}

function day_moved(){

	var d = dist(mouseX, mouseY, 0.5*width, 0);

	if(d < 0.5*sky_sun_diam && mouseY > 0){

		sky_sun_diam = 300;
	}

	else{

		sky_sun_diam = 250;
	}
}


function night_moved(){

	var d = dist(mouseX, mouseY, 0.5*width, 0);

	if(d < 0.5*sky_moon_diam && mouseY > 0){

		sky_moon_diam = 250*0.75 + 50;
	}

	else{

		sky_moon_diam = 250*0.75;
	}

}

/* This is for test */
function modeChange() {

	mode = mode+1;
	mode = mode%3;
}


function draw() {


	if(songchange != 0){

		/* Time Slider */
		timeSlider.value(song.currentTime())
		timeP.html('CurrentTime: '+ int(song.currentTime()/60) +':'
					+ int(song.currentTime()%60));

		/* Volume Slider */		
		song.setVolume(volSlider.value());
		volP.html('Volume: ' + volSlider.value());

		/* Speed Slider */
		song.rate(speedSlider.value());
		speedP.html('Speed: '+speedSlider.value());

		if(!song.isPlaying() && song.currentTime() == 0){

			playButton.html("play");

		}


	}


	var vol = amp.getLevel();
	volhistory_space.push(vol);
	volhistory.push(vol);

	var spectrum = fft.analyze();

	if(mode == 0){	//space

		colorMode(RGB);

		background(0);

		/* background */
 	  	image(space_img,0,0,width,height);


 	  	/* sunlight of the sun*/
 	  	noStroke();
 	  	fill(243,171,0);


 	  	beginShape();

 	  	for(var i = 22; i<spectrum.length-22; i++){

 	  		var angle = map(i, 22,spectrum.length-22, 0, 180);
 	  		var spec_space = spectrum[i];

 	  		var light = map(spec_space, 0, fft_rate, 0.40*sun_diam, 0.5*sun_diam+120);

 	  		var x = light * cos(angle);
 	  		var y = 0.5*height + light * sin(angle);

 	  		vertex(x,y);
 	  	}


 	  	endShape();

 	  	beginShape();

 	  	for(var i = 22; i<spectrum.length-22; i++){

 	  		var angle = map(i, 22,spectrum.length-22, 0, -180);
 	  		var spec_space = spectrum[i];

 	  		var light = map(spec_space, 0, fft_rate, 0.40*sun_diam, 0.5*sun_diam+120);

 	  		var x = light * cos(angle);
 	  		var y = 0.5*height + light * sin(angle) + 1;

 	  		vertex(x,y);
 	  	}


 	  	endShape();


 	  	/* the sun */
 	  	image(sun_space_img, -0.5*sun_diam, 0.5*(height-sun_diam)
 	  			, sun_diam, sun_diam);


 	  	/* the buildings on the earth */
 		stroke(0);
 		fill(148, 163, 186);

 	  	translate(earth_dist*width, 0.5*height);

 	  	beginShape();

 	  	for(var i = 0; i<360; i++){

 	  		var r_e = map(volhistory_space[i],0,1,0.5*earth_diam-30,3*0.5*earth_diam);
 	  		var x = r_e * cos(i);
 	  		var y = r_e * sin(i);
 	  		vertex(x,y);
 	  	}

 	  	endShape();

 	  	translate(-earth_dist*width, -0.5*height);


 	  	/* earth */
 	  	var earth_x = earth_dist*width-0.5*earth_diam;
 	  	var earth_y = 0.5*(height-earth_diam);


 	  	image(earth_space_img,earth_x,earth_y,earth_diam,earth_diam);


 	  	/* moon */
 	  	moon_diam = 50 + spectrum[int(fft_rate/3)]/7;

 	  	image(moon_space_img,earth_dist*width-r*sin(rate*t*0.1)-0.5*moon_diam
 	  		,0.5*height-r*cos(rate*t*0.1)-0.5*moon_diam,moon_diam,moon_diam);

 	  	t++; //time increase


	}

	if(mode == 1){	//earth day
		background(0);

		/* background */ 		
 		image(day_img,0,0,width,height);


 		/*sunshine */

 		translate(width*0.5, 0);

 	  	for(var i = 22; i<(spectrum.length-22)*0.5; i+=3){
 	  		var angle = map(i, 22, (spectrum.length-22)*0.5, 0, 90);
 	  		var spec_space = spectrum[i];

 	  		var light = map(spec_space, 0, fft_rate
 	  					, 0.25*sky_sun_diam, 0.5*sky_sun_diam+200);

 	  		var x = light * sin(angle);
 	  		var y = light * cos(angle);

 	  		colorMode(HSB);

 	  		var linecolor = map(i,22,(spectrum.length-22)*0.5,19,38);
 	  		stroke(linecolor,255,255)
 	  		line(0,0,x,y);
 	  	}

 	  	for(var i = 25; i<(spectrum.length-22)*0.5; i+=3){
 	  		var angle = map(i, 22, (spectrum.length-22)*0.5, 0, -90);
 	  		var spec_space = spectrum[i];

 	  		var light = map(spec_space, 0, fft_rate
 	  					, 0.25*sky_sun_diam, 0.5*sky_sun_diam+200);

 	  		var x = light * sin(angle);
 	  		var y = light * cos(angle);

 	  		colorMode(HSB);

 	  		var linecolor = map(i,22,(spectrum.length-22)*0.5,18,0);
 	  		stroke(linecolor,255,255)
 	  		line(0,0,x,y);
 	  	}


 		translate(-width*0.5, 0);

 		/* the sun */
 		image(sun_day_img,0.5*(width-sky_sun_diam)
 				,-0.5*sky_sun_diam,sky_sun_diam,sky_sun_diam);


 		/* the buildings */

 		colorMode(RGB);
 		noStroke();
 		fill(211,211,211);

 		beginShape();

 		for(var i=0; i < volhistory.length; i++){
 			var y = map(volhistory[i],0,1,height,-height);

 			rect(i*5,y,5,height-y);
 		}

 		endShape();


 		/* space ship */
		var d = dist(mouseX, mouseY, 0.5*width, 0);

		if(d > 0.5*sky_sun_diam && mouseX > 0 && mouseX < width 
			&& mouseY > 0 && mouseY < height){
 			image(ship_img,mouseX - 0.5*ship_diam,mouseY - 0.5*ship_diam
 				,ship_diam,ship_diam);			
		}
 					
	}

	if(mode == 2){	//earth night
		background(0);

		/* background */
		image(night_img,0,0,width,height);

 		/* moonshine */

 		translate(width*0.5, 0);

 	  	for(var i = 22; i<(spectrum.length-22)*0.5; i+=3){
 	  		var angle = map(i, 22, (spectrum.length-22)*0.5, 0, 90);
 	  		var spec_space = spectrum[i];

 	  		var light = map(spec_space, 0, fft_rate
 	  					, 0.25*sky_sun_diam, 0.5*sky_sun_diam+200);

 	  		var x = light * sin(angle);
 	  		var y = light * cos(angle);

 	  		colorMode(HSB);

 	  		var linecolor = map(i,22,(spectrum.length-22)*0.5,52,64);
 	  		stroke(linecolor,255,255)
 	  		line(0,0,x,y);
 	  	}

 	  	for(var i = 25; i<(spectrum.length-22)*0.5; i+=3){
 	  		var angle = map(i, 22, (spectrum.length-22)*0.5, 0, -90);
 	  		var spec_space = spectrum[i];

 	  		var light = map(spec_space, 0, fft_rate
 	  					, 0.25*sky_sun_diam, 0.5*sky_sun_diam+200);

 	  		var x = light * sin(angle);
 	  		var y = light * cos(angle);

 	  		colorMode(HSB);

 	  		var linecolor = map(i,22,(spectrum.length-22)*0.5,51,38);
 	  		stroke(linecolor,255,255)
 	  		line(0,0,x,y);
 	  	}


 		translate(-width*0.5, 0);


 		/* the moon */ 	
 		image(moon_night_img,0.5*(width-sky_moon_diam-40),
 			-0.5*sky_moon_diam,(sky_moon_diam+40),sky_moon_diam);


 		/* the buildings */
 		noStroke();
 		fill(0,0,0);

 		beginShape();

 		for(var i=0; i < volhistory.length; i++){
 			var y = map(volhistory[i],0,1,height,-height);

 			rect(i*5,y,5,height-y);
 		}

 		endShape();


 		/* space ship */
		var d = dist(mouseX, mouseY, 0.5*width, 0);

		if(d > 0.5*sky_moon_diam && mouseX > 0 && mouseX < width 
			&& mouseY > 0 && mouseY < height){
 			image(ship_img,mouseX - 0.5*ship_diam,mouseY - 0.5*ship_diam
 				,ship_diam,ship_diam);			
		}

	}


	if(volhistory_space.length > 360){
		volhistory_space.splice(0,1);
	}

	if(volhistory.length*5 > width){
		volhistory.splice(0,1);
	}

}