/*global
    document, PouchDB, console, localStorage, window, $, setTimeout
*/

//DONE: Upload file and set it as image
//DONE: Save that proccess so whenever the webpage is loaded then the new images are added again
//DONE: Remove images from the list
//DONE: Format images correctly

var answerData, questionData;

var questionaires = new PouchDB('questionaires');

var sCouchBaseURL = 'https://admin:a49e11246037@couchdb-009fed.smileupps.com/';

var questionairesRemote = new PouchDB(sCouchBaseURL + 'questionnaires/');

questionaires.sync(questionairesRemote, {
    live: true
}).on('change', function (data) {
    console.log("questionaires in sync data changed", data);
    listChildren();
    // yay, we're in sync!
}).on('error', function (err) {
    console.log("Error syncing questionaires", err);
    // boo, we hit an error!
});


var answers = new PouchDB('answers');
var answersRemote = new PouchDB(sCouchBaseURL + 'answers/');

answers.sync(answersRemote, {
    live: true
}).on('changed', function (data) {
    console.log("answers in sync data", data);
    // yay, we're in sync!
}).on('error', function (err) {
    console.log("Error syncing answers", err);
    // boo, we hit an error!
});

var children = new PouchDB('children');
var childrenRemote = new PouchDB(sCouchBaseURL + 'children/');

function syncChildren() {
    children.sync(childrenRemote, {
        live: true
    }).on('change', function (data) {
        console.log("children in sync data", data);
        listChildren();
        // yay, we're in sync!

    }).on('error', function (err) {
        console.log("Error syncing children", err);
        // boo, we hit an error!
    });
}
syncChildren();

function listChildren() {
    children.allDocs({
        include_docs: true
    }).then(function (result) {
        console.log("result", result.rows);

        $('#photos-container').children().remove();

        result.rows.forEach(function (row) {
            var child = row.doc;
            createImage(child.source, child.name);
        });
    }).catch(function (err) {
        console.log("child fetching error ", err);
    });
};

listChildren();

var Sounds = [
    "sounds/216564__qubodup__hands-clapping_cut.flac",
    "sounds/113989__kastenfrosch__gewonnen_cut.flac",
    "sounds/162395__zut50__yay.flac",
    "sounds/162458__kastenfrosch__gewonnen2_cut.flac",
    "sounds/273925__lemonjolly__hooray-yeah_cut.flac",
    "sounds/343835__tristan-lohengrin__happy-8bit-loop-01_cut.flac",
    "sounds/398941__enviromaniac2__happyloop_cut.flac",
    "sounds/242207__wagna__fanfare_cut.flac"
];


document.onreadystatechange = function () {
    var state = document.readyState;
    if (state === 'complete') {
        document.getElementById('interactive');
        document.getElementById('load').style.visibility = "hidden";
    }
};

var photos = 0;
var currentUserData;
var currentChild;
var questions = "activities";
var currentQuestionData;
var currentQuestion = 0;

//Disable initial sections
for (var x = 0; x < 10; x++) {
    if (document.getElementById(x.toString()) == null) {
        continue;
    } else {
        $("#" + x.toString()).fadeOut(0);
    }

}

try {
    var url = window.location.href;
    var captured = /page=([^&]+)/.exec(url)[1];
    var result = captured ? captured : 0;
    $("#" + result).fadeIn(400);
} catch (e) {
    $("#0").fadeIn(400);
}

function changeSection(sectionOld, sectionNew) {
    $("#" + sectionOld).fadeOut(400, function () {
        setTimeout(function () {
            $("#" + sectionNew).fadeIn(400);
        }, 400);
    });
}

function fadeQuestions() {
    $("#question").fadeOut(400, function () {
        setTimeout(function () {
            nextQuestion();
        }, 400);
    });
}

function storeAnswer(question, answer){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = dd + '/' + mm + '/' + yyyy;

    var answer = {
        _id:currentChild.name+"-"+currentQuestion+"-"+today,
        question:question,
        child:currentChild.name,
        date:today,
        answer:answer
    };
    
    answers.put(answer).then(function(result){
    });
}

function skipQuestion() {
    currentQuestion += 1;
    fadeQuestions();
    storeAnswer(currentQuestion, "Question Skipped");
}

function nextQuestion() {
    if (currentQuestion >= questionData[questions].length) {
        alert("End Of Questions!");
    } else {

        currentQuestionData = questionData[questions][currentQuestion];
        document.getElementById("questionName").innerHTML = currentQuestionData["question"];
        document.getElementById("questionPhoto").setAttribute("src", currentQuestionData["picture"]);
        document.getElementById("left").checked = false;
        document.getElementById("right").checked = false;
        $("#skip").fadeOut(0);
        $("#question").fadeIn(400);
        setTimeout(function () {
            $("#skip").fadeIn(400);
        }, 60000);
    }

}

function consultation() {
    changeSection("1", "3");
    questions = "consultation";
}

function activities() {
    changeSection("1", "3");
    questions = "activities";
}

