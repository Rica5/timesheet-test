
var error = document.getElementById("error");
var success = document.getElementById("success");
//btn
var btns = document.getElementById("btns");
btns.disabled = true;
//Verify
var mail_done = false;
var code_done = false;
var number_done =false;
//error 
var em = document.getElementById("em");
var ec = document.getElementById("ec");
var en = document.getElementById("en");
//Verify mail
function verify_mail(){
  var email = document.getElementById("email");
  if (email.value != "" && email.value.includes("@")){
    em.style.display = "none";
    email.removeAttribute("style");
    mail_done = true;
  }
  else{
    em.style.display = "block";
    email.setAttribute("style","border-color:red;");
    mail_done = false;
  }
  verify_all();
}
//verify m_code
function verify_code(){
  var mcode = document.getElementById("mcode");
  if (mcode.value != ""){
    ec.style.display = "none";
    mcode.removeAttribute("style");
    code_done = true;
  }
  else{
    ec.style.display = "block";
    mcode.setAttribute("style","border-color:red;");
    code_done = false;
  }
  verify_all();
}
//Verify number of agent
function verify_number(){
  var num_agent = document.getElementById("num_agent");
  if (num_agent.value != ""){
    en.style.display = "none";
    num_agent.removeAttribute("style");
    number_done = true;
  }
  else{
    en.style.display = "block";
    num_agent.setAttribute("style","border-color:red;");
    number_done = false;
  }
  verify_all();
}
function verify_all(){
  if (mail_done && code_done && number_done){
      btns.disabled = false;
  }
  else{
    btns.disabled = true;
  }
}


function add_new_employee(){
    var email = document.getElementById("email").value;
    var m_code = document.getElementById("mcode").value;
    var num_agent = document.getElementById("num_agent").value;
    sendRequest('/addemp',email,m_code,num_agent);
}
function sendRequest(url, email,m_code,num_agent) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          if (this.responseText == "error"){
              success.style.display = "none";
              error.style.display = "block";
              error.innerHTML = "Employee is already registered";
              btns.disabled = true;
          }
          else{
            success.style.display = "block";
            error.style.display = "none";
            success.innerHTML = "Employee "+this.responseText+ " registered successfuly";
          }
          btns.disabled = true;
          mail_done = false;code_done = false;number_done=false;
          document.getElementById("email").value="";
          document.getElementById("mcode").value="";
          document.getElementById("num_agent").value="";
      }
    };
    http.send("email=" + email + "&mcode=" + m_code + "&num_agent=" + num_agent);
  }