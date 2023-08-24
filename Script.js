var pname,pemail,pphone,prelation,user;

var doh = null;

var firebaseConfig = {
  //Your Configuration of FireBase 
};                                         
    firebase.initializeApp(firebaseConfig);
// Initialize Firebase

function initApp(){
    document.body.style.opacity = 0.5; 
    // firebase.auth().onAuthStateChanged(function(user){
        // if(user){
            showDiv('operations');
            document.getElementById('loading').style.display = 'none';
            document.getElementById('logoutBtn').style.display = 'block';
            document.body.style.opacity = 1;
        // }
        // else{
        //     showDiv('login');
        //     document.getElementById('loading').style.display = 'none';
        //     document.getElementById('logoutBtn').style.display = 'none';
        //     document.body.style.opacity = 1;
        // }
    // });
}

function getVal(id){
    val = document.getElementById(id).value;
    return val;
}

function checkAuth(){
  user = firebase.auth().currentUser;
  // if (user) {
    showDiv('operations');
  // }
}

function _(Id) {
    return document.getElementById(Id);
}



function showDiv(div){
    document.getElementById('login').style.display = 'none';
    data = document.getElementById(div).innerHTML;
    document.getElementById('main').innerHTML = data;
}

function showOperation(div){
    document.getElementById('create').style.display = 'none';
    data = document.getElementById(div).innerHTML;
    document.getElementById('showOperation').innerHTML = data;
    selectData();
}

  function login(){
    document.getElementById('loginButton').disabled = true;
    var userEmail = document.getElementById("loginEmail").value;
    var userPass = document.getElementById("loginPass").value;
  
    firebase.auth().signInWithEmailAndPassword(userEmail, userPass)
    .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        alert('Signed In as '+user.displayName);
        showDiv('operations');
        document.getElementById('logoutBtn').style.display = 'block';
        selectData();
        // ...
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
        document.getElementById('loginButton').disabled = false;
    });
  }

  function logout(){
    firebase.auth().signOut();
    document.getElementById('fullNav').style.display='none';
    document.getElementById('logoutBtn').style.display='none';
    showDiv('login');
  }


function reset(){
    resetEmail = document.getElementById('forgotEmail').value;
    firebase.auth().sendPasswordResetEmail(resetEmail)
  .then(() => {
    // Password reset email sent!
    alert('Check your Mail to reset Password');
    // ..
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ..
    alert(errorMessage);
  });
}

function selectData(){
        user = firebase.auth().currentUser.uid;
        document.getElementById('displayPeopleView').innerHTML = '';
        firebase.database().ref(user).once('value',
         function(allData){
            allData.forEach(
            function(usn){
                var html = "";
                html +="<tr>";
                html +='<td class="px-4 py-3">'; html +=usn.val().name+'</td>' ;
                html +='<td class="px-4 py-3">'; html +=usn.val().usn+'</td>' ;
                html +='<td class="px-4 py-3">'; html +=usn.val().phone+'</td>' ;
                html +='<td class="px-4 py-3">'; html +=usn.val().roomno+'</td>' ;
                html +='<td class="px-4 py-3">'; html +=usn.val().prgm+'</td>' ;
                html +='<td class="px-4 py-3">'; html +=usn.val().admsndate+'</td>';
                html +='<td class="px-4 py-3">'; html +=usn.val().block+'</td>';
                html +="</tr>";
                document.getElementById("displayPeopleView").innerHTML += html;
            });
      });
 }

  function getBlock(){
    let block1 = document.getElementById("phstl1");
    let block2 = document.getElementById("phstl2");
    let block3 = document.getElementById("phstl3");
    let block4 = document.getElementById("phstl4");
    if(block1.checked){
      return getVal("phstl1");
    }
    if(block2.checked){
      return getVal("phstl2");
    }
    if(block3.checked){
      return getVal("phstl3");
    }
    if(block4.checked){
      return getVal("phstl4");
    }
}

   function createPeople(){
    var user = firebase.auth().currentUser.uid;
    if(getVal('pusn') != null){
      var ref = firebase.database().ref(user+'/'+getVal("pusn").toUpperCase()).set({
      name:getVal("pname"),
      usn:getVal("pusn").toUpperCase(),
      phone:getVal("pphone"),
      roomno:getVal("prno"),
      prgm:getVal("pprgm"),
      cay:getVal("pcay"),
      block:getBlock(),
      admsndate:getDate(),
      admsntime:getTime()
    });
    alert('Data Added');
    selectData();
    }
    else{
      alert('Please Fill Data');
    }
  }


function getFee(){
    user = firebase.auth().currentUser.uid;
    usn = getVal('busn').toUpperCase();
    var ref = firebase.database().ref(user+'/'+usn);
    ref.once('value',
    function(snapshot){
        const data = snapshot.val();   
        _('bname').value = data.name;    
        if(data.doh == null){
          _('bhds').value = 0;
        }
        else{
          _('bhds').value = data.doh;
        }
    });
}

function viewBill(){
  var cpd = parseInt(document.getElementById('cpd').value);
  var bhds = parseInt(document.getElementById('bhds').value);
  var hbill = cpd * bhds;
  document.getElementById('bill').innerText = parseInt(_('tfee').value)-hbill;
  var user = firebase.auth().currentUser.uid;
    usn = getVal("busn").toUpperCase();
    var ref = firebase.database().ref(user+'/'+usn.toUpperCase()+'/')
    .update({
      bill: (parseInt(_('tfee').value)-hbill),
    });
}

function getPeople(){
    user = firebase.auth().currentUser.uid;
    usn = getVal('uusn').toUpperCase();
    var ref = firebase.database().ref(user+'/'+usn);
    ref.once('value',
    function(snapshot){
        const data = snapshot.val();
        _('upname').value = data.name;
        _('upphone').value = data.phone;
        _('urno').value = data.roomno;
        if(data.doh == null){
          _('doh').value = 0;
          doh = 0;
        }
        else{
          _('doh').value = data.doh;
          doh = data.doh;
        }
        console.log('Getting Data!');
    });
}



function updatePeople(){
    var user = firebase.auth().currentUser.uid;
    usn = getVal("uusn").toUpperCase();
    var ref = firebase.database().ref(user+'/'+usn.toUpperCase())
    .update({
      name:getVal("upname"),
      phone:getVal("upphone"),
      roomno:getVal("urno"),
      doh: parseInt(doh) + parseInt(getVal("doh")),
    }).then(alert('Data Updated'));
    selectData();
  }

function deletePeople(){
    user = firebase.auth().currentUser.uid;
    usn = getVal("dusn").toUpperCase();
    firebase.database().ref(user+'/'+usn).remove().
    then(alert('Data Deleted !'));
    selectData();
}
function getDate() {
    var dt = new Date();
    var day = dt.getDate();
    var month = dt.getMonth();
    var year = dt.getFullYear();
    if(parseInt(month) == 0) month = 1;
    var date = day + '/' + parseInt(month) + '/' + year;
    return date;
}

function getTime() {
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var time = hours + ':' + minutes + ' ' + ampm;
  return time;
}
