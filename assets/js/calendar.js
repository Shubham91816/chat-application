$(document).ready(function() {
  const daysTag = $(".days");
  const currentDate = $(".current-date");
  const prevNextIcon = $(".icons span");

  let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  function renderCalendar()  {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
      lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
      lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
      lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
    let liTag = "";
  
    for (let i = firstDayofMonth; i > 0; i--) {
      liTag += '<li class="inactive">' + (lastDateofLastMonth - i + 1) + '</li>';
    }
  
    for (let i = 1; i <= lastDateofMonth; i++) {
      let isToday =
        i === date.getDate() &&
        currMonth === new Date().getMonth() &&
        currYear === new Date().getFullYear()
          ? "active"
          : "";
      liTag += '<li class="' + isToday + '" onclick="openPopup(\'' + currYear + '-' + (currMonth + 1) + '-' + i + '\')">' + i + '</li>';
    }
  
    for (let i = lastDayofMonth; i < 6; i++) {
      liTag += '<li class="inactive">' + (i - lastDayofMonth + 1) + '</li>';
    }
    currentDate.text(months[currMonth] + ' ' + currYear);
    daysTag.html(liTag);
  };
  
  renderCalendar();
  

  prevNextIcon.on("click", function () {
    currMonth = $(this).attr("id") === "prev" ? currMonth - 1 : currMonth + 1;

    if (currMonth < 0 || currMonth > 11) {
      date = new Date(currYear, currMonth, new Date().getDate());
      currYear = date.getFullYear();
      currMonth = date.getMonth();
    } else {
      date = new Date();
    }
    renderCalendar();
  });

  $(document).on("DOMContentLoaded", function () {
    var activities = $(".activity");

    activities.each(function () {
      if ($(this).text().length > 10) {
        $(this).addClass("truncate");
      }
    });
  });

  // open
  window.openPopup = function (clickedDate) {
    console.log("open function call", clickedDate);
    let popup = $("#popup1");
    let dateInput = $("#eventDate");
    dateInput.val(clickedDate);

    popup.addClass("open-popup");
  };

  window.closePopup = function () {
    let popup = $("#popup1");
    popup.removeClass("open-popup");
  };

  // dropdown
  var colors = [
    { hex: "#00759A", name: "Blue" },
    { hex: "#F7941D", name: "Orange" },
    { hex: "#A71930", name: "Red" },
    { hex: "#679146", name: "Green" },
  ];

  var app = new Vue({
    el: "#color-picker",
    data: {
      active: false,
      selectedColor: "",
      selectedColorName: "",
      colors: colors,
    },
    computed: {
      selector: function () {
        if (!this.selectedColor) {
          return "Color";
        } else {
          return (
            '<span style="background: ' +
            this.selectedColor +
            '"></span> ' +
            this.selectedColorName
          );
        }
      },
    },
    methods: {
      setColor: function (color, colorName) {
        this.selectedColor = color;
        this.selectedColorName = colorName;
        this.active = false;
      },
      toggleDropdown: function () {
        this.active = !this.active;
      },
    },
  });

  window.showFormData = function () {
    console.log("show form data ");
    var groupName = $("#groupName").val();
    var eventDate = $("#eventDate").val();
    var color = $("#color-picker .wrapper-dropdown span").text();
    var fromTime = $("#fromTime").val();
    var toTime = $("#toTime").val();
    var activity = $("#activity").val();

    var newElement = $("<div>").attr({
      id: "eventData",
      class: "eventText"
    });
    
    newElement.html(
      '<div class="eventUpper">' +
        '<div class="eventColor" style="background: ' + color + ';"></div>' +
        '<div class=" Heigh">' + activity + '</div>' +
        '<div class="Heigh">' + eventDate + '</div>' +
        '<div class="Heigh1">' + fromTime + ' to ' + toTime + '</div>' +
      '</div>'
    );
    
    var parentDiv = $("#parentData");
    parentDiv.append(newElement);

    let popup = $("#popup1");
    popup.removeClass("open-popup");
  };
});