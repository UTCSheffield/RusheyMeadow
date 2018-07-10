var rows = [ 
  {
  	name:"ballon",
    source:"https://images-na.ssl-images-amazon.com/images/I/61T-V%2B7ItoL._SY355_.jpg"
  },
  {
  	name:"want",
    source:"PEC want.jpg"
  },
  

];

function getHTML(sentence){
   rows.forEach(function(row){
   
   	var imgtag='<img src="'+row.source+'" alt="'+row.name+'" >';
   	sentence=sentence.replace(row.name, imgtag);	
   
   })

return sentence
}

var html = getHTML("I want a ballon.");


//I <img src="PEC want.jpg" alt="want" /> a <img src="https://images-na.ssl-images-amazon.com/images/I/61T-V%2B7ItoL._SY355_.jpg" alt="ballon" />


document.getElementById('text').innerHTML = html;