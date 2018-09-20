var money = [];
var customers = [];

var db = window.openDatabase("ACM_DB", "1.0", "ACM Database", 200000);
// Populate the database
function populateDB(tx) {
  // tx.executeSql('CREATE TABLE IF NOT EXISTS admin (a_id unique, password, name)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS customers '+
                    '(name TEXT NOT NULL unique PRIMARY KEY, '+
                    'info TEXT, '+
                    'money INTEGER NOT NULL)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS transactions '+
                    '(t_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, '+
                    'c_id TEXT NOT NULL, '+
                    't_date TEXT NOT NULL, '+
                    't_time TEXT NOT NULL, '+
                    'note TEXT, '+
                    't_type TEXT NOT NULL, '+
                    'amount INTEGER NOT NULL)');

  if (sessionStorage.spass) {
    if(sessionStorage.spass == localStorage.pass){
      tx.executeSql('SELECT * FROM customers ORDER BY name', [], function (tx, results) {
          var len = results.rows.length;
          var total_amount = 0;
          var payable = 0;
          var receivable = 0;
          var m = 0;
          var selectOutput = '<option value="" disabled selected>Choose customer</option>';
          var resultsList = " ";
          var receivableList = " ";
          var payableList = " ";
          var cList = "";

          for (var i=0; i<len; i++){
            money[i] = results.rows.item(i).money;
            customers[i] = results.rows.item(i).name;
            selectOutput = selectOutput+' <option value="'+results.rows.item(i).name+'">'+results.rows.item(i).name+'</option>';
            total_amount = total_amount + results.rows.item(i).money;

            if(results.rows.item(i).money > 0){
              receivable += results.rows.item(i).money;
              resultsList = resultsList + '<li class="w3-padding-16"> <span class="w3-tag w3-padding w3-round w3-green w3-center w3-right">'+results.rows.item(i).money+'</span><img src="img/avatar.png" class="w3-left w3-circle w3-margin-right" style="width:60px"><span class="w3-xlarge">'+results.rows.item(i).name+'</span><br><span>'+results.rows.item(i).info+'</span></li>';
              receivableList = receivableList + '<li class="w3-padding-16"> <span class="w3-tag w3-padding w3-round w3-green w3-center w3-right">'+results.rows.item(i).money+'</span><img src="img/avatar.png" class="w3-left w3-circle w3-margin-right" style="width:60px"><span class="w3-xlarge">'+results.rows.item(i).name+'</span><br><span>'+results.rows.item(i).info+'</span></li>';
              cList = cList + '<li class="w3-padding-16"> <span class="w3-tag w3-padding w3-round w3-green w3-center w3-right">'+results.rows.item(i).money+'</span><img src="img/avatar.png" class="w3-left w3-circle w3-margin-right" style="width:60px"><span class="w3-xlarge">'+results.rows.item(i).name+'</span><br><span>'+results.rows.item(i).info+'</span></li>';
            }else if (results.rows.item(i).money < 0) {
              payable -=results.rows.item(i).money;
              resultsList = resultsList + '<li class="w3-padding-16"> <span class="w3-tag w3-padding w3-round w3-red w3-center w3-right">'+results.rows.item(i).money+'</span><img src="img/avatar2.png" class="w3-left w3-circle w3-margin-right" style="width:60px"><span class="w3-xlarge">'+results.rows.item(i).name+'</span><br><span>'+results.rows.item(i).info+'</span></li>';
              payableList = payableList + '<li class="w3-padding-16"> <span class="w3-tag w3-padding w3-round w3-red w3-center w3-right">'+results.rows.item(i).money+'</span><img src="img/avatar2.png" class="w3-left w3-circle w3-margin-right" style="width:60px"><span class="w3-xlarge">'+results.rows.item(i).name+'</span><br><span>'+results.rows.item(i).info+'</span></li>';
              cList = cList + '<li class="w3-padding-16"> <span class="w3-tag w3-padding w3-round w3-red w3-center w3-right">'+results.rows.item(i).money+'</span><img src="img/avatar2.png" class="w3-left w3-circle w3-margin-right" style="width:60px"><span class="w3-xlarge">'+results.rows.item(i).name+'</span><br><span>'+results.rows.item(i).info+'</span></li>';
            }else{
              cList = cList + '<li class="w3-padding-16"><img src="img/avatar2.png" class="w3-left w3-circle w3-margin-right" style="width:60px"><span class="w3-xlarge">'+results.rows.item(i).name+'</span><br><span>'+results.rows.item(i).info+'</span></li>';
            }
          }

          sessionStorage["money"] = JSON.stringify(money);
          sessionStorage["customers"] = JSON.stringify(customers);

          document.getElementById("c_id").innerHTML = selectOutput;
          document.getElementById("tamount").innerHTML = total_amount;
          document.getElementById("receivable").innerHTML = receivable;
          document.getElementById("payable").innerHTML = payable;
          document.getElementById("resultsList").innerHTML = resultsList;
          document.getElementById("receivableList").innerHTML = receivableList;
          document.getElementById("payableList").innerHTML = payableList;
          document.getElementById("cList").innerHTML = cList;
      }, errorCB);

      tx.executeSql('SELECT * FROM transactions ORDER BY t_id', [], function (tx, results) {
          var len2 = results.rows.length;
          var transactionList = '<div class="w3-container w3-gray date-divider w3-padding-8 w3-text-white"> <span class="w3-left"> '+results.rows.item(0).t_date+'</span><span class="w3-badge w3-right w3-margin-right">3</span></div>';
          var dateDivider = results.rows.item(0).t_date;

          for (var i=0; i<len2; i++){
            if (dateDivider != results.rows.item(i).t_date) {
              transactionList = transactionList + '<div class="w3-container w3-gray date-divider w3-padding-8 w3-text-white"> <span class="w3-left"> '+results.rows.item(i).t_date+'</span><span class="w3-badge w3-right w3-margin-right">3</span></div>';
            }
            transactionList = transactionList + '<div class="w3-container w3-row w3-border t-container "><div class="w3-col s9 m9"><span class="w3-xlarge w3-margin-top">'+results.rows.item(i).c_id+'</span><p class="t_note">'+results.rows.item(i).note+'</p></div><div class="w3-col s3 m3 t-right"><span class="t_time"><span class="fa fa-times-circle-o"></span> '+results.rows.item(i).t_time+'</span> <br><span class="w3-tag w3-padding-4 w3-round w3-red w3-center">'+results.rows.item(i).amount+'</span></div></div>';
            dateDivider = results.rows.item(i).t_date;
          }

          document.getElementById("transactionList").innerHTML = transactionList;
      }, errorCB);
    }
  }
}
// Transaction error callback
function errorCB(tx, err) {
  alert("Error processing SQL: "+err);
}

