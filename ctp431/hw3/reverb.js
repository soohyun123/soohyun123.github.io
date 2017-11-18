var Reverb = function(context, parameters, next_node){

	var self = this;

	this.context = context;
	this.input = context.createGain();
	this.next_node = next_node;

	// create nodes
	this.convolver = context.createConvolver();
	this.wetGain = context.createGain();
	this.dryGain = context.createGain();

	// connect
	this.input.connect(this.dryGain);
	this.dryGain.connect(this.next_node);

	this.input.connect(this.wetGain);

	ajaxRequest = new XMLHttpRequest();
  	ajaxRequest.open('GET', 'slinky_ir.wav', true);
 	ajaxRequest.responseType = 'arraybuffer';

 	ajaxRequest.onload = function(){

    	var impulseData = ajaxRequest.response;

	    context.decodeAudioData(impulseData, function(buffer) {
        
        self.convolver.buffer = buffer;

      },

      function(e){"Error with decoding impuluse data" + e.err});

 	}

 	ajaxRequest.send();

    this.wetGain.connect(this.convolver);
    this.convolver.connect(this.next_node);

    // parameter
	this.wetGain.gain.value = parameters.reverbWetDry;
	this.dryGain.gain.value = (1 - parameters.reverbWetDry);


	this.parameters = parameters;
}


Reverb.prototype.updateParams = function (params, value) {

	switch (params) {

		case 'reverb_dry_wet':
			this.parameters.reverbWetDry = value;
			this.wetGain.gain.value = value;
			this.dryGain.gain.value = 1 - value;
			break;		
	}

}