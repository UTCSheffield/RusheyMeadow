<!DOCTYPE>
<html>
<title>UI | Rushey Meadow Project</title>
		<meta http-equiv="x-ua-compatible" content="IE=edge">
		<link rel="apple-touch-icon" sizes="180x180" href="img/logo.png"/>
		<link rel="icon" type="image/png" sizes="32x32" href="img/logo.png"/>
		<link rel="icon" type="image/png" sizes="16x16" href="img/logo.png"/>
		<meta name="msapplication-TileColor" content="#ffc40d"/>
		<meta name="msapplication-TileImage" content="img/logo.png"/>
		<meta name="theme-color" content="#ffffff"/>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="mobile-web-app-capable" content="yes">
		<link rel="manifest" href="manifest.json">
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
<link rel="stylesheet" href="https://use.fontawesome.com/61f3a0186e.css" />
<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" />
<style>
body {
margin: 0;
font-family: 'Montserrat', sans-serif;
}
.bg {
width: 100%;
height: 100%;
text-align: center;
position: fixed;
display: flex;
align-items: center;
justify-content: center;
}
.video-container {
position: fixed;
top: 0;
right: 0;
bottom: 0;
left: 0;
overflow: hidden;
z-index: -100;
}
.video {
    position: absolute;
    top: 50%;
    left: 50%;
    width: auto;
    height: auto;
    min-width: 100%;
    min-height: 100%;
    -webkit-transform: translate(-50%, -50%);
       -moz-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
	    transform: translate(-50%, -50%);
}
.container {
width: 100%;
height: 100%;
text-align: center;
position: fixed;
display: flex;
align-items: center;
justify-content: center;
background: rgb(255, 255, 255) transparent;
background: rgba(255, 255, 255, 0.9);
filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#CCFFFFFF, endColorstr=#CCFFFFFF);
-ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr=#CCFFFFFF, endColorstr=#CCFFFFFF)";
}
.content {
max-width: 80%;
}
.hidden {
display: none;
}
#arrow1 {
float: right;
}
#arrow {
opacity: 0;
}
@keyframes loaded {
    from {width: 100%; height: 100%;}
    to {width: 80%; height: 80%;}
}
@keyframes logoUp {
    from {margin-bottom: 0px;}
    to {margin-bottom: 52.16px;}
}
@keyframes contentIn {
    from {opacity: 0;}
    to {opacity: 100;}
}
.loaded {
animation-name: loaded;
animation-duration: 2s;
animation-delay: .5s;
animation-fill-mode: forwards;
}
.logoUp {
animation-name: logoUp;
animation-duration: 2s;
animation-fill-mode: forwards;
}
.arrowShow {
animation-name: contentIn;
animation-duration: 2s;
animation-delay: .3s;
animation-fill-mode: forwards;
}
.contentIn {
animation-name: contentIn;
animation-duration: 1s;
animation-fill-mode: forwards;
}
</style>
<head>
</head>
<body>
<section class="bg">
<section class="video-container" id="video-container">
<video autoplay playsinline loop mute poster="img/balloons.png" id="video" class="video" src="vid/balloons.mov" />
</section>
<section class="container" id="container">
<section class="content" id="content1">
<label for="ABC" class="round">
<img src="img/logo.png" width="200px" height="150px" />
<h1>Rushey Meadow</h1>
<img id="arrow" src="img/arrow-right.png" onclick="$('#content1').fadeOut('fast'); $('#content2').fadeIn('slow');" width="200px" height="52.16px" />
</label>
</section>
<section class="content hidden" id="content2">
<label for="ABC" class="round">
<h3>1. What do you enjoy doing at 'Rushey Meadow'?</h3>
<div class="w3-content" style="max-width: 70%">
  <img class="favoSlides" src="https://www.w3schools.com/w3css/img_nature_wide.jpg" style="width:100%">
  <img class="favoSlides" src="https://www.w3schools.com/w3css/img_fjords_wide.jpg" style="width:100%">
  <img class="favoSlides" src="https://www.w3schools.com/w3css/img_mountains_wide.jpg" style="width:100%">
  <img class="favoSlides" src="https://www.w3schools.com/w3css/img_nature_wide.jpg" style="width:100%">
  <img class="favoSlides" src="https://www.w3schools.com/w3css/img_fjords_wide.jpg" style="width:100%">
  <img class="favoSlides" src="https://www.w3schools.com/w3css/img_mountains_wide.jpg" style="width:100%">
  <img class="favoSlides" src="https://www.w3schools.com/w3css/img_nature_wide.jpg" style="width:100%">
  <img class="favoSlides" src="https://www.w3schools.com/w3css/img_fjords_wide.jpg" style="width:100%">
</div>

