//Valide if true
function validate_true(validate){
    sendRequest_true('/validate',validate);
}
var reason = document.getElementById("reason");
var rejected = document.getElementById("rejected");
var denie ="";
var mcode = "";
var task = "";
var projetrej = "";
//Denied if false
function validate_false(denied,m_code,tasks,projetr){
    reason.style.display = "block";
    denie = denied;
    mcode = m_code;
    task = tasks;
    projetrej = projetr;
    rejected.setAttribute("placeholder","Rejected reason for "+ tasks);
}
function sendclick(){
    sendRequest_false('/denied',denie,mcode,rejected.value,task,projetrej);
    rejected.value="";
}

function sendRequest_true(url,id) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          window.location = "/validation";
      }
    };
    http.send("id="+id);
  }
  function sendRequest_false(url,id,mcode,message,task,projetr) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
             window.location = "/validation";
      }
    };
    http.send("id="+id+"&m_code="+mcode+"&task="+task+"&projetr="+projetr+"&message="+message);
  }
