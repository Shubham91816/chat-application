 

function login() { 
    var txtGroupName = document.getElementById('txtGroupName').value;
    var groupType = $('input[name="groupType"]:checked').val(); 
    window.external.CreateGroups(txtGroupName, groupType);
}


function exit() {
    window.external.ExitApp();
}

function invalidUserCredentials() {
    alert("Invalid User Credentails !!");
}