var show = document.getElementById("data");
var all_time = document.getElementById("all_time");
var all_amount = document.getElementById("all_amount");
var month_time = document.getElementById("month_time");
var month_amount = document.getElementById("month_amount");
var project = document.getElementById("project");
var accueil = document.getElementById("acc");
var load = document.getElementById("lp");

function choose(){
    if (project.value == ""){
        accueil.style.display = "block";
        show.style.display = "none";
        load.style.display = "none";
        document.getElementById("m1").start();
        document.getElementById("m2").start();
    }
    else{
        accueil.style.display = "none";
        show.style.display = "none";
        load.style.display = "block";
        sendRequest_info("/getinfo",project.value);
    }
   
}
function sendRequest_info(url,project) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        load.style.display = "none";
        show.style.display = "block";
        var data = this.responseText.split(",");
          all_time.innerHTML = data[0];
          all_amount.innerHTML = data[1];
          month_time.innerHTML = data[2];
          month_amount.innerHTML = data[3];
      }
    };
    http.send("project="+project);
  }
