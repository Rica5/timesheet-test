var newproject = document.getElementById('addproject');
function newproject_listen(){
    newproject.style.display = "block";
}
function cancel(){
    newproject.style.display = "none";
}
function add_new_project(){
    var project = document.getElementById("newproject").value;
    var status = "In Progress";
    sendRequest('/addproject',project,status);

}
var btnadd = document.getElementById("add_project");
btnadd.disabled = true;
function project(){
    if (document.getElementById("newproject").value==""){
        btnadd.disabled = true;
    }
    else{
      btnadd.disabled = false;
    }
}
function sendRequest(url, projet,status) {
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
  http.send("projet=" + projet + "&status="+status);
}
function showNotif(text) {
  const notif = document.querySelector('.notification');
  notif.innerHTML = text;
  notif.style.display = 'block';
  setTimeout(() => {
      notif.style.display = 'none';
  }, 5000);
}
