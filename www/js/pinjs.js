jQuery(document).ready(function($) {
  $(document).ready(function() {

    var sCouchBaseURL = 'https://admin:a49e11246037@couchdb-009fed.smileupps.com/';

    var preferences = new PouchDB('preferences');
    var preferencesRemote = new PouchDB(sCouchBaseURL + 'preferences/');

    preferences.sync(preferencesRemote, {
        live: true
    }).on('change', function (data) {
        console.log("preferences in sync data changed", data);
    }).on('error', function (err) {
        console.log("Error syncing preferences", err);
    });
    
    var pin = "";
      
    preferences.get("PIN").then(function(data) {
        pin = data.value;
    });
      
    
      var enterCode = "";
    enterCode.toString();
        
         $("#numbers button").click(function() {

      var clickedNumber = $(this).text().toString();
      enterCode = enterCode + clickedNumber;
      var lengthCode = parseInt(enterCode.length);
      lengthCode--;
        
      $("#fields .numberfield:eq(" + lengthCode + ")").addClass("active");

      if (lengthCode == 3) {
        if (btoa(enterCode) == pin) {
            changeSection("0", "1");
            enterCode = "";
          $("#fields .numberfield").removeClass("active");
          $("#fields .numberfield").removeClass("right");
          $("#numbers").removeClass("hide");
          $("#anleitung p").html("<strong>Welcome to the RM Communications App</strong><br>Please enter the correct PIN-Code.");
        } else {
          $("#fields").addClass("miss");
          enterCode = "";
          setTimeout(function() {
            $("#fields .numberfield").removeClass("active");
          }, 200);
          setTimeout(function() {
            $("#fields").removeClass("miss");
          }, 500);

        }

      } else {}

    });
   
    
    $("#restartbtn").click(function(){
      enterCode = "";
      $("#fields .numberfield").removeClass("active");
      $("#fields .numberfield").removeClass("right");
      $("#numbers").removeClass("hide");
      $("#anleitung p").html("<strong>Welcome to the RM Communications App</strong><br>Please enter the correct PIN-Code. (1234)");
    });

  });
});