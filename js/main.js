//DONE: Upload file and set it as image
//DONE: Save that proccess so whenever the webpage is loaded then the new images are added again
//TODO: Remove images from the list
//TODO: Format images correctly

var photos = 0;

function clearStorage() {
    localStorage.clear();
    location.reload();
}

function createImage(source) {
    
    var imgDiv = $('<button></button>').attr({
        'id': 'photo-box'+photos,
        'class': "photo"
    }).appendTo('#photos-container');

    var img = $('<img />').attr({
        'id': 'photo'+photos,
        'class': "photo",
        'src': source
    }).appendTo('#photo-box' + photos);
    localStorage.setItem("photo" + photos, source);

    photos++;
}

$("photo-selector").change(readURL);

function readURL(input) {
    //input = event.target;
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            
            createImage(e.target.result);
            
        };

        reader.readAsDataURL(input.files[0]);
    }
}

var i;
for (i =0; i < 70; i++) {
    
    imageData = localStorage.getItem("photo" + i);
    
    if(imageData == null) {
        continue;
    }
    console.log("Creating photo " + i);

    createImage(imageData);
}

    