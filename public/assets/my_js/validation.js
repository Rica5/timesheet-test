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
const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);
			const search = urlParams.get('search');
//istener filter

			setTimeout(()=>{
				filter = document.querySelector("input[type='search']");
				var table = $('#datatable-default').DataTable();
				if (search != null){
					table.search( search ).draw();
				}
				
			},1000)
function validate_all(){

}

function sendRequest_true(url,id) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          window.location = "/validation?search="+filter.value;
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
        window.location = "/validation?search="+filter.value;
      }
    };
    http.send("id="+id+"&m_code="+mcode+"&task="+task+"&projetr="+projetr+"&message="+message);
  }
  function valide_all(){
    sendRequest_valid_all("/valideall",filter.value);
  }
  function sendRequest_valid_all(url,options){
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          if (this.responseText == "part"){
            window.location = "/validation?search="+filter.value;
          }
          else{
            window.location = "/employees";
          } 
      }
    };
    http.send("option="+options);
  }
