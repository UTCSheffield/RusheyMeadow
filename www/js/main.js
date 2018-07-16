/*global
    document, PouchDB, console, localStorage, window, $, setTimeout
*/

//DONE: Upload file and set it as image
//DONE: Save that proccess so whenever the webpage is loaded then the new images are added again
//DONE: Remove images from the list
//DONE: Format images correctly

var pin = "";

var sCouchBaseURL = null;

var preferences = null;
var preferencesRemote = null;

jQuery(document).ready(function($) {
  $(document).ready(function() {

    sCouchBaseURL = 'https://admin:a49e11246037@couchdb-009fed.smileupps.com/';

    preferences = new PouchDB('preferences');
    preferencesRemote = new PouchDB(sCouchBaseURL + 'preferences/');

    preferences.sync(preferencesRemote, {
        live: true
    }).on('change', function (data) {
        console.log("preferences in sync data changed", data);
    }).on('error', function (err) {
        console.log("Error syncing preferences", err);
    });
      
    preferences.get("PIN").then(function(data) {
        pin = data.value;
    });
  }); 
});

var testingMode = true;

var answerData, questionData;

var sCouchBaseURL = 'https://admin:a49e11246037@couchdb-009fed.smileupps.com/';

var questionnaires = new PouchDB('questionnaires');
var questionnairesRemote = new PouchDB(sCouchBaseURL + 'questionnaires/');

function syncQuestions() {
    questionnaires.sync(questionnairesRemote, {
        live: true
    }).on('change', function (data) {
        console.log("questionnaires in sync data changed", data);
        // yay, we're in sync!
    }).on('error', function (err) {
        console.log("Error syncing questionnaires", err);
        // boo, we hit an error!
    });
}
syncQuestions();

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

var symbols = new PouchDB('pec');
var symbolsRemote = new PouchDB(sCouchBaseURL + 'pec/');

var symbolsArray = []

function syncSymbols() {
    symbols.sync(symbolsRemote, {
        live: true
    }).on('changed', function (data) {
        console.log("symbols in sync data", data);
        // yay, we're in sync!
    }).on('error', function (err) {
        console.log("Error syncing symbols", err);
        // boo, we hit an error!
    });
    symbols.allDocs({
        include_docs: true
    }).then(function (result) {
        symbolsArray = result;
    });
}

syncSymbols();

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
    questionnaires.allDocs({
        include_docs: true
    }).then(function (result) {
        if(qMode == "activities") {
            
            preferences.get("activities").then(function(data) {
                questions = data.value;
                aQuestions = []
                for(var q in questions) {
                    var toPush = result.rows.filter(function (row) {
                        return row.doc._id == questions[q];
                    });
//                    }).map(function (row) {
//                        return row.doc;
//                    });
                    
                    aQuestions.push(toPush[0].doc);
                }
                
            });
            
        } else {
            aQuestions = result.rows.filter(function (row) {
                return row.doc.questionnaire == "consultation";
            }).map(function (row) {
                return row.doc;
            }); 
        }
        
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
    symbolsArray.rows.forEach(function (symbol) {
        var imgtag = '<img class="pec" src="' + symbol.doc.source + '" alt="' + symbol.doc._id + '" >';
        sentence = sentence.replace(symbol.doc._id, imgtag);
    })
    return sentence;
}

function nextQuestion() {
    //console.log("currentQuestion", currentQuestion);
    //console.log("aQuestions", aQuestions);
    if (currentQuestion >= aQuestions.length) {
        //alert("End Of questions!");
        changeSection("4", "3");
        currentQuestion = 0;
    } else {
        
        currentQuestionData = aQuestions[currentQuestion];
        
        if(currentQuestionData["type"] == "food" || currentQuestionData["type"] == "activities") {
            if(questionMode == "consultation") {
                currentQuestionData["question"] = "Do you like " + currentQuestionData["question"] + "?";
            } else {
                currentQuestionData["question"] = "Would you like " + currentQuestionData["question"] + " today?";
            }
        }
        
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
    var input = document.getElementById("question-image");
    var questionName = document.getElementById("question-name").value;
    
    var questionSection = $("#questionSection option:selected").val();
    var questionType = $("#questionTypeSelect option:selected").val();
    
    if (questionName == "") {
        alert("You did not enter a question. Please try again.");
        return;
    }
    
    document.getElementById("file-text-question").innerHTML = "<i class='fa fa-upload'></i>Upload Question Image";

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var questionNew = {
//                _id: pecName,
                type: questionType,
                question: questionName,
                picture: e.target.result,
                questionnaire: questionSection
            };

            questionnaires.post(questionNew).then(function (result) {
                alert("Question Added");
                syncQuestions();
            }).catch(function (err) {
                console.log("put question error", err);
            });
        };

        reader.readAsDataURL(input.files[0]);
    } else {
        alert("You did not upload a photo. Please try again.")
    }
}

function admin() {
    changeSection("1", "5");
//    $("#question-text").text();
    $('#today1').empty();
    $('#today2').empty();
    $('#today3').empty();
    questionnaires.allDocs({
        include_docs: true
    }).then(function (result) {
        aQuestions = result.rows.filter(function (row) {
            return row.doc.questionnaire == "consultation" && row.doc.type == "activities";
        }).forEach(function (row) {
            
            for(var i = 1; i < 4; i++) {
                var option = $('<option>' + "Would you like " + row.doc.question + " today?" + '</option>').attr({
                    'value': row.doc._id
                }).appendTo('#today'+i);  
            }
            
        });
    }).catch(function (err) {
        console.log("question fetching error ", err);
    });
    
}

