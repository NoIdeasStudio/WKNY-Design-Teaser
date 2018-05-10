var myIndex = 0;
carousel2();

function carousel2() {
    var i;
    var x = document.getElementsByClassName("slides-slow");
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";  
    }
    myIndex++;
    if (myIndex > x.length) {myIndex = 1}    
    x[myIndex-1].style.display = "block";  
    setTimeout(carousel2, 1001);
}