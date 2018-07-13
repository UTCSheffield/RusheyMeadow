/*global
    document, PouchDB, console, localStorage, window, $, setTimeout
*/

//DONE: Upload file and set it as image
//DONE: Save that proccess so whenever the webpage is loaded then the new images are added again
//DONE: Remove images from the list
//DONE: Format images correctly

var testingMode = true;

var answerData, questionData;

var sCouchBaseURL = 'https://admin:a49e11246037@couchdb-009fed.smileupps.com/';

var questionaires = new PouchDB('questionaires');
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

var currentTimeout = 0;


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
    "sounds/113989__kastenfrosch__gewonnen.flac",
    "sounds/162395__zut50__yay.flac",
    "sounds/162458__kastenfrosch__gewonnen2.flac",
    "sounds/216564__qubodup__hands-clapping.flac",
    "sounds/242207__wagna__fanfare.flac",
    "sounds/273925__lemonjolly__hooray-yeah.flac",
    "sounds/343835__tristan-lohengrin__happy-8bit-loop-01.flac"//,
    //"sounds/398941__enviromaniac2__happyloop.flac"
]

var symbols = [
    {
        name: "ballon",
        source: "https://images-na.ssl-images-amazon.com/images/I/61T-V%2B7ItoL._SY355_.jpg"
        },
    {
        name: "want",
        source: "PEC/Want pec.fw.png"
        },
    {
        name: "like",
        source: "PEC/Like pec.fw.png"
        }
    ];





document.onreadystatechange = function () {
    var state = document.readyState;
    if (state === 'complete') {
        document.getElementById('interactive');
        document.getElementById('load').style.visibility = "hidden";
        
    }
};

var photos = 0;
var currentChild;
var questionMode = "consultation"; //"activities";
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

var aQuestions = [];

function loadQuestions(qMode) {
    questionaires.allDocs({
        include_docs: true
    }).then(function (result) {
        aQuestions = result.rows.filter(function (row) {
            return row.doc.questionnaire == qMode;
        }).map(function (row) {
            return row.doc;
        });
    }).catch(function (err) {
        console.log("question fetching error ", err);
    });
}

loadQuestions(questionMode);

function changeSection(sectionOld, sectionNew) {
    currentQuestion = 0;
    $("#" + sectionOld).fadeOut(400, function () {
        setTimeout(function () {
            $("#" + sectionNew).fadeIn(400);
        }, 400);
    });
}

function fadequestions() {
    $("#question").fadeOut(400, function () {
        setTimeout(function () {
            nextQuestion();
        }, 400);
    });
}

function Print() {
    printJS({
        printable: 'body',
        type: 'html',
        css: "css/main.css"
    });
}


function storeAnswer(question, answer) {
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

    var answerRecord = {
        //_id: currentChild.name + "-" + question + "-" + today,
        testing: testingMode,
        question: question,
        child: currentChild.name,
        date: today,
        answer: answer
    };

    answers.post(answerRecord).then(function (result) {
        console.log("answer stored", result);
    }).catch(function (err) {
        console.log("Answer storing error ", err);
    });
}

function skipQuestion() {
    currentQuestion += 1;
    fadequestions();
    storeAnswer(aQuestions[currentQuestion].question, "Question Skipped");
}

function getHTML(sentence) {

    symbols.forEach(function (symbol) {
        var imgtag = '<img class="pec" src="' + symbol.source + '" alt="' + symbol.name + '" >';
        sentence = sentence.replace(symbol.name, imgtag);
    })
    return sentence;
}

function nextQuestion() {
    //console.log("currentQuestion", currentQuestion);
    //console.log("aQuestions", aQuestions);

    if (currentQuestion >= aQuestions.length) {
        //alert("End Of questions!");
        changeSection("3", "1");
    } else {
        currentQuestionData = aQuestions[currentQuestion];
        var html = getHTML(currentQuestionData["question"]);

        document.getElementById("questionName").innerHTML = html;

        document.getElementById("questionPhoto").setAttribute("src", currentQuestionData["picture"]);
        document.getElementById("left").checked = false;
        document.getElementById("right").checked = false;
        $("#skip").fadeOut(0);
        $("#question").fadeIn(400);
        clearTimeout(currentTimeout);
        currentTimeout = setTimeout(function () {
            $("#skip").fadeIn(400);
        }, 60000);
    }
}

