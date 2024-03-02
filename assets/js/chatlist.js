function LoadPendingChats(args) {
    var dets = JSON.parse(args);
    var tcount = parseInt(($('#clsCount_' + dets[0].from_user).html() == "" ? 0 : $('#clsCount_' + dets[0].from_user).html()));
    if (!tcount) {
        window.external.getUserList();
    }
    $('#clsCount_' + dets[0].from_user).html(parseInt(tcount) + 1);
    $('#clsLastMsg_' + dets[0].from_user).html(dets[0].message_text);
}
$('#action_menu_btn').click(function () {
    $('.action_menu').toggle();
});
$('#btnEnrollToken').on('click', function () { 
    window.external.LoanEnrollPage();
});
$('.search_btn').on('click', function () {
    var search = $(".search").val().toLowerCase();

    // Filter the list based on the search term
    $('.userlist').each(function () {
        var userName = $(this).find('.user_name').text().toLowerCase();
        // Check if the search term is found in user name
        if (userName.indexOf(search) !== -1) {
            // Move the matching item to the top
            $(this).prependTo('.contacts');
        } else {
            window.external.getUserList(search);
        }
    });
});

window.external.getUserList();
function loadUserList(args) {
    var dets = JSON.parse(args);
    $("#chatlist_area").html("");
    var list = "";
    for (var i = 0; i < dets.length; i++) {
        list += '<div class="row chatlist" id=' + dets[i].U_ID + ' onclick="selectChat(' + dets[i].U_ID + ')">';
        list += '    <div class="col-2 pl-0 pr-1">';
        list += '        <div class="list-profile-area">';
        list += '            <img src=' + dets[i].USER_DP + ' alt="profile image"';
        list += '                class="img-fluid list-profile-image user_img">';
        list += '        </div>';
        list += '    </div>';
        list += '    <div class="col-8 pl-0">';
        list += '        <p class="list-user-name mb-1 user_name">' + dets[i].FULL_NAME + '</p>';
        list += '        <p class="user-last-message mb-1" id="clsLastMsg_' + dets[i].U_ID + '">' + dets[i].LAST_MSG + '</p>';
        list += '    </div>';
        list += '    <div class="col-2 pr-0 text-right">';
        list += '        <p class="mb-1 last-message-time">' + dets[i].LAST_TIME + '</p>';
        list += '        <p class="mb-0 message-count" id="clsCount_' + dets[i].U_ID + '"></p>';
        list += '    </div>';
        list += ' </div>';   
    }
     $("#chatlist_area").append(list);
}
// 
window.external.getUserDetails();
function loadUserDetails(args) {
    var dets = JSON.parse(args);
    $(".cls_current_user_name").text(dets[0].currentUserName);
    $(".cls_current_unit_name").text(dets[0].currentUserId);
    $(".cls_user_dp").attr('src', dets[0].currentUserDP);
    if (dets[0].cert_id == 0) {
        $("#btnEnrollToken").show();
    } else {
        $("#btnEnrollToken").hide();
}
}

function selectChat(dets) {
    window.external.SelectChat(dets);
}
function logout(chatId) {
    window.external.Logout();
}

 


