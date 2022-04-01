var email = document.getElementById("email");
var btnadd = document.getElementById("admin");
btnadd.disabled = true;
function check(){
    if(email.value==""){
        btnadd.disabled = true;
    }
    else{
        btnadd.disabled = false
    }
}
function add_admin(){
    sendRequest("/addadmin",email.value);
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
  function sendRequest(url, mail) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        if (this.responseText.includes("already")){
            document.getElementById("notif").setAttribute('style','background-color:red');
            showNotif(this.responseText);
            document.getElementById("newproject").value = "";
          }
	      else if (this.responseText == "retour"){
		      window.location = "/";
	      }
          else{
            document.getElementById("notif").setAttribute('style','background-color:limeagreen');
            showNotif(this.responseText);
          }
          document.getElementById("email").value="";
      }
    };
    http.send("mail=" + mail);
  }