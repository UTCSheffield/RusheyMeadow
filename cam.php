<html>
  <head>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
  </head>
  <body>
    <video id="camVideo" width="640" height="480" autoplay></video>
    <button id="camTake">Snap Photo</button>
    <canvas id="camCanvas" width="640" height="480"></canvas>
<script>
var video = document.getElementById('camVideo');
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
    });
}
else if(navigator.getUserMedia) { 
    navigator.getUserMedia({ video: true }, function(stream) {
        video.src = stream;
        video.play();
    }, errBack);
} else if(navigator.webkitGetUserMedia) { 
    navigator.webkitGetUserMedia({ video: true }, function(stream){
        video.src = window.webkitURL.createObjectURL(stream);
        video.play();
    }, errBack);
} else if(navigator.mozGetUserMedia) { 
    navigator.mozGetUserMedia({ video: true }, function(stream){
        video.src = window.URL.createObjectURL(stream);
        video.play();
    }, errBack);
}
function camAdd(canvas) {
	var image = new Image();
	image.src = canvas.toDataURL("image/png");
	return image;
}
var canvas = document.getElementById('camCanvas');
var context = canvas.getContext('2d');
var video = document.getElementById('camVideo');
document.getElementById("camTake").addEventListener("click", function() {
	context.drawImage(video, 0, 0, 640, 480);
        var $camUri = camAdd("camCanvas");
        var url=window.location.href,
        separator = (url.indexOf("?")===-1)?"?":"&",
        newParam=separator + "pic=" + camUri;
        newUrl=url.replace(newParam,"");
        newUrl+=newParam;
        window.location.href =newUrl;
});
</script>
  </body>
</html>