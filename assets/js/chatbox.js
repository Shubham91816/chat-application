
var imageVArea = $("#image-view-area");
imageVArea.hide();
var dropArea = $("#drop-area");
var encmsgArea = $("#encmsg-view-area");
var fileInput = $("#file-input");
var fileList = $("#flie_list_area");
//

window.external.callCheckToken("");
// Prevent default drag behaviors
$(document).on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
});

// Highlight drop area when a file is dragged over it
$(document).on('dragover', function () {
    dropArea.addClass('highlight');
    dropArea.show(); // Show drop area when files are dragged over it
});

// Unhighlight drop area when a file is dragged out of it
dropArea.on('dragleave dragend', function () {
    dropArea.removeClass('highlight');
    dropArea.hide(); // hide drop area when files are dragged leave
});

// Handle dropped files
dropArea.on('drop', function (e) {
    e.preventDefault(); // Prevent opening in a new tab

    dropArea.removeClass('highlight');

    var files = e.originalEvent.dataTransfer.files;
    handleFiles(files);

    // Hide drop area when files are dropped
    //dropArea.hide();
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
        var file = files[i];
        var filename = file.name;
        var extension = filename.split('.');
        var index = +extension.length - 1;
        extension = extension[index];
        let fileEntry = '';
        var j = 0;
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

   
$("#att_flie").on('click',function () {
    $("#file-input").trigger('click');
});



$("#send_msg").on('click', function () {




    var message = $("#message").val();
    var isEncrypt = ($("#chkSign").is(':checked') == true ? 1 : 0);
    var attach_data = [];
    if (isEncrypt == 1) {
        var result = confirm("Are you sure you want to sign the message?");
        if (result) {
            // The user clicked OK 
            if (currentUserCertId == "0") {
                alert("Proceed to Token Enrollment!");
                window.external.LoanEnrollPage();
                return;
            }
        } else {
            // The user clicked Cancel 
        }
    } else {
        isEncrypt = 0;
    }

    $('.files').each(function (index, element) {
        debugger;
        var attachment = $(element).find('.att_file_base_64').html();
        var filename = $(element).find('.file_name').html();

        var fileData = {
            attachment: attachment,
            filename: filename,
            isEncrypt: isEncrypt
        };

        attach_data.push(fileData);
    });


    var send_msg = {
        "attach_data": attach_data,
        "message": message,
        "isEncrypt": isEncrypt
    };
    window.external.SendMessage(JSON.stringify(send_msg));
    $('#close_attach_area').trigger("click");
    $("#message").val("");
});

window.external.getChatUserDetails();
function loadChatUserDetails(args) {
    var dets = JSON.parse(args);
    //$(".cls_current_user_name").text(dets[0].activeChatboxUserId);
    $(".cls_chatUserName").text(dets[0].activeChatboxUserName);
    $(".cls_user_img")[0].src = dets[0].activeChatboxUserDP;
    to_user = dets[0].activeChatboxUserId;
    toUserId = dets[0].activeChatboxUserId;
    toUserName = dets[0].activeChatboxUserName;
    toUserDP = dets[0].activeChatboxUserDP;
    toUserPublicKey = dets[0].activeChatboxUserPublicKey
    if (toUserPublicKey == 0) {
        $(".cls_encArea").hide();
    }
}


window.external.getUserDetails();
function loadUserDetails(args) {
    var dets = JSON.parse(args);
    currentUserName = dets[0].currentUserName;
    currentUserId = dets[0].currentUserId;
    currentUserDP = dets[0].currentUserDP;
    self_user = dets[0].currentUserId;
    currentUserCertId = dets[0].cert_id;
    
}
window.external.getMessageHistory();

 

function setSentMessage(args) {
    let chat = JSON.parse(args)[0]; 
    var fileExt = chat.file_tag.split(".")[1];
    var show_messages = "";
    show_messages += '  <div class="row message_sent mb-3">';
    show_messages += '      <div class="col-2 p-0 time-flex">';
    show_messages += '          <div class="sent_status"><i class="fas fa-check-double"></i></div>';
    show_messages += '          <div class="message_time">' + chat.publish_datetime + '</div>';
    show_messages += '      </div>';
    // FOR LOCK
    if (chat.isEncrypted == 1) {
        show_messages += '<i class="fas fa-lock"></i>';
    }
    show_messages += '      <div class="col-10 p-0 pr-2 message_show">';
    show_messages += '          <div class="action_menu">';
    show_messages += '              <ul>';
    if (chat.message_type != '1') {
      //  show_messages += '<li class="border-bottom delete_message view" data-id="' + chat.msg_id + '"><i class="fas fa-trash"></i> View </li>';
        show_messages += '<li class="border-bottom delete_message download" data-id="' + chat.msg_id + '"><i class="fas fa-trash"></i> </li>';
      //  show_messages += '<li class="border-bottom delete_message delete" data-id="' + chat.msg_id + '"><i class="fas fa-trash"></i> Delete </li>'; 
    } //else {
       // show_messages += '<li class="border-bottom delete_message" data-id="' + chat.msg_id + '"><i class="fas fa-trash"></i> Delete </li>';
   // } 
    show_messages += '              </ul>';
    show_messages += '          </div>';
    show_messages += '          <div class="message-box">';

    // IN CASE OF IMAGES 
    if (chat.message_type != '1') {   
        show_messages += '<div class="d-list col-12 mb-2 bg-light p-2">'; 
        if (fileExt == "jpg" || fileExt == "jpeg") {
            show_messages += '<img src="' + chat.file_thumb + '" data-filetag="' + chat.file_tag + '" class="img-fluid clsImageMsg" style="height:150px;width:100%;">';
            show_messages += '<p hidden class="m-0 d-flex p-0 filename_' + chat.msg_id + '">' + chat.file_tag + '</p>';
            show_messages += '<p hidden class="att_' + chat.msg_id + '">' + chat.file_thumb + '</p>';
        } else { 
            show_messages += '<div class="col-2 icon p-0 pl-2"><i class="fas fa-' + getFileType(fileExt) + '"></i></div>';
            show_messages += '<p hidden class="m-0 d-flex p-0 filename_' + chat.msg_id + '">' + chat.file_tag + '</p>';
        }
        show_messages += '</div>';

    }
    show_messages += '              <div class="message">' + chat.message_text + '</div>';


    show_messages += '          </div>';
    show_messages += '      </div>';
    show_messages += '  </div>';
    //show_messages += '<div class="d-flex justify-content-end mb-4">';
    //show_messages += '<div class="msg_cotainer_send">';
    //show_messages += '<div class="dropdown mb-3">';
    //show_messages += '<span class="text-right text-primary toogle" data-toggle="dropdown"><i class="fas fa-chevron-circle-down"></i></span>';
    //show_messages += '<div class="dropdown-menu">';
    //if (chat.message_type != '1') {
    //    show_messages += '<a class="dropdown-item view" data-id="' + chat.msg_id + '" href="#">View</a>';
    //    show_messages += '<a class="dropdown-item download" data-id="' + chat.msg_id + '" href="#">Download</a>';
    //    show_messages += '<a class="dropdown-item delete" data-id="' + chat.msg_id + '" href="#">Delete</a>';
    //} else {
    //    show_messages += '<a class="dropdown-item delete" data-id="' + chat.msg_id + '" href="#">Delete</a>';
    //}
    //show_messages += '</div>';
    //show_messages += '</div>';
    //if (chat.message_type != '1') {
    //    show_messages += '<div>';
    //    show_messages += '<img src="' + chat.file_thumb + '" class="img-fluid" style="height:150px;width:100%;">';
    //    show_messages += '<p hidden class="m-0 d-flex p-0 filename_' + chat.msg_id + '">' + chat.file_tag + '</p>';
    //    show_messages += '<p hidden class="att_' + chat.msg_id + '">' + chat.file_data + '</p>';
    //    show_messages += '</div>';
    //}
    //show_messages += '<div>' + chat.message_text + '</div>';
    //show_messages += '<span class="msg_time_send">' + chat.publish_datetime + '</span>';
    //show_messages += '</div>';
    //show_messages += '<div class="img_cont_msg">';
    //show_messages += '<img src="' + currentUserDP + '" class="rounded-circle user_img_msg">';
    //// FOR LOCK
    //if (chat.isEncrypted == 1) {
    //    show_messages += '<i class="fas fa-lock"></i>';
    //}
    //show_messages += '</div>';
    //show_messages += '</div>';
    $(".msg_card_body").append(show_messages);

    $(".view").off('click').on('click', function () {
        var dataId = $(this).attr('data-id');
        var filename = $('.filename_' + dataId).html();
        var fileContent = $('.att_' + dataId).html();
    });
    $(".clsImageMsg").off('click').on('click', function () {
        var data = $(this).attr('src');
        var dataFileTag = $(this).data('filetag');
        imageVArea.addClass('highlight');
        imageVArea.show(); 
        $(".cls_imageV")[0].src = data;  
        $(".cls_imageVTag").text(dataFileTag); 
    });
    $(".download").off('click').on('click', function () {
        var dataId = $(this).attr('data-id');
        var filename = $('.filename_' + dataId).html();
        var fileContent = $('.att_' + dataId).html();
        fileContent = fileContent.split(",");
        fileContent = fileContent[1];
        window.external.DownloadFile(fileContent, filename);
    });
    autoScroll();
}
function formatDateTime(dateTimeString) {
    // Parse the input date string
    
    var date = new Date(dateTimeString);
    var formattedDate = "";
    var monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    // Get today's date
    var today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight

    // Calculate the time difference in milliseconds
    var timeDifference = today.getTime() - date.getTime();

    // Check if the given date is today
    if (timeDifference >= 0 && timeDifference < 24 * 60 * 60 * 1000) {
        // Today
        var hours = date.getHours() % 12 || 12; // Use 12 when hours is 0
        var minutes = date.getMinutes();
        var ampm = hours < 12 ? 'AM' : 'PM';
        formattedDate = 'Today, ' + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + ampm;

    } else if (timeDifference >= 24 * 60 * 60 * 1000 && timeDifference < 2 * 24 * 60 * 60 * 1000) {
        // Yesterday
        var hours = date.getHours() % 12 || 12; // Use 12 when hours is 0
        var minutes = date.getMinutes();
        var ampm = hours < 12 ? 'AM' : 'PM';
        formattedDate = 'Yesterday, ' + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + ampm;
    } else {
        var hours = date.getHours() % 12 || 12; // Use 12 when hours is 0
        var ampm = date.getHours() < 12 ? 'AM' : 'PM';
        formattedDate = date.getFullYear() + ' ' + monthNames[date.getMonth()] + ' ' + date.getDate() + ' ' + ('0' + hours).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ' ' + ampm;
        
    }
    return formattedDate;
}

function getFileType(ext) {
    switch (ext) {
        case "xlsx":
        case "xls":
            return "file-excel";
        case "doc":
        case "docx":
            return "file-word";
        case "ppt":
        case "pptx":
            return "file-powerpoint";
        case "pdf":
            return "file-pdf";
        case "png":
        case "jpg":
        case "jpeg":
            return "file-image";
        default:
            return "";
    } 
}
function LoadPendingChats(args) {
  
    var show_messages = '';
    
//    args = '[\
//        {\
//            "msg_id": "msg_001",\
//            "from_user": "binod@sourceinfosys.com",\
//            "to_user_group": "pravin@sourceinfosys.com",\
//            "publish_type": "1",\
//            "message_type": "text",\
//            "message_text": "message receive from this user",\
//            "file_tag": "",\
//"message_date": "2024-01-02 12:17:00",\
//            "file_data": ""\
//        },\
//        {\
//            "msg_id": "msg_002",\
//            "from_user": "pravin@sourceinfosys.com",\
//            "to_user_group": "binod@sourceinfosys.com",\
//            "publish_type": "1",\
//            "message_type": "text",\
//            "message_text": "Message send by me",\
//            "file_tag": "",\
//"message_date": "2022-06-22 12:16:00",\
//            "file_data": ""\
//        },\
//        {\
//            "msg_id": "msg_003",\
//            "from_user": "binod@sourceinfosys.com",\
//            "to_user_group": "pravin@sourceinfosys.com",\
//            "publish_type": "1",\
//            "message_type": "attachement",\
//            "message_text": "message receive from this user",\
//            "file_tag": "",\
//"message_date": "2022-06-22 12:16:00",\
//            "file_data": ""\
//        },\
//        {\
//            "msg_id": "msg_004",\
//            "from_user": "pravin@sourceinfosys.com",\
//            "to_user_group": "binod@sourceinfosys.com",\
//            "publish_type": "1",\
//            "message_type": "attachement",\
//            "message_text": "Message send by me",\
//            "file_tag": "",\
//            "message_date": "2022-06-22 12:16:00",\
//            "file_data": ""\
//        }\
//    ]';

    // If you need to parse args back to a JavaScript object
    let receive_msg = JSON.parse(args);

    for (var i = 0; i < receive_msg.length; i++) {

        var chat = receive_msg[i];
        var fileExt = chat.file_tag.split(".")[1];
        var formattedDate = formatDateTime(chat.message_date);
        if (chat.publish_type == 1) {
            //single user chat
            if (to_user == chat.from_user && self_user == chat.to_user_group) {
                //message receive 
                show_messages += ' <div class="row message_receive mb-3">';
                show_messages += '     <div class="col-10 p-0 text-left pl-2 message_show">';
                show_messages += '         <div class="action_menu">';
                show_messages += '             <ul>';
                if (chat.message_type != '1') {
                //    show_messages += '<li class="border-bottom delete_message view" data-id="' + chat.msg_id + '"><i class="fas fa-trash"></i> View </li>';
              show_messages += '<li class="download" data-id="' + chat.msg_id + '"><i class="fas fa-download"></i>  </li>';
                //    show_messages += '<li class="border-bottom delete_message delete" data-id="' + chat.msg_id + '"><i class="fas fa-trash"></i> Delete </li>';
                }// else {
                //    show_messages += '<li class="border-bottom delete_message" data-id="' + chat.msg_id + '"><i class="fas fa-trash"></i> Delete </li>';
                //} 
                show_messages += '             </ul>';
                show_messages += '         </div>';
                show_messages += '         <div class="message-box">';

                if (chat.isEncrypted == 1) {
                    show_messages += '<i class="message cls_vEncmsg" id="' + chat.msg_id + '" style="cursor:pointer"> <i class="fas fa-lock"></i> Click here to view the encrypted message</i>';
                } else {
                    // IN CASE OF IMAGES 
                    if (chat.message_type != '1') {
                        show_messages += '<div class="d-list col-12 mb-2 bg-light p-2">';
                         
                        if (fileExt == "jpg" || fileExt == "jpeg") {
                            show_messages += '<img src="' + chat.file_thumb + '" data-filetag="' + chat.file_tag + '" class="img-fluid clsImageMsg" style="height:150px;width:100%;">';
                            show_messages += '<p hidden class="m-0 d-flex p-0 filename_' + chat.msg_id + '">' + chat.file_tag + '</p>';
                            show_messages += '<p hidden class="att_' + chat.msg_id + '">' + chat.file_thumb + '</p>'; 
                        } else {    
                            show_messages += '<div class="col-2 icon p-0 pl-2"><i class="fas fa-' + getFileType(fileExt) + '"></i></div>';
                            show_messages += '<p hidden class="m-0 d-flex p-0 filename_' + chat.msg_id + '">' + chat.file_tag + '</p>';
                        }
                        show_messages += '</div>';  
                    }
                    show_messages += '<div class="message">' + chat.message_text + '</div>';
                }
                
                show_messages += '         </div>';
                show_messages += '     </div>';
                show_messages += '     <div class="col-2 p-0 time-flex">';
                show_messages += '         <div class="message_time">' + chat.publish_datetime +'</div>';
                show_messages += '     </div>';
                show_messages += ' </div>';


                //show_messages += '<div class="d-flex justify-content-start mb-4">';
                //show_messages += '<div class="img_cont_msg">';
                //show_messages += '<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">';
                //show_messages += '</div>';
                //show_messages += '<div class="msg_cotainer">';
                //show_messages += '<div class="dropdown mb-3">';
                //if (chat.message_type != 'text') {
                //    show_messages += '<span class="text-right text-primary toogle" data-toggle="dropdown"><i class="fas fa-chevron-circle-down"></i></span>';
                //}
                //show_messages += '<div class="dropdown-menu">';
                //if (chat.message_type != 'text') {
                //    show_messages += '<a class="dropdown-item view" data-id="' + chat.msg_id + '" href="#">View</a>';
                //    show_messages += '<a class="dropdown-item download" data-id="' + chat.msg_id + '" href="#">Download</a>';
                //} else {

                //}
                //show_messages += '</div>';
                //show_messages += '</div>';
                
                //if (chat.message_type != 'text') {
                //    show_messages += '<div>';
                //    show_messages += '<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="img-fluid" style="height:150px;width:100%;">';
                //    show_messages += '<p hidden class="m-0 d-flex p-0 filename_' + chat.msg_id + '">' + chat.file_tag + '</p>';
                //    show_messages += '<p hidden class="att_' + chat.msg_id + '">' + chat.file_data + '</p>';
                //    show_messages += '</div>';
                //}
                
                //show_messages += '<div>' + chat.message_text + '</div>';
                //show_messages += '<span class="msg_time">' + chat.message_date +'</span>';
                //show_messages += '</div>';
                //show_messages += '</div>';

            } else if (to_user == chat.to_user_group && self_user == chat.from_user) {
                //message send by me
                show_messages += '  <div class="row message_sent mb-3">';
                show_messages += '      <div class="col-2 p-0 time-flex">';
                show_messages += '          <div class="sent_status"><i class="fas fa-check-double"></i></div>';
                show_messages += '          <div class="message_time">' + chat.publish_datetime +'</div>';
                show_messages += '      </div>';
                show_messages += '      <div class="col-10 p-0 pr-2 message_show">';
                show_messages += '          <div class="action_menu">';
                show_messages += '              <ul>';
               if (chat.message_type != '1') {
                //    show_messages += '<li class="border-bottom delete_message view" data-id="' + chat.msg_id + '"><i class="fas fa-trash"></i> View </li>';
                   show_messages += '<li class="download" data-id="' + chat.msg_id + '"><i class="fas fa-download"></i>  </li>';
                //    show_messages += '<li class="border-bottom delete_message delete" data-id="' + chat.msg_id + '"><i class="fas fa-trash"></i> Delete </li>';
                }// else {
                //    show_messages += '<li class="border-bottom delete_message" data-id="' + chat.msg_id + '"><i class="fas fa-trash"></i> Delete </li>';
                //} 
                show_messages += '              </ul>';
                show_messages += '          </div>';
                show_messages += '          <div class="message-box">';
                // IN CASE OF IMAGES 
                if (chat.message_type != '1') {
                    show_messages += '<div class="d-list col-12 mb-2 bg-light p-2">'; 
                    if (fileExt == "jpg" || fileExt == "jpeg") {
                        show_messages += '<img src="' + chat.file_thumb + '" data-filetag="' + chat.file_tag + '" class="img-fluid clsImageMsg" style="height:150px;width:100%;">';
                        show_messages += '<p hidden class="m-0 d-flex p-0 filename_' + chat.msg_id + '">' + chat.file_tag + '</p>';
                        show_messages += '<p hidden class="att_' + chat.msg_id + '">' + chat.file_thumb + '</p>';
                    } else { 
                        show_messages += '<div class="col-2 icon p-0 pl-2"  ><i class="fas fa-' + getFileType(fileExt) + '"></i></div>';
                        show_messages += '<p hidden class="m-0 d-flex p-0 filename_' + chat.msg_id + '">' + chat.file_tag + '</p>';
                    }
                    show_messages += '</div>';  
                }
                show_messages += '              <div class="message">' + chat.message_text + '</div>';
                show_messages += '          </div>'; 
                show_messages += '      </div>';
                show_messages += '  </div>';

                //show_messages += '<div class="d-flex justify-content-end mb-4">';
                //show_messages += '<div class="msg_cotainer_send">';
                //show_messages += '<div class="dropdown mb-3">';
                //show_messages += '<span class="text-right text-primary toogle" data-toggle="dropdown"><i class="fas fa-chevron-circle-down"></i></span>';
                //show_messages += '<div class="dropdown-menu">';
                //if (chat.message_type != 'text') {
                //    show_messages += '<a class="dropdown-item view" data-id="' + chat.msg_id + '" href="#">View</a>';
                //    show_messages += '<a class="dropdown-item download" data-id="' + chat.msg_id + '" href="#">Download</a>';
                //    show_messages += '<a class="dropdown-item delete" data-id="' + chat.msg_id + '" href="#">Delete</a>';
                //} else {
                //    show_messages += '<a class="dropdown-item delete" data-id="' + chat.msg_id + '" href="#">Delete</a>';
                //}
                //show_messages += '</div>';
                //show_messages += '</div>';
                //if (chat.message_type != 'text') {
                //    show_messages += '<div>';
                //    show_messages += '<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="img-fluid" style="height:150px;width:100%;">';
                //    show_messages += '<p hidden class="m-0 d-flex p-0 filename_' + chat.msg_id + '">' + chat.file_tag + '</p>';
                //    show_messages += '<p hidden class="att_' + chat.msg_id + '">' + chat.file_data + '</p>';
                //    show_messages += '</div>';
                //}
                //show_messages += '<div>' + chat.message_text + '</div>';               
                //show_messages += '<span class="msg_time_send">' + chat.message_date +'</span>';
                //show_messages += '</div>';
                //show_messages += '<div class="img_cont_msg">';
                //show_messages += '<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">';
                //show_messages += '</div>';
                //show_messages += '</div>';
            }


        }
        //else if (chat.publish_type == 2) {
        //    //group user chat
        //    if (to_user == chat.to_user_group && self_user == chat.from_user) {
        //        //message send by me
        //        show_messages += '<div class="d-flex justify-content-end mb-4">';
        //        show_messages += '<div class="msg_cotainer_send">';
        //        show_messages += '<div class="dropdown mb-3">';
        //        show_messages += '<span class="text-right text-primary toogle" data-toggle="dropdown"><i class="fas fa-chevron-circle-down"></i></span>';
        //        show_messages += '<div class="dropdown-menu">';
        //        if (chat.message_type != 'text') {
        //            show_messages += '<a class="dropdown-item view" data-id="' + chat.msg_id + '" href="#">View</a>';
        //            show_messages += '<a class="dropdown-item download" data-id="' + chat.msg_id + '" href="#">Download</a>';
        //            show_messages += '<a class="dropdown-item delete" data-id="' + chat.msg_id + '" href="#">Delete</a>';
        //        } else {
        //            show_messages += '<a class="dropdown-item delete" data-id="' + chat.msg_id + '" href="#">Delete</a>';
        //        }
        //        show_messages += '</div>';
        //        show_messages += '</div>';
        //        if (chat.message_type != 'text') {
        //            show_messages += '<div>';
        //            show_messages += '<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="img-fluid" style="height:150px;width:100%;">';
        //            show_messages += '<p hidden class="m-0 d-flex p-0 filename_' + chat.msg_id + '">' + chat.file_tag + '</p>';
        //            show_messages += '<p hidden class="att_' + chat.msg_id + '">' + chat.file_data + '</p>';
        //            show_messages += '</div>';
        //        }
        //        show_messages += '<div>' + chat.message_text + '</div>';
        //        show_messages += '<span class="msg_time_send">' + chat.message_date + '</span>';
        //        show_messages += '</div>';
        //        show_messages += '<div class="img_cont_msg">';
        //        show_messages += '<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">';
        //        show_messages += '</div>';
        //        show_messages += '</div>';
                
        //    } else {
        //        //message receive from group
        //        show_messages += '<div class="d-flex justify-content-start mb-4">';
        //        show_messages += '<div class="img_cont_msg">';
        //        show_messages += '<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">';
        //        show_messages += '</div>';
        //        show_messages += '<div class="msg_cotainer">';
        //        show_messages += '<div class="dropdown mb-3">';
        //        if (chat.message_type != 'text') {
        //            show_messages += '<span class="text-right text-primary toogle" data-toggle="dropdown"><i class="fas fa-chevron-circle-down"></i></span>';
        //        }
        //        show_messages += '<div class="dropdown-menu">';
        //        if (chat.message_type != 'text') {
        //            show_messages += '<a class="dropdown-item view" data-id="' + chat.msg_id + '" href="#">View</a>';
        //            show_messages += '<a class="dropdown-item download" data-id="' + chat.msg_id + '" href="#">Download</a>';
        //        } else {

        //        }
        //        show_messages += '</div>';
        //        show_messages += '</div>';

        //        if (chat.message_type != 'text') {
        //            show_messages += '<div>';
        //            show_messages += '<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="img-fluid" style="height:150px;width:100%;">';
        //            show_messages += '<p hidden class="m-0 d-flex p-0 filename_' + chat.msg_id + '">' + chat.file_tag + '</p>';
        //            show_messages += '<p hidden class="att_' + chat.msg_id + '">' + chat.file_data + '</p>';
        //            show_messages += '</div>';
        //        }

        //        show_messages += '<div>' + chat.message_text + '</div>';
        //        show_messages += '<span class="msg_time">' + chat.message_date + '</span>';
        //        show_messages += '</div>';
        //        show_messages += '</div>';
                
        //    }
        //}
    }

    $(".msg_card_body").append(show_messages); 
    $(".clsImageMsg").off('click').on('click', function () {
        var data = $(this).attr('src');
        var dataFileTag = $(this).data('filetag');
        imageVArea.addClass('highlight');
        imageVArea.show();
        $(".cls_imageV")[0].src = data;
        $(".cls_imageVTag").text(dataFileTag);
    });

    $(".cls_vEncmsg").off('click').on('click', function () {
        var data = $(this).attr('src');
        var dataFileTag = $(this).data('filetag');
       //  encmsgArea.addClass('highlight');
        // encmsgArea.show(); 
        var id = $(this).attr('id');
        window.external.callCheckToken(id);
    });
    $(".download").off('click').on('click', function () {
        var dataId = $(this).attr('data-id');
        var filename = $('.filename_' + dataId).html();
        var fileContent = $('.att_' + dataId).html(); 
        window.external.DownloadFile(dataId);
    });
    autoScroll();
}

function checkTokenStatus2(args) {
    var rcvdData = JSON.parse(args);   
    if (rcvdData["DATA"] == "") {
        $(".cls_encArea").hide();
    } else {
        $(".cls_encArea").show();
    }
}
function checkTokenStatus(args, msg) {
    var rcvdData = JSON.parse(args);   
    if (rcvdData["DATA"] == "") {
        alert("Digital Signature Not Connected");
        encmsgArea.hide();
        $('#close_encmsg_area').trigger('click');
    } else {
        encmsgArea.show();
        $("#v_encmsg_text").text(msg); 
    }
}
function autoScroll() {
    //var element = document.getElementsByClassName("msg_card_body");
    //element.scrollTop = element.scrollHeight;

    var scrollableDiv = $('.msg_card_body');
    scrollableDiv.scrollTop(scrollableDiv.prop("scrollHeight"))
}
function goBack() {
    window.external.ChatList();
}
 




$("#attach_new").on('click', function () {
    $("#file-input").trigger('click');
});

$("#attach_send").on('click', function () {
    var message = $("#attach_msg").val();
    var isEncrypt = ($("#chkSign").is(':checked') == true ? 1 : 0);
    var attach_data = [];
    if (isEncrypt == 1) {
        var result = confirm("Are you sure you want to sign the message?");
        if (result) {
            // The user clicked OK 
            if (currentUserCertId == "0") {
                alert("Proceed to Token Enrollment!");
                window.external.LoanEnrollPage();
                return;
            }
        } else {
            // The user clicked Cancel 
        }
    } else {
        isEncrypt = 0;
    }
    var attach_data = [];

    $('.files').each(function (index, element) {
        debugger;
        var attachment = $(element).find('.att_file_base_64').html();
        var filename = $(element).find('.file_name').html();

        var fileData = {
            attachment: attachment,
            filename: filename,
            isEncrypt: isEncrypt

        };

        attach_data.push(fileData);
    });


    var send_msg = {
        "attach_data": attach_data,
        "message": message,
        "isEncrypt": isEncrypt
    };
    window.external.SendMessage(JSON.stringify(send_msg));
    $('#close_attach_area').trigger("click");
    $("#attach_msg").val("");
});

 
$('.setting').click(function () {   
    $('.action_menu_btn .action_menu').toggle();
});

$('#close_attach_area').on('click', function () {
    $("#drop-area").hide(500);
    $("#flie_list_area").html('');

});
$('#close_imageV_area').on('click', function () {
    $("#image-view-area").hide(500);  
});
$('#close_encmsg_area').on('click', function () {
    $("#encmsg-view-area").hide(500);
});

$("#encrypet").on('change',function(){
    if($("#encrypet").is(":checked")){
        $(".encrypt_icon").html('<i class="fas fa-lock"></i>');
    }else{
        $(".encrypt_icon").html('<i class="fas fa-lock-open"></i>')
    }
});

$("#view_profile").on('click',function(){
    $("#view_other_profile").show();
});

$('#close_other_profile').on('click', function () {
    $("#view_other_profile").hide();
});

$("#add_to_group").on('click',function(){
    $("#add_to_group_div").show();
});

$('#close_add_to_group').on('click', function () {
    $("#add_to_group_div").hide();
});
