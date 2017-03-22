var money = [];
var customers = [];

var db = window.openDatabase("ACM_DB", "1.0", "ACM Database", 200000);
// Populate the database
function populateDB(tx) {
  // tx.executeSql('CREATE TABLE IF NOT EXISTS admin (a_id unique, password, name)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS customers '+
                    '(c_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, '+
                    'name TEXT NOT NULL UNIQUE, '+
                    'info TEXT, '+
                    'money INTEGER NOT NULL)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS transactions '+
                    '(t_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, '+
                    'c_id INTEGER NOT NULL, '+
                    't_date TEXT NOT NULL, '+
                    't_time TEXT NOT NULL, '+
                    'note TEXT, '+
                    't_type TEXT NOT NULL, '+
                    'amount INTEGER NOT NULL)');

  if (sessionStorage.spass) {
    if(sessionStorage.spass == localStorage.pass){
      tx.executeSql('SELECT * FROM customers ORDER BY c_id', [], function (tx, results) {
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
            selectOutput = selectOutput+' <option value="'+results.rows.item(i).c_id+'">'+results.rows.item(i).name+'</option>';
            total_amount = total_amount + results.rows.item(i).money;

            if(results.rows.item(i).money > 0){
              receivable += results.rows.item(i).money;
              var data = '<li class="w3-padding-16"> <span class="w3-tag w3-padding w3-round w3-green w3-center w3-right">'+results.rows.item(i).money+'</span><img src="img/avatar.png" class="w3-left w3-circle w3-margin-right" style="width:60px"><span class="w3-xlarge" onclick="userView('+results.rows.item(i).c_id+');">'+results.rows.item(i).name+'</span><br><span>'+results.rows.item(i).info+'</span></li>';
              resultsList = resultsList + data;
              receivableList = receivableList + data;
              cList = cList + data;
            }else if (results.rows.item(i).money < 0) {
              payable -=results.rows.item(i).money;
              var data2 = '<li class="w3-padding-16"> <span class="w3-tag w3-padding w3-round w3-red w3-center w3-right">'+results.rows.item(i).money+'</span><img src="img/avatar2.png" class="w3-left w3-circle w3-margin-right" style="width:60px"><span class="w3-xlarge" onclick="userView('+results.rows.item(i).c_id+');">'+results.rows.item(i).name+'</span><br><span>'+results.rows.item(i).info+'</span></li>';
              resultsList = resultsList + data2;
              payableList = payableList + data2;
              cList = cList + data2;
            }else{
              cList = cList + '<li class="w3-padding-16"><img src="img/avatar2.png" class="w3-left w3-circle w3-margin-right" style="width:60px"><span class="w3-xlarge" onclick="userView('+results.rows.item(i).c_id+');">'+results.rows.item(i).name+'</span><br><span>'+results.rows.item(i).info+'</span></li>';
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

      tx.executeSql('SELECT * FROM transactions ORDER BY t_id DESC', [], function (tx, results) {
          customers = JSON.parse(sessionStorage["customers"]);
          var user_name;
          var t_count = [];
          var tr_id = 0;
          var tr_count = 0;
          var u_id;
          var len2 = results.rows.length;
          for (var i=0; i<len2; i++){
            u_id = Number(results.rows.item(i).c_id);
            user_name = customers[u_id-1];
            if(i==0){
              var dateDivider = results.rows.item(i).t_date;
              var transactionList = '<div class="w3-container w3-gray date-divider w3-padding-8 w3-text-white"> <span class="w3-left"> '+results.rows.item(i).t_date+'</span><span class="w3-badge w3-right w3-margin-right" id="badgeID'+tr_id+'">3</span></div>';
            }
            if (dateDivider != results.rows.item(i).t_date) {
              t_count[tr_id] = tr_count;
              tr_id++;
              transactionList = transactionList + '<div class="w3-container w3-gray date-divider w3-padding-8 w3-text-white"> <span class="w3-left"> '+results.rows.item(i).t_date+'</span><span class="w3-badge w3-right w3-margin-right" id="badgeID'+tr_id+'">3</span></div>';
            }

            if (results.rows.item(i).amount > 0) {
              transactionList = transactionList + '<div class="w3-container w3-row w3-border t-container"><div class="w3-col s9 m9"><span class="w3-xlarge w3-margin-top cursor" onclick="userView('+results.rows.item(i).c_id+');">'+user_name+'</span><p class="t_note">'+results.rows.item(i).note+'</p></div><div class="w3-col s3 m3 t-right"><span class="t_time"><span class="fa fa-clock-o"></span> '+results.rows.item(i).t_time+'</span> <br><span class="w3-tag w3-padding-4 w3-round w3-green w3-center w3-margin-bottom">'+results.rows.item(i).amount+'</span></div></div>';
            }else if (results.rows.item(i).amount < 0) {
              transactionList = transactionList + '<div class="w3-container w3-row w3-border t-container "><div class="w3-col s9 m9"><span class="w3-xlarge w3-margin-top cursor" onclick="userView('+results.rows.item(i).c_id+');">'+user_name+'</span><p class="t_note">'+results.rows.item(i).note+'</p></div><div class="w3-col s3 m3 t-right"><span class="t_time"><span class="fa fa-clock-o"></span> '+results.rows.item(i).t_time+'</span> <br><span class="w3-tag w3-padding-4 w3-round w3-red w3-center w3-margin-bottom">'+results.rows.item(i).amount+'</span></div></div>';
            }

            dateDivider = results.rows.item(i).t_date;
            tr_count++;
          }
          if(len2>0){
            t_count[tr_id] = tr_count;
            document.getElementById("transactionList").innerHTML = transactionList;
            for(var i=0; i<t_count.length; i++){
              document.getElementById("badgeID"+i).innerHTML = t_count[i];
            }
          }
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
      tablinks[i].className = tablinks[i].className.replace(" w3-text-black", "");
  }
  document.getElementById(tabID).style.display = "block";
  evt.currentTarget.className += " w3-text-black";
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

  var d = new Date();
  var min = d.getMinutes();
  var hou = d.getHours();
  min = min.toString();
  hou = hou.toString();
  var t_time =  hou+":"+min;
  var t_date = d.toDateString();

  if(document.getElementById("radioPay").checked){
    t_type = document.getElementById("radioPay").value;
    updated_money = Number(cmoney);
  }else if(document.getElementById("radioReceive").checked){
    updated_money = -Number(cmoney);
    t_type = document.getElementById("radioReceive").value;
  }
  money = JSON.parse(sessionStorage["money"]);
  var c_id = Number(money.length) + 1;

  tx.executeSql('INSERT INTO customers ( name, info, money) VALUES ("'+cname+'", "'+cinfo+'", '+updated_money+')');
  if(updated_money != 0)
    tx.executeSql('INSERT INTO transactions ( c_id, t_date, t_time, note, t_type, amount) VALUES ("'+c_id+'", "'+t_date+'", "'+t_time+'", "New Customer", "'+t_type+'", '+updated_money+')');
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

  if(updated_money != 0){
    tx.executeSql('INSERT INTO transactions ( c_id, t_date, t_time, note, t_type, amount) VALUES ("'+c_id+'", "'+t_date+'", "'+t_time+'", "'+note+'", "'+t_type+'", '+updated_money+')');

    money = JSON.parse(sessionStorage["money"]);
    c_money = money[c_id-1];
    updated_money = Number(c_money) + Number(updated_money);

    tx.executeSql('UPDATE customers SET money = '+Number(updated_money)+' WHERE c_id = '+c_id);
  }
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

//userView function
function showCustomer(tx) {
  var uid = document.getElementById("userHiddenID").value;
  uid = Number(uid);
  // alert(uid);
  tx.executeSql('SELECT * FROM customers WHERE c_id = '+uid, [], function (tx, results) {
      var len = results.rows.length;
      var userTop = "";
      for (var i=0; i<len; i++){
        userTop = userTop + '<span onclick="userEdit('+uid+');" class="w3-closebtn w3-hover-none w3-round-large w3-text-gray w3-container w3-padding-8 w3-display-topleft" title="Edit"><span class="fa fa-edit w3-xlarge w3-text-gray"></span></span><span class="w3-text-blue w3-xxlarge">'+results.rows.item(i).name+'</span><br><span class="w3-text-gray w3-large">'+results.rows.item(i).info+'</span><br>';

        if (results.rows.item(i).money > 0) {
          userTop = userTop + '<button class="w3-btn w3-green w3-round w3-margin-top w3-margin-bottom w3-xlarge"><span class="fa fa-usd"></span><span class="w3-tag w3-white w3-round-large w3-margin-left">'+results.rows.item(i).money+'</span></button>';
        }else if (results.rows.item(i).money < 0) {
          userTop = userTop + '<button class="w3-btn w3-red w3-round w3-margin-top w3-margin-bottom w3-xlarge"><span class="fa fa-usd"></span><span class="w3-tag w3-white w3-round-large w3-margin-left">'+results.rows.item(i).money+'</span></button>';
        }
      }
      document.getElementById("userTop").innerHTML = userTop;
  }, errorCB);

  tx.executeSql('SELECT * FROM transactions WHERE c_id = '+uid+' ORDER BY t_id DESC', [], function (tx, results) {
      var len2 = results.rows.length;
      var userTrList = "";
      for (var i=0; i<len2; i++){
        userTrList = userTrList + '<div class="w3-container w3-row w3-border t-container "><div class="w3-col s9 m9"><span class="w3-large w3-margin-top">'+results.rows.item(i).t_date+'</span><p class="t_note">'+results.rows.item(i).note+'</p></div><div class="w3-col s3 m3 t-right"><span class="t_time"><span class="fa fa-clock-o"></span> '+results.rows.item(i).t_time+'</span> <br>';
        if (results.rows.item(i).amount > 0) {
          userTrList = userTrList + '<span class="w3-tag w3-padding-4 w3-round w3-green w3-center w3-margin-bottom">'+results.rows.item(i).amount+'</span></div></div>';
        }else if (results.rows.item(i).amount < 0) {
          userTrList = userTrList + '<span class="w3-tag w3-padding-4 w3-round w3-red w3-center w3-margin-bottom">'+results.rows.item(i).amount+'</span></div></div>';
        }
      }
      document.getElementById("userTrList").innerHTML = userTrList;
      document.getElementById("userAllTr").innerHTML = len2;
  }, errorCB);
}

function userViewed(){
  // document.getElementById('transactionModal').style.display='none';
  document.getElementById('userViewModal').style.display='block';
}

function userView(uid){
  document.getElementById("hidden").innerHTML = '<input type="hidden" name="hidden" value="'+uid+'" id="userHiddenID">';
  db.transaction(showCustomer, errorCB, userViewed);
  return false;
}

// Edit Customer
function editForm(tx) {
  var uid = document.getElementById("userHiddenID").value;
  uid = Number(uid);

  tx.executeSql('SELECT * FROM customers WHERE c_id = '+uid, [], function (tx, results) {
      var len = results.rows.length;
      var u_name, u_info;

      for (var i=0; i<len; i++){
        u_name = results.rows.item(i).name;
        u_info = results.rows.item(i).info;
      }
      document.getElementById("new_name").value = u_name;
      document.getElementById("new_info").value = u_info;
  }, errorCB);
}

function formViewed(){
  document.getElementById('userViewModal').style.display='none';
  document.getElementById('editCustomer').style.display='block';
}

function userEdit(uid){
  document.getElementById("hidden").innerHTML = '<input type="hidden" name="hidden" value="'+uid+'" id="userHiddenID">';
  db.transaction(editForm, errorCB, formViewed);
  return false;
}

// Save edited customer form
function saveEditedCustomer(tx) {
  var uid = document.getElementById("userHiddenID").value;
  uid = Number(uid);
  var nname = document.getElementById("new_name").value;
  var ninfo = document.getElementById("new_info").value;

  var executeQuery = "UPDATE customers SET name=?, info=? WHERE c_id=?";
  tx.executeSql(executeQuery, [nname,ninfo,uid],
   //On Success
  function(tx, result) {alert('Updated successfully');},
   //On Error
  function(error){alert('Something went Wrong');});
}

function saved(){
  window.location.reload();
}

function editCustomer(){
  db.transaction(saveEditedCustomer, errorCB, saved);
  return false;
}

// Admin Logout function
function logOut(){
  window.sessionStorage.clear();
  sessionStorage.success = 'Successfull logout';
  window.location.reload();
}

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    var element = document.getElementById('deviceProperties');
    element.innerHTML = 'Device Name: '     + device.name     + '<br />' +
                        'Device Cordova: '  + device.cordova  + '<br />' +
                        'Device Platform: ' + device.platform + '<br />' +
                        'Device UUID: '     + device.uuid     + '<br />' +
                        'Device Model: '    + device.model    + '<br />' +
                        'Device Version: '  + device.version  + '<br />';
    alert('Connection type: ' + states[networkState]);
}