// Transaction success callback
function successCB() {

}

function onPause() {
  // TODO: This application has been suspended. Save application state here.
}

function onResume() {
  // TODO: This application has been reactivated. Restore application state here.
}

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  var db = window.openDatabase("ACM_DB", "1.0", "ACM Database", 200000);
  db.transaction(populateDB, errorCB, successCB);
  // Handle the Cordova pause and resume events
  // document.addEventListener( 'pause', onPause.bind( this ), false );
  // document.addEventListener( 'resume', onResume.bind( this ), false );
  // alert("DB ready!");
}


// Check alert for reloading the page
function checkAlert(){
  if(window.sessionStorage.success){
    alertify.success(window.sessionStorage.success);
    window.sessionStorage.removeItem("success");
  }else if(window.sessionStorage.error){
    alertify.error(window.sessionStorage.error);
    window.sessionStorage.removeItem("error");
  }
}

// Body init
function bodyLoad(){
  // checkLog();
  checkAlert();
}

// Admin Account Setup
function adminSetup(){
  var aid = document.getElementById("a_id").value;
  var apass = document.getElementById("a_pass").value;
  var aname = document.getElementById("aname").value;
  if (!localStorage.id && !localStorage.pass) {
    localStorage.id = aid;
    localStorage.pass = apass;
    localStorage.name = aname;
    sessionStorage.success = "ACM Setup Successfull.";
    window.location.reload();
    return false;
  }
}

//login checkup for admin access
function adminLogin(){
  var apass = document.getElementById("apass").value;
  if (localStorage.id && localStorage.pass) {
    if( apass == localStorage.pass ){
      sessionStorage.spass = localStorage.pass;
      window.location.reload();
    }else{
      alertify.error('Admin access restricted for <strong>WRONG PASSWORD</strong>');
      return false;
    }
  }
}

// nav menu
function w3_open() {
  document.getElementById("mySidenav").style.display = "block";
  document.getElementById("myOverlay").style.display = "block";
}

function w3_close() {
  document.getElementById("mySidenav").style.display = "none";
  document.getElementById("myOverlay").style.display = "none";
}