// DRIVES RELATED FUNCTIONS 
var baseFolderId = 0;
var dropArea = $("#drop-area");
var fileInput = $("#file-input");
var fileList = $("#flie_list_area");
function loadBaseDriveFolders(args) {
    var dets = JSON.parse(args);
    $("#drive_list").html(""); 
    var list = "";
    for (var i = 0; i < dets.length; i++) {
        list += '  <div class="d-list col-12 mb-2">';
        list += '      <div class="col-2 icon p-0 pl-2"><i class="fas fa-' + dets[i].file_type + '"></i></div>';
        list += '      <div class="col-9 filename pl-0" id="' + dets[i].folder_id + '" ><span>' + dets[i].folder_name + ' </span></div>';
        list += '      <div class="col-1 action p-0 pr-2 text-right"><i class="fas fa-ellipsis-v"></i></div>';
        list += '  </div>'; 
        baseFolderId = dets[i].folder_id;
    }
    $("#drive_list").append(list);
    window.external.getUserDriveFolders(baseFolderId);
}
function loadOthersDriveFolders(args) {

    var dets = JSON.parse(args);
    $("#btnCloseFolderForm").trigger("click");
    $("#drive_list").html("");
    var baseFolderId = 0;
    var list = "";
    for (var i = 0; i < dets.length; i++) {
        list += '  <div class="d-list col-12 mb-2" onclick="callGetUserDriveFolders(' + dets[i].folder_id + ', ' + dets[i].cat +')">';
        list += '      <div class="col-2 icon p-0 pl-2"><i class="fas fa-' + dets[i].file_type + '"></i></div>';
        list += '      <div class="col-9 filename pl-0" id="' + dets[i].folder_id + '" ><span>' + dets[i].folder_name + ' </span></div>';
        list += '      <div class="col-1 action p-0 pr-2 text-right"><i class="fas fa-ellipsis-v"></i></div>';
        list += '  </div>'; 
    }
    $("#drive_list").append(list); 
}
function callGetUserDriveFolders(folderId, cat) {  
    baseFolderId = folderId;
    if (cat == 0) {
        window.external.getUserDriveFolders(baseFolderId);
    } else { // LOAD ALL OPTION TO VIEW/DOWLOAD FILES  
        window.external.downloadAndOpenDriveFiles(baseFolderId);
    }
}

$("#upload_file").on('click', function () {
 
    $("#file-input").trigger('click');
});

// Handle file input change
fileInput.on('change', function (e) {
    e.preventDefault(); // Prevent opening in a new tab

    var files = fileInput[0].files;
    handleFiles(files);

    // Hide drop area when files are selected
    dropArea.show();
});

function handleFiles(files) {

    for (var i = 0; i < files.length; i++) {
        var j = 0;
        var file = files[i];
        var filename = file.name; 
        var extension = filename.split('.');
        var index = +extension.length - 1;
        extension = extension[index];
        let fileEntry = '';

        var reader = new FileReader();
        reader.onload = function (readerEvent) {
            var base64String = readerEvent.target.result;

            switch (extension.toLowerCase()) {
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                    retFileData = '<img src="' + base64String + '" class="img-fluid" style="height:50px;width:100%;" /><p class="att_file_base_64" hidden>' + base64String + '</p>';
                    break;
                case 'zip':
                case 'rar':
                    retFileData = '<i class="fas fa-file-alt" style="font-size:50px;"></i><p class="att_file_base_64" hidden>' + base64String + '</p>';
                    break;
                case 'pdf':
                    retFileData = '<i class="fas fa-file-pdf" style="font-size:50px;"></i><p class="att_file_base_64" hidden>' + base64String + '</p>';
                    break;
                case 'docx':
                    retFileData = '<i class="fas fa-file-word" style="font-size:50px;"></i><p class="att_file_base_64" hidden>' + base64String + '</p>';
                    break;
                case 'pptx':
                    retFileData = '<i class="fas fa-file-powerpoint" style="font-size:50px;"></i><p class="att_file_base_64" hidden>' + base64String + '</p>';
                    break;
                case 'xls':
                case 'xlsx':
                    retFileData = '<i class="fas fa-file-excel" style="font-size:50px;"></i><p class="att_file_base_64" hidden>' + base64String + '</p>';
                    break;
                default:
                    retFileData = '<i class="fas fa-file-alt" style="font-size:50px;"></i><p class="att_file_base_64" hidden>' + base64String + '</p>';

            }

            fileEntry = '<div class="files col-4 col-md-3 col-lg-2 mb-1 p-1">';
            fileEntry += '<div class="card h-100">';
            fileEntry += '<div class="d-flex justify-content-end text-light"><i class="fas fa-times-circle bg-danger rounded  remove_att p-1"></i></div>';
            fileEntry += '<div class="file_view mt-1 d-flex justify-content-center">';
            fileEntry += retFileData;
            fileEntry += '</div>';
            fileEntry += '<div class="file_name">' + files[j].name + '</div>';
            fileEntry += '</div>';
            fileEntry += '</div>';
            fileList.append(fileEntry);
            $('.remove_att').off('click').on('click', function () {
                $(this).closest('.files').remove();
            });
            j++;
        };
        reader.readAsDataURL(file); 
    }
};


