/*globals:document */

//DONE: Upload file and set it as image
//DONE: Save that proccess so whenever the webpage is loaded then the new images are added again
//DONE: Remove images from the list
//DONE: Format images correctly


var Sounds = [
    "sounds/216564__qubodup__hands-clapping_cut.flac",
    "sounds/113989__kastenfrosch__gewonnen_cut.flac",
    "sounds/162395__zut50__yay.flac",
    "sounds/162458__kastenfrosch__gewonnen2_cut.flac",
    "sounds/273925__lemonjolly__hooray-yeah_cut.flac",
    "sounds/343835__tristan-lohengrin__happy-8bit-loop-01_cut.flac",
    "sounds/398941__enviromaniac2__happyloop_cut.flac",
    "sounds/242207__wagna__fanfare_cut.flac"

]

var questionData = {
    "consultation": [
       {
          "question": "Do you enjoy Rushey Meadow?",
          "picture": "img/Rushey Meadow.jpg",
          "type": "feedback"
        },
        {
          "question": "Do the staff help you?",
          "picture": "img/Rushey Meadow.jpg",
          "type": "feedback"
        },
        {
          "question": "Do you like bagels?",
          "picture": "img/food/Bagel.jpg",
          "type": "food"
        },
        {
          "question": "Do you enjoy the garden?",
          "picture": "img/activities/GARDEN.JPG",
          "type": "activities"
        }
      ],
    "activities": [
        {
          "question": "Would you like to go to the seaside today?",
          "picture": "img/activities/seaside.jpg",
          "type": "today"
        }
    ]
};

if(localStorage.getItem("questions") === null) {
    localStorage.setItem("questions", JSON.stringify(questionData));
} else {
    questionData = JSON.parse(localStorage.getItem("questions"));
}

document.onreadystatechange = function () {
  var state = document.readyState
  if (state == 'complete') {
         document.getElementById('interactive');
         document.getElementById('load').style.visibility="hidden";
  }
}

var photos = 0;
var currentUserData;
var questions = "activities";
var currentQuestionData;
var currentQuestion = 0;

//Disable initial sections
for (var x = 0; x < 10; x++) {
    if(document.getElementById(x.toString()) == null) {
        continue;
    } else {
        $("#"+x.toString()).fadeOut(0);
    }
    
}

try {
    var url = window.location.href;
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

function fadeQuestions() {
    $("#question").fadeOut(400, function() {
        setTimeout(function(){ 
            nextQuestion();
            $("#question").fadeIn(400);
        }, 400);  
    });
}

function nextQuestion() {
    currentQuestionData = questionData[questions][currentQuestion];
    document.getElementById("questionName").innerHTML = currentQuestionData["question"];
    document.getElementById("questionPhoto").setAttribute("src", currentQuestionData["picture"]);
    document.getElementById("left").checked = false;
    document.getElementById("right").checked = false;
}

function consultation() {
    changeSection("1", "3");
    questions = "consultation";
    nextQuestion();
}

function activities() {
    changeSection("1", "3");
    questions = "activities";
    nextQuestion();
}

function review() {
    changeSection("1", "2");
}

function PlaySound() {
    var audio = document.getElementById("audio");
    var x = Math.floor(Math.random() * Sounds.length);
    audio.src = Sounds[x];
    audio.play();
    setTimeout(function(){
        var audio = document.getElementById("audio");
        audio.pause();
    }, 2000); 
}

$(".choosable").on("click",PlaySound);

function submitQuestion(questionDiv) {
    var rates = document.getElementsByName('pick');
    for(var i = 0; i < rates.length; i++){
        if(rates[i].checked){
            
            PlaySound();
            
            currentQuestion += 1;
            fadeQuestions();
            
            var id = rates[i].getAttribute("value");
            console.log(id);
            
        }
    }
    
    
}

function fileUploaded() {
    document.getElementById("file-text").innerHTML = "File Uploaded";
    document.getElementById("child-name").focus();
}

function clearStorage() {
    localStorage.clear();
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
    
    document.getElementById("file-text").innerHTML = "<i class='fa fa-upload'></i>Upload a picture";
    
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