var code = document.getElementById("code");
var pw1 = document.getElementById("pwd1");
var pw2 = document.getElementById("pwd2");
var btnc = document.getElementById("btnc");
btnc.disabled = true;
//verify
code_done = false;
pw1_done = false;
pw2_done = false;
//error
var ec = document.getElementById("ec");
var ep1 = document.getElementById("ep1");
var ep2 = document.getElementById("ep2");
//verify code
function verify_code(){
    if (code.value == ""){
        code.setAttribute("style","border-color:red;");
        code_done = false;
        ec.style.display = "block";
        ec.innerHTML = "Code is required";
    }
    else{
        sendRequest_code("/check",code.value);
    }

}
//verify pass 1
function verify_pass1(){
    if (pw1.value == ""){
        ep1.style.display = "block";
        ep1.innerHTML = "Password is required";
        pw1.setAttribute("style","border-color:red;");
        pw1_done = false;
    }
    else if (pw1.value.length < 8){
        ep1.style.display = "block";
        ep1.innerHTML = "At least 8 caracters minimum";
        pw1.setAttribute("style","border-color:red;");
        pw1_done =false;
    }
    else{
        ep1.style.display = "none";
        pw1.removeAttribute("style");
        pw1_done = true;
    }
    verify_pass2();
    verify_all();
}
//verify pass 2
function verify_pass2(){
    if (pw2.value != pw1.value){
        ep2.style.display = "block";
        ep2.style.color= "red";
        ep2.innerHTML = "Password not match";
        pw2.setAttribute("style","border-color:red;");
        pw2_done = false;
    }
    else if(pw2.value ==""){
        ep2.style.display = "block";
        ep2.style.color= "red";
        ep2.innerHTML = "Password is required";
        pw2.setAttribute("style","border-color:red;");
        pw2_done = false;
    }
    else{
        pw2.setAttribute("style","border-color:green;");
        ep2.style.display = "block";
        ep2.style.color= "green";
        ep2.innerHTML = "Password match";
        pw2_done =true;
    }
     verify_all();
}
//verify all 
function verify_all(){
    if (code_done && pw1_done && pw2_done){
        btnc.disabled = false;
    }
    else{
        btnc.disabled = true;
    }
}
//btn change
function change_password(){
    sendRequest_change("/change",pw2.value);
}

//request code 
function sendRequest_code(url,codes) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          if (this.responseText == "match"){
              code_done = true;
              code.setAttribute("style","border-color:green;");
              ec.style.display = "block";
              ec.style.color = "green";
              ec.innerHTML = "Code accepted";
          }
          else{
            code.setAttribute("style","border-color:red;");
            code_done = false;
            ec.style.display = "block";
            ec.innerHTML = "Code is wrong";
            code.setAttribute("style","border-color:red;");
            ec.style.color = "red";
          }
      }
    };
    http.send("code="+codes);
  }
  //change password
  function sendRequest_change(url,pass) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          window.location = "/";
      }
    };
    http.send("pass="+pass);
  }


