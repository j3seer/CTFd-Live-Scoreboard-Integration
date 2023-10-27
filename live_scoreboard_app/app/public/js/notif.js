

function notif(msg){

      var child = document.getElementById('clonemother');
      var clone = child.cloneNode(true);
      var node = document.getElementById("toasts").appendChild(clone);
      console.log(node.childNodes);
      node.childNodes[1].childNodes[5].childNodes[1].innerHTML =  msg

      

      setTimeout(function() {
        if(node) {
          node.style.animation = "toast .5s ease-out forwards";
          setTimeout(() => {node.remove();} ,1000); // how long it takes to open
        }
      },10000); // how long it stays on 

}


function deletethis() {
  var e = window.event;
  var grand = e.target.parentNode.parentNode;
  grand.style.animation = "toast .5s ease-out forwards";
  setTimeout(() => {grand.remove();} ,500);
}