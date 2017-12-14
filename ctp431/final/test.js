var p = 1;

function setup(){
  mySound = loadSound('guitar11.wav');
}
function mouseClicked() {

  p *= (-1);

  mySound.pan(p);
  mySound.playMode('sustain');
  mySound.play();
}
function keyPressed() {
  mySound.playMode('restart');
  mySound.play();
}