// Tab
function openTab(evt, tabID) {
  var i, x, tablinks;
  x = document.getElementsByClassName("tabContainer");
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" w3-text-brown", "");
  }
  document.getElementById(tabID).style.display = "block";
  evt.currentTarget.className += " w3-text-brown";
}

// Filter showResults
function filterOut() {
    var input, filter, ul, li;
    input = document.getElementById("myInput1");
    filter = input.value.toUpperCase();
    ul = document.getElementById("resultsList");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

// filter receivableList
function filterOut2() {
    var input, filter, ul, li;
    input = document.getElementById("myInput2");
    filter = input.value.toUpperCase();
    ul = document.getElementById("receivableList");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
// filter payableList
function filterOut3() {
    var input, filter, ul, li;
    input = document.getElementById("myInput3");
    filter = input.value.toUpperCase();
    ul = document.getElementById("payableList");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

// filter all customerlist cList
function filterOut4() {
    var input, filter, ul, li;
    input = document.getElementById("myInput4");
    filter = input.value.toUpperCase();
    ul = document.getElementById("cList");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

// Add Customer function
function addUser(tx) {
  var cname = document.getElementById("cname").value;
  var cinfo = document.getElementById("cinfo").value;
  var cmoney = document.getElementById("cmoney").value;
  cname = cname.toUpperCase();

  var n = 0;
	var patt = /\S/g;
	var ch = cname.match(patt);
	n = ch.length;
	if(n>2){
    if(sessionStorage["customers"] && sessionStorage["money"]){
			customers = JSON.parse(sessionStorage["customers"]);
			money = JSON.parse(sessionStorage["money"]);
			var index = customers.indexOf(cname);
			var c_money = money[index];
			if(index < 0){
        tx.executeSql('INSERT INTO customers ( name, info, money) VALUES ("'+cname+'", "'+cinfo+'", '+cmoney+')');
      }else{
				sessionStorage.error = '<h4>Already EXIST !!!</h4>'+cname+' already exist with taka  <b class="w3-badge w3-xlarge">'+c_money+' </b>';
				window.location.reload();
				return false;
			}
    }else{ //first user
      tx.executeSql('INSERT INTO customers ( name, info, money) VALUES ("'+cname+'", "'+cinfo+'", '+cmoney+')');
    }
  }else{
		sessionStorage.error = '<h4> Name ERROR!!!</h4>Rules:<br />    1. All characters allowed<br />    2. Minimum 3 letters</div> ';
		window.location.reload();
		return false;
	}





}
function addedCustomer(){ //successfull Customer addition callback
  window.sessionStorage.success = "Customer added successfully";
  window.location.reload();
}
function addCustomer(){
  db.transaction(addUser, errorCB, addedCustomer);
  document.getElementById('addCustomer').style.display='none';
  return false;
}


// Add Money function
function addAmount(tx) {
  var t_type;
  var updated_money;

  var c_id = document.getElementById("c_id").value;
  var note = document.getElementById("t_note").value;
  var amount = document.getElementById("t_money").value;

  if(document.getElementById("radioP").checked){
    t_type = document.getElementById("radioP").value;
    updated_money = Number(amount);
  }else if(document.getElementById("radioR").checked){
    updated_money = -Number(amount);
    t_type = document.getElementById("radioR").value;
  }
  c_id = Number(c_id);

  var d = new Date();
  var min = d.getMinutes();
  var hou = d.getHours();
  min = min.toString();
  hou = hou.toString();
  var t_time =  hou+":"+min;
  var t_date = d.toDateString();

  tx.executeSql('INSERT INTO transactions ( c_id, t_date, t_time, note, t_type, amount) VALUES ("'+c_id+'", "'+t_date+'", "'+t_time+'", "'+note+'", "'+t_type+'", '+amount+')');

  money = JSON.parse(sessionStorage["money"]);
  c_money = money[c_id-1];
  updated_money = Number(c_money) + Number(updated_money);

  tx.executeSql('UPDATE customers SET money = '+Number(updated_money)+' WHERE c_id = '+c_id);

}

function moneyAdded(){ //successfull Money addition callback
  window.sessionStorage.success = "Money added successfully";
  window.location.reload();
}

function addMoney(){
  db.transaction(addAmount, errorCB, moneyAdded);
  document.getElementById('addMoney').style.display='none';
  return false;
}



// Admin Logout function
function logOut(){
  window.sessionStorage.clear();
  sessionStorage.success = 'Successfull logout';
  window.location.reload();
}
