var show = document.getElementById("data");
var all_time = document.getElementById("all_time");
var all_amount = document.getElementById("all_amount");
var month_time = document.getElementById("month_time");
var month_amount = document.getElementById("month_amount");
var project = document.getElementById("project");
var accueil = document.getElementById("acc");
var load = document.getElementById("lp");
var nodata = document.getElementById("nd");
var btnd = document.getElementById("download");
var btng = document.getElementById("generate_excel");
var loading = document.getElementById("loading");
btnd.disabled =true;
btng.disabled = true;

function choose(){
    if (project.value == ""){
        btnd.disabled =true;
        btng.disabled = true;
        accueil.style.display = "block";
        show.style.display = "none";
        load.style.display = "none";
        nodata.style.display = "none";
        document.getElementById("m1").start();
        document.getElementById("m2").start();
    }
    else{
        accueil.style.display = "none";
        show.style.display = "none";
        load.style.display = "block";
        nodata.style.display = "none";
        sendRequest_info("/getinfo",project.value);
    }
   
}
function sendRequest_info(url,project) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          if (this.responseText == "retour"){
		      window.location = "/";
	      }
        else if(this.responseText == "error"){
          load.style.display = "none";
          show.style.display = "none";
          accueil.style.display = "none";
          nodata.style.display = "block";
          btnd.disabled =true;
          btng.disabled = true;
        }
          else{
          nodata.style.display = "none";
          load.style.display = "none";
          show.style.display = "block";
          var data = this.responseText.split(",");
          all_time.innerHTML = data[0];
          all_amount.innerHTML = data[1];
          month_time.innerHTML = data[2];
          month_amount.innerHTML = data[3];
          btng.disabled = false;
          }
      }
    };
    http.send("project="+project);
  }
  function downloads(){
    btnd.disabled = true;
    btng.disabled = true;
  }

function sendRequest_generate(url,project) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        loading.style.display = "none";
        btnd.disabled = false;
        btng.disabled = true;
      }
    };
    http.send("projet="+project);
  }
  function generate(){
    loading.style.display = "block";
    sendRequest_filter("/filter","",project.value,"","");
  }
  function sendRequest_filter(url,mcode,project,startdate,enddate) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        if (this.responseText == "retour"){
          window.location = "/";
        }
        else{
          sendRequest_generate("/generate",project.value);
        }
      
      }
    };
    http.send("mcode="+mcode+"&project="+project+"&startdate="+startdate+"&enddate="+enddate);
    }