function review() {
    changeSection("1", "2");
    var dataText = ""
    var calendarData = [];

    for (var i = 0; i < 70; i++) {
        if (localStorage.getItem("user" + i) === null) {
            break;
        }
        dataText += JSON.parse(localStorage.getItem("user" + i))[1] + ": " + JSON.stringify(answerData[i]) + "\n";
        if (answerData[i]["consultation"] != null) {
            for (var dateX in answerData[i]["consultation"]) {
                console.log(dateX);
                calendarData.push({
                    eventName: "Consultation - " + JSON.parse(localStorage.getItem("user" + i))[1],
                    calendar: "Consultation",
                    color: 'orange',
                    date: dateX.substring(0, 2)
                });
            }
        }
        if (answerData[i]["activities"] != null) {
            for (var dateX in answerData[i]["activities"]) {
                console.log(dateX);
                calendarData.push({
                    eventName: "Activities - " + JSON.parse(localStorage.getItem("user" + i))[1],
                    calendar: "Activities",
                    color: 'blue',
                    date: dateX.substring(0, 2)
                });
            }
        }

    }

    var calendar = new Calendar('#calendar', calendarData);
    document.getElementById("data").innerHTML = dataText;
}

function PlaySound() {
    var audio = document.getElementById("audio");
    var x = Math.floor(Math.random() * Sounds.length);
    audio.src = Sounds[x];
    audio.play();
    setTimeout(function () {
        var audio = document.getElementById("audio");
        audio.pause();
    }, 2000);
}

$(".choosable").on("click", PlaySound);

function submitQuestion(questionDiv) {
    var rates = document.getElementsByName('pick');
    for (var i = 0; i < rates.length; i++) {
        if (rates[i].checked) {
            PlaySound();

            var id = rates[i].getAttribute("value");
            storeAnswer(currentQuestion, id);

            currentQuestion += 1;
            fadeQuestions();
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
    for (i = 0; i < rates.length; i++) {
        localStorage.removeItem("user" + i);
        if (!rates[i].checked) {
            var id = rates[i].getAttribute("id");
            var currentlySelectedChild = document.getElementById("photo" + i);
            var currentlySelectedChildName = document.getElementById("nameText" + i).textContent;

            var userData = [counter, currentlySelectedChildName, currentlySelectedChild.getAttribute("src")];
            localStorage.setItem("user" + counter, JSON.stringify(userData));

            counter++;
        }
    }
    var url = window.location.href.split("?")[0];
    url += '?page=3'
    window.location.href = url;
}

function enterApp() {
    var password = document.getElementById("pin").value;
    if (btoa(password.toString()) == "MTIzNA==") {
        changeSection("0", "3");
    }
}

function confirmPhoto() {
    var i = 0;
    var rates = document.getElementsByName('photoPick');
    for (i = 0; i < rates.length; i++) {
        if (rates[i].checked) {
            console.log("Checked", rates[i].value);

            //var id = rates[i].getAttribute("id");
            
            children.get(rates[i].value).then(function(child) {
                console.log("child", child);
                currentChild = child;

                currentUserData = [i, child.name, child.source];

                //console.log(JSON.stringify(currentUserData));

                changeSection("3", "4");
                nextQuestion();


            }).catch(function (err) {
                console.log("Error Fetching Child", err);
            })


        }
    }
}

function createImage(source, name) {

    var pictureDiv = $('<div></div>').attr({
        'id': 'photo-div' + photos,
        'class': 'photo-container'
    }).appendTo('#photos-container');

    var imgDiv = $('<input>').attr({
        'id': 'photo-box' + photos,
        'type': 'radio',
        'class': "input-hidden",
        'name': "photoPick",
        "value": name
    }).appendTo('#photo-div' + photos);

    var imgDiv = $('<label></label>').attr({
        'for': 'photo-box' + photos,
        'class': 'photo-label' + photos
    }).appendTo('#photo-div' + photos);


    var img = $('<img />').attr({
        'id': 'photo' + photos,
        'class': "photo",
        'src': source
    }).appendTo('.photo-label' + photos);

    var textDiv = $('<div></div>').attr({
        'id': 'textDiv' + photos,
        'class': 'text-container'
    }).appendTo('.photo-label' + photos);
    /*'#photo-div'+photos '#textDiv'+photos*/

    var nameText = $('<p>' + name + '</p>').attr({
        'class': 'nameText',
        'id': 'nameText' + photos
    }).appendTo('#textDiv' + photos);


    photos++;
}

$("photo-selector").change(readURL);

function readURL() {

    document.getElementById("file-text").innerHTML = "<i class='fa fa-upload'></i>Upload a picture";

    var input = document.getElementById("photo-selector");
    var childName = document.getElementById("child-name").value;

    if (childName == "") {
        alert("You did not enter a name. Please try again.")
        return;
    }

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var child = {
                _id: childName,
                source: e.target.result,
                name: childName
            }

            children.put(child).then(function (result) {

                createImage(child.source, child.name);
                syncChildren();
            }).catch(function (err) {
                console.log("put child error", err);
            });


        };

        reader.readAsDataURL(input.files[0]);
    } else {
        alert("You did not enter a photo. Please try again.")
    }
}