<div class="w3-center">
  <div class="w3-section">
    <button class="w3-button w3-light-grey" onclick="plusDivs1(-1)"><i class="fa fa-arrow-left"></i> Prev</button>
    <button class="w3-button w3-light-grey" onclick="plusDivs1(1)">Next <i class="fa fa-arrow-right"></i></button>
  </div>
  <button class="w3-button favo" onclick="currentDiv1(1)">1</button> 
  <button class="w3-button favo" onclick="currentDiv1(2)">2</button> 
  <button class="w3-button favo" onclick="currentDiv1(3)">3</button> 
  <button class="w3-button favo" onclick="currentDiv1(4)">4</button> 
  <button class="w3-button favo" onclick="currentDiv1(5)">5</button> 
  <button class="w3-button favo" onclick="currentDiv1(6)">6</button> 
  <button class="w3-button favo" onclick="currentDiv1(7)">7</button> 
  <button class="w3-button favo" onclick="currentDiv1(8)">8</button> 
</div>

<script>
var slideIndex1 = 1;
showDivs1(slideIndex1);

function plusDivs1(n1) {
  showDivs1(slideIndex1 += n1);
}

function currentDiv1(n1) {
  showDivs1(slideIndex1 = n1);
}

function showDivs1(n1) {
  var i1;
  var x1 = document.getElementsByClassName("favoSlides");
  var dots1 = document.getElementsByClassName("favo");
  if (n1 > x1.length) {slideIndex1 = 1}    
  if (n1 < 1) {slideIndex1 = x1.length}
  for (i1 = 0; i1 < x1.length; i1++) {
     x1[i1].style.display = "none";  
  }
  for (i1 = 0; i1 < dots1.length; i1++) {
     dots1[i1].className = dots1[i1].className.replace(" w3-blue", "");
  }
  x1[slideIndex1-1].style.display = "block";  
  dots1[slideIndex1-1].className += " w3-blue";
}
</script>
<img id="arrow1" class="arrow1" src="img/arrow-right.png" onclick="$('#content2').fadeOut('fast'); $('#content3').fadeIn('slow');" width="100px" />
</label>
</section>
<section class="content hidden" id="content3">
<label for="ABC" class="round">
<h3>2. What is your favourite food at 'Rushey Meadows'?</h3>
<div class="w3-content" style="max-width: 70%">
  <img class="foodSlides" src="https://www.w3schools.com/w3css/img_nature_wide.jpg" style="width:100%">
  <img class="foodSlides" src="https://www.w3schools.com/w3css/img_fjords_wide.jpg" style="width:100%">
  <img class="foodSlides" src="https://www.w3schools.com/w3css/img_mountains_wide.jpg" style="width:100%">
  <img class="foodSlides" src="https://www.w3schools.com/w3css/img_nature_wide.jpg" style="width:100%">
  <img class="foodSlides" src="https://www.w3schools.com/w3css/img_fjords_wide.jpg" style="width:100%">
  <img class="foodSlides" src="https://www.w3schools.com/w3css/img_mountains_wide.jpg" style="width:100%">
  <img class="foodSlides" src="https://www.w3schools.com/w3css/img_nature_wide.jpg" style="width:100%">
  <img class="foodSlides" src="https://www.w3schools.com/w3css/img_fjords_wide.jpg" style="width:100%">
</div>

<div class="w3-center">
  <div class="w3-section">
    <button class="w3-button w3-light-grey" onclick="plusDivs(-1)"><i class="fa fa-arrow-left"></i> Prev</button>
    <button class="w3-button w3-light-grey" onclick="plusDivs(1)">Next <i class="fa fa-arrow-right"></i></button>
  </div>
  <button class="w3-button food" onclick="currentDiv(1)">1</button> 
  <button class="w3-button food" onclick="currentDiv(2)">2</button> 
  <button class="w3-button food" onclick="currentDiv(3)">3</button> 
  <button class="w3-button food" onclick="currentDiv(4)">4</button> 
  <button class="w3-button food" onclick="currentDiv(5)">5</button> 
  <button class="w3-button food" onclick="currentDiv(6)">6</button> 
  <button class="w3-button food" onclick="currentDiv(7)">7</button> 
  <button class="w3-button food" onclick="currentDiv(8)">8</button> 
</div>

<script>
var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function currentDiv(n) {
  showDivs(slideIndex = n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("foodSlides");
  var dots = document.getElementsByClassName("food");
  if (n > x.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
     dots[i].className = dots[i].className.replace(" w3-blue", "");
  }
  x[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " w3-blue";
}
</script>
<img id="arrow1" class="arrow1" src="img/arrow-right.png" onclick="$('#content3').fadeOut('fast'); $('#content4').fadeIn('slow');" width="100px" />
</label>
</section>
<section class="content hidden" id="content4">
<label for="ABC" class="round">
<h3>3. Do you enjoy Rushy Meadows?</h3>

<img id="arrow1" class="arrow1" src="img/arrow-right.png" onclick="$('#content4').fadeOut('fast'); $('#content5').fadeIn('slow');" width="100px" />
</label>
</section>
</section>
</section>
<script>
$(window).on("load", function() {
$(".container").addClass("loaded");
setTimeout(function(){ $("#content1").addClass("logoUp"); $("#arrow").addClass("arrowShow") }, 2500);
});
if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js', { scope: '/rusheymedows/' })
		.then(function(registration) {
			console.log('Service Worker has been Registered!');
		});	navigator.serviceWorker.ready.then(function(registration) {
		console.log('Service Worker is Ready!');
	});
};
</script>
</body>
</html>