function setActivities() {
    preferences.get('activities').then(function(doc) {
          return preferences.put({
            _id: 'activities',
            _rev: doc._rev,
            value: [$("#today1 option:selected").val(), $("#today2 option:selected").val(), $("#today3 option:selected").val()]
          });
        }).then(function(row) {
            alert("Questions Set!");
        }).catch(function (err) {
            alert("Question Activity Settings Error");
          console.log(err);
        });
}

function back(current, next) {
    changeSection(current, next);
}

function review() {
    changeSection("1", "2");
    $('#data-panels').html("");
    
    children.allDocs({
            include_docs: true
        }).then(function (children) {
            var counter = 0;
            children.rows.forEach(function (childGot) {
                var child = childGot.doc;
                
                counter += 1;
                
                var newCount = counter;
                
                var button = $('<button>'+child.name+' >'+'</button>').attr({
                    'onclick': 'reviewSelect('+counter+');'
                }).appendTo('#data-panels');
                
                 var dataDiv = $('<div></div>').attr({
                    'id': 'data-' + counter,
                    'class': 'data-panel'
                }).appendTo('#data-panels');

                $("#data-" + counter).toggleClass("expanded");
                
                var answerData = [];
                
                answers.allDocs({
                    include_docs: true
                }).then(function (answersAll) {
                    
                    answerData = answersAll.rows.filter(function (row) {
                        return row.doc.child == child.name;
                    });
                    console.log(answerData);
                    for(a in answerData) {
                        answer = answerData[a].doc;
                        var q = $("<h3>" + answer.date + ": " + answer.question + " " + answer.answer + "</h3>").appendTo('#data-' + newCount);
                    }
                    
                    
                });
                
            });

        }).catch(function (err) {
            console.log("child fetching error ", err);
        });
    
    
    
    
        
//        for(var i = 0; i < answerData.length; i++){
//            var button = $('<button>'+JSON.parse(localStorage.getItem("user"+i))[1]+' >'+'</button>').attr({
//                'onclick': 'reviewSelect('+i+');'
//            }).appendTo('#data-panels');
//
//            var dataDiv = $('<div></div>').attr({
//                'id': 'data-' + i,
//                'class': 'data-panel'
//            }).appendTo('#data-panels');
//
//            $("#data-" + i).toggleClass("expanded");
//
//            for (var key in answerData[i]) {
//                if (!answerData[i].hasOwnProperty(key)) continue;
//
//                var title = $('<h1>' + key.charAt(0).toUpperCase() + key.substr(1) + '</h1>').attr({
//                    class: 'date'
//                }).appendTo('#data-' + i);
//
//                var d = 0;
//
//                var obj = answerData[i][key];
//                for (var prop in obj) {
//                    if (!obj.hasOwnProperty(prop)) continue;
//
//                    var dateDiv = $('<div></div>').attr({
//                        'id': 'date' + i + '-' + d + '-div',
//                        'class': 'date-div'
//                    }).appendTo('#data-' + i);
//
//                    var dateTitle = $('<h2>' + prop + '</h2>').appendTo('#date' + i + '-' + d + '-div');
//
//                    for (z = 0; z < obj[prop].length; z++) {
//                        var q = $('<h3>' + obj[prop][z][0] + ': ' + obj[prop][z][1] + '</h3>').appendTo('#date' + i + '-' + d + '-div');
//                    }
//
//                    d++;
//                }
//            }
//        }

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

function changePIN() {
    if(btoa($("#oldPIN").val()) == pin) {
        preferences.get("PIN").then(function(data) {
            pin = data.value;
        });
        
        preferences.get('PIN').then(function(doc) {
          return preferences.put({
            _id: 'PIN',
            _rev: doc._rev,
            value: btoa($("#newPIN").val())
          });
        }).then(function() {
            alert("PIN Successfully Changed");
            pin = btoa($("#newPIN").val());
            $("#oldPIN").val("");
            $("#newPIN").val("");
        }).catch(function (err) {
            alert("PIN Upload Failed");
            $("#oldPIN").val("");
            $("#newPIN").val("");
          console.log(err);
        });
    } else {
        alert("Old PIN Incorrect.");
        $("#oldPIN").val("");
        $("#newPIN").val("");
    }
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
        if (photoElements[i].checked) {
            children.get(document.getElementById("nameText" + i).textContent).then(function(child) {
                return children.remove(child);
                
            }).then(function() {
                listChildren();
            }).catch(function (err) {
                console.log("Error Deleting Child: ", err);
            });
        
        }
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
    var input = document.getElementById("pec-selector");
    var pecName = document.getElementById("pec-name").value;
    
    if (pecName == "") {
        alert("You did not enter a PEC name. Please try again.");
        return;
    }
    
    document.getElementById("file-text-pec").innerHTML = "<i class='fa fa-upload'></i>Upload PEC";

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var symbolNew = {
                _id: pecName,
                source: e.target.result
            };

            symbols.post(symbolNew).then(function (result) {
                alert("Symbol Added");
                syncSymbols();
            }).catch(function (err) {
                console.log("put symbol error", err);
            });
        };

        reader.readAsDataURL(input.files[0]);
    } else {
        alert("You did not upload a photo. Please try again.")
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
    
    var input = document.getElementById("photo-selector");
    var childName = document.getElementById("child-name").value;
    
//    childName = childName.toUpperCase();
//    var initials = childName.split(" ");
//    
//    if(initials.length != 2 || initials[0].length != 1 || initials[1].length != 1) {
//        alert("The name must be in initial format (eg: J U)");
//        return;
//    }
    
    if (childName == "") {
        alert("You did not enter a name. Please try again.");
        return;
    }
    
    document.getElementById("file-text").innerHTML = "<i class='fa fa-upload'></i>Get Picture of Child";

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

