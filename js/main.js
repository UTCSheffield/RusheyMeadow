//DONE: Upload file and set it as image
//DONE: Save that proccess so whenever the webpage is loaded then the new images are added again
//DONE: Remove images from the list
//DONE: Format images correctly

document.onreadystatechange = function () {
  var state = document.readyState
  if (state == 'complete') {
         document.getElementById('interactive');
         document.getElementById('load').style.visibility="hidden";
  }
}

var photos = 0;
var currentUserData;

//Disable initial sections

for (var x = 0; x < 10; x++) {
    if(document.getElementById(x.toString()) == null) {
        continue;
    } else {
        $("#"+x.toString()).fadeOut(0);
    }
    
}

for (var x = 2; x < 10; x++) {
    if(document.getElementById("question"+x.toString()) == null) {
        break;
    } else {
        $("#question"+x.toString()).fadeOut(0);
    }
}

try {
    var url = window.location.href; // or window.location.href for current url
    var captured = /page=([^&]+)/.exec(url)[1];
    var result = captured ? captured : 0;
    $("#"+result).fadeIn(400);
} catch(e) {
    $("#0").fadeIn(400);
}

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
    //location.reload();
    var url = window.location.href.split("?")[0];
    url += '?page=3'
    window.location.href = url;
}

function removePhoto() {
    var i = 0;
    var counter = 0;
    var rates = document.getElementsByName('photoPick');
    for(var i = 0; i < rates.length; i++){
        localStorage.removeItem("user"+i);
        if(!rates[i].checked){
            var id = rates[i].getAttribute("id");
            var currentlySelectedChild = document.getElementById("photo" + i);
            var currentlySelectedChildName = document.getElementById("nameText"+i).textContent;
            
            userData = [counter, currentlySelectedChildName, currentlySelectedChild.getAttribute("src")];
            localStorage.setItem("user"+counter, JSON.stringify(userData));
            
            counter++;
        }
    }
    var url = window.location.href.split("?")[0];
    url += '?page=3'
    window.location.href = url;
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
            
            currentUserData = [i, document.getElementById("nameText"+i).textContent, document.getElementById("photo" + i).getAttribute("src")];
            
            console.log(JSON.stringify(currentUserData));
            
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

    createImage(userData[2], userData[1]);
}