$("#btnUploadFiles").on('click', function () {
     
    
    var attach_data = [];
      
    $('.files').each(function (index, element) {
        debugger;
        var attachment = $(element).find('.att_file_base_64').html();
        var filename = $(element).find('.file_name').html();

        var fileData = {
            attachment: attachment,
            filename: filename,
            baseFolderId: baseFolderId

        };

        attach_data.push(fileData);
    });


    var send_msg = {
        "attach_data": attach_data 
    };
    window.external.uploadDriveFiles(JSON.stringify(send_msg));
    $('#close_attach_area').trigger("click");
 
});
$('#close_attach_area').on('click', function () {
    $("#drop-area").hide(500);
    $("#flie_list_area").html('');

});
$('#btnCreateFolder').click(function () {  
    window.external.createNewFolder(baseFolderId, $("#txtFolderName").val());
});


$('#chatlist_tab').click(function () {

    $('#chatlist_tab').removeClass('leftrighttop');
    $('#chatlist_tab .menu-box').removeClass('active');

    $('#drive_tab').removeClass('middlelefttop').removeClass('middletopright');
    $('#drive_tab .menu-box').removeClass('active');

    $('#profile_tab').removeClass('rightlefttop');
    $('#profile_tab .menu-box').removeClass('active');

    $('#chatlist_tab .menu-box').addClass('active');
    $('#drive_tab').addClass('middlelefttop');

    $('#profile_area').removeClass('show').addClass('hide');
    $('#drive_area').removeClass('show').addClass('hide');
    $('#chatlist_area').removeClass('hide').addClass('show');
});

$('#drive_tab').click(function () {
    $('#drive_tab').removeClass('leftrighttop');
    $('#chatlist_tab .menu-box').removeClass('active');

    $('#drive_tab').removeClass('middlelefttop').removeClass('middletopright');
    $('#drive_tab .menu-box').removeClass('active');

    $('#profile_tab').removeClass('rightlefttop');
    $('#profile_tab .menu-box').removeClass('active');

    $('#drive_tab .menu-box').addClass('active');
    $('#chatlist_tab').addClass('leftrighttop');
    $('#profile_tab').addClass('rightlefttop');

    $('#profile_area').removeClass('show').addClass('hide');
    $('#chatlist_area').removeClass('show').addClass('hide');
    $('#drive_area').removeClass('hide').addClass('show');


    // 
    window.external.getUserDriveFolders(0);
});

$('#profile_tab').click(function () {
    $('#profile_tab').removeClass('rightlefttop');
    $('#chatlist_tab').removeClass('leftrighttop');
    $('#chatlist_tab .menu-box').removeClass('active');

    $('#drive_tab').removeClass('middlelefttop').removeClass('middletopright');
    $('#drive_tab .menu-box').removeClass('active');

    $('#profile_tab').removeClass('rightlefttop');
    $('#profile_tab .menu-box').removeClass('active');

    $('#profile_tab').removeClass('rightlefttop');
    $('#profile_tab .menu-box').addClass('active');
    $('#drive_tab').addClass('middletopright');

    $('#drive_area').removeClass('show').addClass('hide');
    $('#chatlist_area').removeClass('show').addClass('hide');
    $('#profile_area').removeClass('hide').addClass('show');
});

$('.drive_attach_btn').click(function () {
    $('.action_menu').toggle();
});

$('.btn-setting-menu').click(function () {
    console.log('btn-setting-menu',)
    $('#sidebar').removeClass('hide-sidebar').addClass('show-sidebar');
});

$('.close-side-btn').click(function () {
    $('#sidebar').removeClass('show-sidebar').addClass('hide-sidebar');
});


 function filterChats() {
        // Get the search input value
        var searchValue = document.getElementById("searchInput").value.toLowerCase();

        // Get all chat boxes
        var chatBoxes = document.querySelectorAll(".chat-box");

        chatBoxes.forEach(function (chatBox) {
            var chatTitle = chatBox.querySelector(".chat-title h3").textContent.toLowerCase();
            var chatDate = chatBox.querySelector(".chat-title span").textContent.toLowerCase();

          
            if (chatTitle.includes(searchValue) || chatDate.includes(searchValue)) {
                chatBox.style.display = "flex";  
            } else {
                chatBox.style.display = "none";  
            }
        });
    }