function consultation() {
    changeSection("1", "3");
    questionMode = "consultation";
    loadQuestions(questionMode);
}

function activities() {
    changeSection("1", "3");
    questionMode = "activities";
    loadQuestions(questionMode);
}

function changeQuestions() {
    questionData = JSON.parse($("#question-text").text());
}

function addQuestion() {

}

function admin() {
    changeSection("1", "5");
//    $("#question-text").text();
}

function back(current, next) {
    changeSection(current, next);
}


function review() {
    changeSection("1", "2");
    $('#data-panels').html("");
    for(var i = 0; i < answerData.length; i++){
        var button = $('<button>'+JSON.parse(localStorage.getItem("user"+i))[1]+' >'+'</button>').attr({
            'onclick': 'reviewSelect('+i+');'
        }).appendTo('#data-panels');

        var dataDiv = $('<div></div>').attr({
            'id': 'data-' + i,
            'class': 'data-panel'
        }).appendTo('#data-panels');

        $("#data-" + i).toggleClass("expanded");

        for (var key in answerData[i]) {
            if (!answerData[i].hasOwnProperty(key)) continue;

            var title = $('<h1>' + key.charAt(0).toUpperCase() + key.substr(1) + '</h1>').attr({
                class: 'date'
            }).appendTo('#data-' + i);

            var d = 0;

            var obj = answerData[i][key];
            for (var prop in obj) {
                if (!obj.hasOwnProperty(prop)) continue;

                var dateDiv = $('<div></div>').attr({
                    'id': 'date' + i + '-' + d + '-div',
                    'class': 'date-div'
                }).appendTo('#data-' + i);

                var dateTitle = $('<h2>' + prop + '</h2>').appendTo('#date' + i + '-' + d + '-div');

                for (z = 0; z < obj[prop].length; z++) {
                    var q = $('<h3>' + obj[prop][z][0] + ': ' + obj[prop][z][1] + '</h3>').appendTo('#date' + i + '-' + d + '-div');
                }

                d++;
            }
        }
    }

    //    document.getElementById("data").innerHTML = JSON.stringify(answerData);
}

function PlaySound() {
    var audio = document.getElementById("audio");
    var x = Math.floor(Math.random() * Sounds.length);
    audio.src = Sounds[x];
    audio.play();
}

$(".choosable").on("click", PlaySound);

function submitQuestion(questionDiv) {
    var photoElements = document.getElementsByName('pick');
    for (var i = 0; i < photoElements.length; i++) {
        if (photoElements[i].checked) {
            PlaySound();

            var id = photoElements[i].getAttribute("value");
            //console.log("aQuestions["+currentQuestion+"]", aQuestions[currentQuestion]);
            storeAnswer(aQuestions[currentQuestion].question, id);

            currentQuestion += 1;
            fadequestions();
        }
    }


}

function reviewSelect(i) {
    if ($("#data-" + i).hasClass("expanded") == true) {
        for (var b = 0; b < 100; b++) {
            if ($("#data-" + b).hasClass("expanded") == false) {
                $("#data-" + b).addClass("expanded");
            }
        }
    }
    $("#data-" + i).toggleClass("expanded");
}

function fileUploaded(id, focus) {
    document.getElementById(id).innerHTML = "File Uploaded";
    document.getElementById(focus).focus();
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
    var photoElements = document.getElementsByName('photoPick');
    for (i = 0; i < photoElements.length; i++) {
        localStorage.removeItem("user" + i);
        if (!photoElements[i].checked) {
            var id = photoElements[i].getAttribute("id");
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
    var photoElements = document.getElementsByName('photoPick');
    for (i = 0; i < photoElements.length; i++) {
        if (photoElements[i].checked) {
            console.log("Checked", photoElements[i].value);

            children.get(photoElements[i].value).then(function (child) {
                console.log("child", child);
                currentChild = child;

                currentUserData = [i, child.name, child.source];

                //console.log(JSON.stringify(currentUserData));

                changeSection("3", "4");
                nextQuestion();

            }).catch(function (err) {
                console.log("Error Fetching Child", err);
            });
        }
    }
}

function addPECSymbol() {

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
                name: childName,
                test: testingMode
            };

            children.post(child).then(function (result) {
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

