function check(){
    if(document.getElementById("chk3").checked == true){
        document.getElementById("chk1").checked = true;
        document.getElementById("chk2").checked = true;
    }else if(document.getElementById("chk3").checked == false){
        document.getElementById("chk1").checked = false;
        document.getElementById("chk2").checked = false;
    }
}