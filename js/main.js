//DONE: Upload file and set it as image
//DONE: Save that proccess so whenever the webpage is loaded then the new images are added again
//DONE: Remove images from the list
//DONE: Format images correctly

var photos = 0;

var currentlySelectedChild;
var currentlySelectedChildName;

//Disable initial sections
$("#3").fadeOut(0);
$("#4").fadeOut(0);
$("#question2").fadeOut(0);

function changeSection(sectionOld, sectionNew) {
    $("#"+sectionOld).fadeOut(400, function() {
        setTimeout(function(){ 
            $("#"+sectionNew).fadeIn(400);
        }, 400);  
    });
}

function changeQuestion(questionOld, questionNew) {
    $("#question"+questionOld).fadeOut(400, function() {
        setTimeout(function(){ 
            $("#question"+questionNew).fadeIn(400);
        }, 400);  
    });
}

function submitQuestion(questionDiv) {
    
    var currentQuestionId = questionDiv.getAttribute("id");
    var nextQuestionId = Number(currentQuestionId[currentQuestionId.length-1]);
    
    var rates = document.getElementsByName('pick' + nextQuestionId);
    for(var i = 0; i < rates.length; i++){
        if(rates[i].checked){
            var id = rates[i].getAttribute("value");
            
            console.log(id);
            
            if(document.getElementById("question"+(nextQuestionId + 1).toString()) == null) {
                alert("End of questions");
                /*$("#"+currentQuestionId).fadeOut(400);*/
            } else {
                changeQuestion(currentQuestionId[currentQuestionId.length-1], nextQuestionId + 1);
            }
            
        }
    }
    
    
}

function clearStorage() {
    localStorage.clear();
    location.reload();
}

function removePhoto() {
    var i = 0;
    var counter = 0;
    var rates = document.getElementsByName('photoPick');
    for(var i = 0; i < rates.length; i++){
        localStorage.removeItem("user"+i);
        if(!rates[i].checked){
            var id = rates[i].getAttribute("id");
            currentlySelectedChild = document.getElementById("photo" + i);
            currentlySelectedChildName = document.getElementById("nameText"+i).textContent;
            
            userData = [counter, currentlySelectedChildName, currentlySelectedChild.getAttribute("src")];
            localStorage.setItem("user"+counter, JSON.stringify(userData));
            
            counter++;
        }
    }
    location.reload();
}

function enterApp() {
    var password = document.getElementById("pin").value;
    if(btoa(password.toString()) == "MTIzNA==") {
        changeSection("0", "3");
    }
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
            changeSection("3", "4");
            
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
    
    
    var img = $('<img />').attr({
        'id': 'photo'+photos,
        'class': "photo",
        'src': source
    }).appendTo('.photo-label' + photos);
    
    var textDiv = $('<div></div>').attr({
        'id': 'textDiv'+photos,
        'class': 'text-container'
    }).appendTo('.photo-label' + photos);
    /*'#photo-div'+photos '#textDiv'+photos*/
    
    var nameText = $('<p>'+name+'</p>').attr({
        'class': 'nameText',
        'id': 'nameText'+photos
    }).appendTo('#textDiv'+photos);
    
    try {
        var childData = [photos, name, source]; 
        localStorage.setItem("user"+photos, JSON.stringify(childData));
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
    
    if (localStorage.getItem("user" + i) === null) {
        break;
    }

    userData = JSON.parse(localStorage.getItem("user" + i));

    console.log("Creating photo " + i);

    createImage(userData[2], userData[1]);
}