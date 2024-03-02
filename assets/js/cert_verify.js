SOURCE.page_level_08 = new function () { };
SOURCE.page_level_07 = new function () { };
SOURCE.page_level_06 = new function () { };
SOURCE.page_level_05 = new function () { };
SOURCE.page_level_04 = new function () { };
SOURCE.page_level_03 = new function () { };
SOURCE.page_level_02 = new function () { };
SOURCE.page_level_01 = new function () { };
SOURCE.content = new function () {
// its for testing


    this.initPage = function initPage(arg) {
        debugger
        //arg["addInfo"]["unm"]
        $("#txtUserId")[0].innerHTML = arg.r_data["full_name"];
        // cert thumb print
        $("#btnSubmit").on("click", function (e)
        {
            debugger;
            $("#txtPin").prop("disabled", true);
            //$("#btnSubmit").prop("disabled", true);
            // send message to socket to verify pin 
            SOURCE.soc.verifyPin($("#txtPin")[0].value.toString().trim(), arg["addInfo"]["thumb"],"VerifyCert");
            // localStorage.setItem("thumbPrint", "19489E04EB2105CA697EBE8B8B867C738F6DAE1A");
            // localStorage.setItem("tokenPin", "abcd@1234");
            // var _addInfo={
            //     "mnuid": 599, //sending default 301 for getting the section from menu table
            //     "sub_mnuid":"0", // this value will change depending on a form mostly it will be 0
            //     "trans_id":0,
            //     "frmData" : {}, 
            //     "eventID":''
            // }; 
            // SOURCE.srv.fn_CS({ srvcID: "F100", eventID: 'CHECK_UPDATES', addInfo: _addInfo }, SOURCE.soc.page_OS, $("#progressBarFooter")[0]);
        }); 
    }

};

