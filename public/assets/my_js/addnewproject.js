var newproject = document.getElementById('addproject');
function newproject_listen(){
    newproject.style.display = "block";
}
var project_done = false;
var parent_done = true;
function cancel(){
    newproject.style.display = "none";
}
function add_new_project(){
    var project = document.getElementById("newproject").value;
    var status = document.getElementById("parent").value;
    sendRequest('/addproject',project,status);

}
var btnadd = document.getElementById("add_project");
btnadd.disabled = true;
function project(){
    if (document.getElementById("newproject").value==""){
        btnadd.disabled = true;
        project_done = false;
    }
    else{
      btnadd.disabled = false;
      project_done = true;
    }
    verify_p();
}
function checking(){
  if (document.getElementById("sub").checked == true){
      document.getElementById("par").style.display = "block";
      btnadd.disabled = true;
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
     btnadd.disabled = true;
     parent_done = false;
  }
  else{
    btnadd.disabled = false;
    parent_done = true;
  }
  verify_p();
}
function verify_p(){
    if (project_done && parent_done){
      btnadd.disabled = false;
    }
    else{
      btnadd.disabled = true;
    }
}
function sendRequest(url, projet,parent) {
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
  http.send("projet=" + projet + "&parent="+parent);
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
