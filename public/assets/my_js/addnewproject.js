var newproject = document.getElementById('addproject');
var btnaddp = document.getElementById("add_project");
var project_done = false;
var parent_done = true;

function newproject_listen(){
  btnaddp.disabled = true;
    newproject.style.display = "block";
}

function cancel(){
    newproject.style.display = "none";
}
function add_new_project(){
    var projectp = document.getElementById("newproject").value;
    var status = document.getElementById("parent").value;
    sendRequest_project('/addproject',projectp,status);

}

function project(){
    if (document.getElementById("newproject").value==""){
        project_done = false;
    }
    else{
      project_done = true;
    }
    verify_p();
}
function checking(){
  if (document.getElementById("sub").checked == true){
      document.getElementById("par").style.display = "block";
      btnaddp.disabled = true;
      parent_done = false;
      verify_p();
  }
  else{
    document.getElementById("par").style.display = "none";
    parent_done = true;
    verify_p();
  }
}
function select(){
  if (document.getElementById("parent").value == ""){
     btnaddp.disabled = true;
     parent_done = false;
  }
  else{
    btnaddp.disabled = false;
    parent_done = true;
  }
  verify_p();
}
function verify_p(){
    if (project_done && parent_done){
      btnaddp.disabled = false;
    }
    else{
      btnaddp.disabled = true;
    }
}
function sendRequest_project(url, projetp,parent) {
  console.log(projetp);
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      newproject.style.display = "none";
      if (this.responseText.includes("already")){
        document.getElementById("notif").setAttribute('style','background-color:red');
        document.getElementById("newproject").value = "";
      }
      showNotif(this.responseText);
    }
  };
  http.send("projet=" + projetp + "&parent="+parent);
}
function showNotif(text) {
  const notif = document.querySelector('.notification');
  notif.innerHTML = text;
  notif.style.display = 'block';
  setTimeout(() => {
      notif.style.display = 'none';
      window.location = "/employees";
  }, 2000);
}
