initPage("");
   function initPage(arg) {
        debugger;
// its for testing

        $("#btnShowCerts").on("click", function (e) {
            // REQUEST CERTIFICATE DETAILS
            debugger;
            $("#txtPin").attr("disabled", "disabled");
            SOURCE.soc.getAllCertificates();
        });

         
        $("#availableCerts").on("click", function (e) {
            // REQUEST CERTIFICATE DETAILS
            debugger;
            if (e.target.name = "allCerts") {
                $("#btnEnrollCert").removeAttr("disabled");
            }
        });

    }

    let allCerts;
    // this function is called when signed hash is recieved from WebSocket Server 
 
function recievedAllCerts(rcvdData) {
   
    var rcvdData = JSON.parse(rcvdData);  
    if (rcvdData["DATA"] == "{}") {
        alert("Digital Signature Not Connected");
    }
            switch (rcvdData["CMD"]) {
                case "ALL_CERT_DETAILS":
                    var htm = "";
                    if (rcvdData["DATA"] == "{}") // if recieved data has no certificates
                    {
                        htm = "No Certificates found";
                        $("#txtPin").attr("disabled", "disabled");
                        $("#btnEnrollCert").attr("disabled", "disabled");
                    }
                    else {
                        try {
                            allCerts = $.parseJSON(rcvdData["DATA"]);
                        } catch (ex) {
                            allCerts = rcvdData["DATA"];
                        }
                        for (var cert in allCerts) {
                            var singleCrt = allCerts[cert];
                            var htm = htm + getCertHTML(cert, singleCrt);
                        }
                        $("#txtPin").removeAttr("disabled");

                    }
                    $("#availableCerts")[0].innerHTML = htm;
                    break;

            }
        }

function getCertHTML(id, singleCrt) {
        // this has to be custamised accordingly to display more information about certificate
        return "<div class='divKeyDets'><input type='radio' class='keyRadioBtn' id='" + id.toString() + "' name='allCerts' value='" + singleCrt["SUB"] + "'>" + singleCrt["SUB"] + "</div>";
    } 
function enrollCertificates() {
    if ($("#txtPin")[0].value.toString().trim() != "") {
        //$("#btnEnrollCert").attr("disabled", "disabled");  
        var data = JSON.stringify(allCerts[$('input[name="allCerts"]:checked')[0].id]);
        window.external.setEnrollToken(data);
    } else {
        alert("Please enter Token PIN");
    }
}
 
 function pinStatus(stat, certData) {
            if (stat == "VALID") {
                debugger;
                SOURCE.srv.fn_CS({ srvcID: "F000", eventID: 'ENROLL', addInfo: { "enrollData": certData } }, fn_Enroll_OS, $("#progressBarFooter")[0]);
                // send data for submission on server  
            }
            else {
                alert("Pin Invalid");
                $("#btnEnrollCert").removeAttr("disabled");
            }
        }

 function fn_Enroll_OS(arg) {
        debugger;
        if (arg["r_code"] == "0") {
            switch (arg["eventID"]) {
                case "0PAGE":
                    LoadPage(arg);
                    break;
                case "1ENROLL":
                    alert(arg["r_data"]);
                    window.open("./index.html", "_self");
                    break;
            }
        }
        else {
            alert(arg["r_data"]);
        }
    } 

function callLoadAllCertificate() {
    window.external.callLoadAllCertificate();
}
 