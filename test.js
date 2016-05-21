var test = require('tst');
var Spectrum = require('./');
// var Formant = require('audio-formant');
// var Speaker = require('audio-speaker');
// var Sink = require('audio-sink');
// var Slice = require('audio-slice');
var ft = require('fourier-transform');
var isBrowser = require('is-browser');
var SCBadge = require('soundcloud-badge');
var Analyser = require('web-audio-analyser');
var b = require('audio-buffer');
var Stats = require('stats.js');

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );
stats.begin();
stats.dom.style.left = 'auto';
stats.dom.style.right = '0';


//stream soundcloud
var audio = new Audio;
var badge = SCBadge({
	client_id: '6b7ae5b9df6a0eb3fcca34cc3bb0ef14',
	// , song: 'https://soundcloud.com/einmusik/einmusik-live-watergate-4th-may-2016'
	song: 'https://soundcloud.com/when-we-dip/atish-mark-slee-manjumasi-mix-when-we-dip-062',
	dark: false,
	getFonts: false
}, function(err, src, data, div) {
	if (err) throw err;

	//TODO: read url from href here
	audio.src = src;
	audio.crossOrigin = 'Anonymous';
	audio.addEventListener('canplay', function() {
		audio.play();
	}, false);
});

var analyser = Analyser(audio, { audible: true, stereo: false })



//generate input sine
var N = 4096;
var sine = new Float32Array(N);
var saw = new Float32Array(N);
var noise = new Float32Array(N);
var rate = 44100;

for (var i = 0; i < N; i++) {
	sine[i] = Math.sin(1000 * Math.PI * 2 * (i / rate));
	saw[i] = 2 * ((1000 * i / rate) % 1) - 1;
	noise[i] = Math.random() * 2 - 1;
}

//normalize browser style
if (isBrowser) {
	document.body.style.margin = '0';
	document.body.style.boxSizing = 'border-box';

}

function createColormapSelector (spectrum) {
	//append style switcher
	var switcher = document.createElement('select');
	switcher.classList.add('.colormap');
	switcher.style.position = 'fixed';
	switcher.style.bottom = '1rem';
	switcher.style.left = '1rem';
	switcher.style.width = '4rem';
	switcher.style.margin = '0 auto';
	switcher.style.background = 'rgba(0,0,0,.95)';
	switcher.style.color = 'white';
	switcher.style.border = '0';
	switcher.innerHTML = `
		<option value="jet">jet</option>
		<option value="hsv">hsv</option>
		<option value="hot">hot</option>
		<option value="cool">cool</option>
		<option value="spring">spring</option>
		<option value="summer">summer</option>
		<option value="autumn">autumn</option>
		<option value="winter">winter</option>
		<option value="bone">bone</option>
		<option value="copper">copper</option>
		<option value="greys" selected>greys</option>
		<option value="yignbu">yignbu</option>
		<option value="greens">greens</option>
		<option value="yiorrd">yiorrd</option>
		<option value="bluered">bluered</option>
		<option value="rdbu">rdbu</option>
		<option value="picnic">picnic</option>
		<option value="rainbow">rainbow</option>
		<option value="portland">portland</option>
		<option value="blackbody">blackbody</option>
		<option value="earth">earth</option>
		<option value="electric">electric</option>
		<!--<option value="alpha">alpha</option>-->
	`;
	switcher.addEventListener('input', function () {
		spectrum.setColormap(switcher.value);
	});
	document.body.appendChild(switcher);
}


test.only('linear classics', function () {
	// var frequencies = new Float32Array(ft(sine));
	// var frequencies = new Float32Array(1024).fill(0.5);
	var frequencies = new Float32Array(analyser.analyser.frequencyBinCount);

	var spectrum = new Spectrum({
		frequencies: frequencies,
		minFrequency: 40,
		logarithmic: true,
		smoothing: .8
		// viewport: function (w, h) {
		// 	return [50,20,w-70,h-60];
		// }
	}).on('render', function () {
		stats.end();
		stats.begin();
		analyser.analyser.getFloatFrequencyData(frequencies);
		frequencies = frequencies.map(function (v) {
			return Math.max((100 + v) / 100, 0);
		});
		spectrum.setFrequencies(frequencies);
	});

	createColormapSelector(spectrum);
});

test('log scale', function () {

});

test.skip('streaming', function () {
	var spectrum = new Spectrum({

	});

	Formant([1/1000, 1, 1, 0.5])
	.on('data', function (buffer) {
		spectrum.setFrequencies(buffer)
	})
	.pipe(Slice(1))
	.pipe(Sink());
});

test.skip('2d', function () {

});

test.skip('node', function () {

});


test.skip('viewport', function () {

});


test('clannels');

test('classic');

test('bars');

test('bars line');

test('dots');

test('dots line');

test('colormap (heatmap)');

test('multilayered (max values)');

test('line');

test('oscilloscope');

