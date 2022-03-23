//Get all data 
var btn = document.getElementById("btns");
//Verify
btn.disabled = true;
let time_done = false;
let task_done = false;
let project_done = false;
let date_done = false;
//Field
var project = document.getElementById("project");
var date = document.getElementById("date");
var timestart = document.getElementById("timestart");
var timeend = document.getElementById("timeend");
var task = document.getElementById("task");
var alerts = document.getElementById("alert");
//error
var ep = document.getElementById("ep");
var ed = document.getElementById("ed");
var et = document.getElementById("et");
var ew = document.getElementById("ew");
//Verify project
function verify_project(){
  if (project.value != ""){
      project.removeAttribute("style");
      project_done = true;
      ep.style.display = "none";
  }
  else{
      project_done = false;
      project.setAttribute("style","border-color:red");
      ep.style.display = "block";
  }
  verify_all();
}
//Verify date
function verify_date(){
if (date.value != ""){
    date.removeAttribute("style");
    date_done = true;
    ed.style.display = "none";
}
else{
    date_done = false;
    date.setAttribute("style","border-color:red");
    ed.style.display = "block";
}
verify_all();
}
//verify time
function verify_time(){
  var timestarts = document.getElementById("timestart").value;
  var timeends = document.getElementById("timeend").value;
  if (timeends > timestarts){
    time_done = true;
    alerts.style.display = "none";
    alerts.innerHTML = "";
    timeend.removeAttribute("style");
    et.style.display = "none";
  }
  else{
    if (timeends){
      time_done = false;
      timeend.setAttribute("style","border-color:red");
      et.style.display = "block";
    }
  }
  verify_all();
}
//Verify task
function verify_task(){
  var task = document.getElementById("task");
  if (task.value){
    task_done = true;
    ew.style.display = "none";
    task.removeAttribute("style");
  }
  else{
    task_done = false;
    ew.style.display = "block";
    task.setAttribute("style","border-color:red");

  }
  verify_all();
}
function verify_all(){
  if (time_done && task_done && project_done && date_done){
      btn.disabled = false;
  }
  else{
    btn.disabled = true;
  }
}
function savetime(){
    sendRequest('/savetime',project.value,date.value,timestart.value,timeend.value,task.value);
}
function sendRequest(url,projects,dates,timestarts,timeends,tasks) {
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      project.value ="";date.value="";timestart.value="";timeend.value="";task.value="";
      btn.disabled = true;
        alerts.style.display = "block";
        alerts.setAttribute('style',"color:green;");
        alerts.innerHTML = this.responseText;
        project_done=false;date_done=false;time_done=false,task_done=false;
    }
  };
  http.send("project=" + projects + "&date=" + dates + "&start=" + timestarts+ "&end=" + timeends+ "&task=" + tasks);
}