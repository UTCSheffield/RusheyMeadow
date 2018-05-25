//DONE: Upload file and set it as image
//DONE: Save that proccess so whenever the webpage is loaded then the new images are added again
//TODO: Remove images from the list
//TODO: Format images correctly

var photos = 0;

function clearStorage() {
    localStorage.clear();
    location.reload();
}

function removePhoto() {
    alert("TODO: Remove photos from list")
}

function createImage(source) {
    
    var imgDiv = $('<input>').attr({
        'id': 'photo-box'+photos,
        'type': 'radio',
        'class': "input-hidden",
        'name': "photoPick"
    }).appendTo('#photos-container');
    
    var imgDiv = $('<label></label>').attr({
        'for': 'photo-box'+photos,
        'class': 'photo-label'+photos
    }).appendTo('#photos-container');
    
    var img = $('<img />').attr({
        'id': 'photo'+photos,
        'class': "photo",
        'src': source
    }).appendTo('.photo-label' + photos);
    try {
        localStorage.setItem("photo" + photos, source);
    } catch(e) {
      if (e.code == 22) {
        alert("Local Storage is full, no more pictures can be added.")
      }
    }

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

    