//DONE: Upload file and set it as image
//DONE: Save that proccess so whenever the webpage is loaded then the new images are added again
//DONE: Remove images from the list
//DONE: Format images correctly

var photos = 0;

var currentlySelectedChild;
var currentlySelectedChildName;

function clearStorage() {
    localStorage.clear();
    location.reload();
}

function removePhoto() {
    var i = 0;
    var counter = 0;
    var rates = document.getElementsByName('photoPick');
    localStorage.clear();
    for(var i = 0; i < rates.length; i++){
        if(!rates[i].checked){
            var id = rates[i].getAttribute("id");
            currentlySelectedChild = document.getElementById("photo" + i);
            
            localStorage.setItem("photo"+counter, currentlySelectedChild.getAttribute("src"));
            
            currentlySelectedChildName = document.getElementById("nameText"+i).textContent;
            localStorage.setItem("name"+counter, currentlySelectedChildName);
            counter++;
        }
    }
    location.reload();
}

function confirmPhoto() {
    var i = 0;
    var rates = document.getElementsByName('photoPick');
    for(var i = 0; i < rates.length; i++){
        if(rates[i].checked){
            var id = rates[i].getAttribute("id");
            currentlySelectedChild = document.getElementById("photo" + i);
            console.log(currentlySelectedChild.getAttribute("src"));
            currentlySelectedChildName = document.getElementById("nameText"+i).textContent;
            console.log(currentlySelectedChildName);
        }
    }
}

function createImage(source, name) {
    
    var pictureDiv = $('<div></div>').attr({
        'id': 'photo-div'+photos,
        'class': 'photo-container'
    }).appendTo('#photos-container');
    
    var imgDiv = $('<input>').attr({
        'id': 'photo-box'+photos,
        'type': 'radio',
        'class': "input-hidden",
        'name': "photoPick"
    }).appendTo('#photo-div'+photos);
    
    var imgDiv = $('<label></label>').attr({
        'for': 'photo-box'+photos,
        'class': 'photo-label'+photos
    }).appendTo('#photo-div'+photos);
    
    var textDiv = $('<div></div>').attr({
        'id': 'textDiv'+photos,
        'class': 'text-container'
    }).appendTo('#photo-div'+photos);
    
    var nameText = $('<p>'+name+'</p>').attr({
        'class': 'nameText',
        'id': 'nameText'+photos
    }).appendTo('#textDiv'+photos);
    
    var img = $('<img />').attr({
        'id': 'photo'+photos,
        'class': "photo",
        'src': source
    }).appendTo('.photo-label' + photos);
    try {
        localStorage.setItem("photo" + photos, source);
        localStorage.setItem("name" + photos, name)
    } catch(e) {
      if (e.code == 22) {
        alert("Local Storage is full, no more pictures can be added.")
      }
    }

    photos++;
}

$("photo-selector").change(readURL);

function readURL() {
    
    input = document.getElementById("photo-selector");
    childName = document.getElementById("child-name").value;
    
    if(childName == "") {
        alert("You did not enter a name. Please try again.")
        return;
    }
    
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            
            createImage(e.target.result, childName);
            
        };

        reader.readAsDataURL(input.files[0]);
    } else {
        alert("You did not enter a photo. Please try again.")
    }
}

var i;
for (i =0; i < 70; i++) {
    
    imageData = localStorage.getItem("photo" + i);
    
    if(imageData == null) {
        continue;
    }
    console.log("Creating photo " + i);

    createImage(imageData, localStorage.getItem("name" + i));
}

    