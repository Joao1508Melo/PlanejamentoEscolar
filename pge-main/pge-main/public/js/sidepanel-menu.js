function openNav() {
    document.getElementById("mySidepanel").style.width = "250px"; /*mostra o sidepanel*/
    document.getElementById("mySidepanel").style.display = "block";
    document.getElementById("mySidepanel").style.paddingLeft = "20px";
    document.getElementById("mySidepanel").style.paddingRight = "20px";
}

function closeNav() {
    document.getElementById("mySidepanel").style.width = "0"; /*esconde o sidepanel*/
    document.getElementById("mySidepanel").style.display = "none";
    document.getElementById("mySidepanel").style.paddingLeft = "0";
    document.getElementById("mySidepanel").style.paddingRight = "0";
}