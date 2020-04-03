// Hour when the local work day begins, in 24-hour format
const WORK_DAY_START = 8;
// Hour when the local work day ends, in 24-hour format
const WORK_DAY_END = 20;
var currentWorkingDate; // day being displayed in yyyyMMdd format
const LOCK_IMG = "./assets/images/icons/lock-fill.svg";
const UNLOCK_IMG = "./assets/images/icons/unlock-fill.svg";

$(document).ready(function () {
  var dateObj = new Date();
  var currentHour = dateObj.getDate();
  renderDateInHeader();
  currentWorkingDate = "" + dateObj.getFullYear();
  var val = dateObj.getMonth() + 1;
  if (val < 10) currentWorkingDate += "0";
  currentWorkingDate += val;
  if ((val = dateObj.getDate()) < 10) currentWorkingDate += "0";
  currentWorkingDate += val;
  console.log(currentWorkingDate);
  renderScheduleSection();
});

/**
 * Displays the working date on the header portion of the Web page
 * @param yyyyMMdd The date to be displayed in yyyyMMdd format
 */
function renderDateInHeader(yyyyMMdd) {
  var dateObj;
  if (yyyyMMdd == null) dateObj = new Date();
  else {
    var dateString = yyyyMMdd.slice(0, 4) + "-" + yyyyMMdd.slice(4, 6) + "-" + yyyyMMdd.slice(6, 8);
    dateObj = new Date(dateString);
  }
  var dayOfMonth = dateObj.getDate();
  var year = dateObj.getFullYear();
  var month = "";
  switch (dateObj.getMonth()) {
    case 0:
      month = "January";
      break;
    case 1:
      month = "February";
      break;
    case 2:
      month = "March";
      break;
    case 3:
      month = "April";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "June";
      break;
    case 6:
      month = "July";
      break;
    case 7:
      month = "August";
      break;
    case 8:
      month = "September";
      break;
    case 9:
      month = "October";
      break;
    case 10:
      month = "November";
      break;
    case 11:
      month = "December";
      break;
  }
  var fullDate = month + " " + dayOfMonth + ", " + year;
  console.log(fullDate);
  console.log(getTimeLabel(dateObj.getHours()));
  $("#current-date").html(fullDate);
}

// Returns text for the hour of day. For example an if parameter is 8,
// it will return "8:00 AM". If parameter is 13, it will return "1:00 PM"
function getTimeLabel(hourOfDay) {
  var ampm = ":00 AM";
  if (hourOfDay >= 12) {
    ampm = ":00 PM";
    if (hourOfDay > 12) {
      hourOfDay -= 12;
    }
  }
  return hourOfDay + ampm;
}
/*
 * Returns DIV element representing one hour row
 *
 * <div class="row justify-content-center">
 *   <div class="col-md-2 time-column">
 *     <p>${timeLabel}</p>
 *   </div>
 *   <div class="col-md-9 details-column ${tense}">
 *     <input class="form-control input-style" type="text" ${readOnly} data-hour="${hourIndex}" value="${scheduleText}"/>
 *   </div>
 *   <div class="col-md-1 button-column">
 *     <button class="btn-primary">
 *       <img src="./assets/images/icons/lock-fill.svg" width="32" height="32" data-hour="${hourIndex}" data-lock="lock" />
 *     </button>
 *   </div>
 * </div>
 *
 * @param tense : one of the following: "present", "past", "future"
 * @param hourIndex : Integer hour of day between WORK_DAY_START and WORK_DAY_END
 * @param scheduleData: Information stored in localStorage for the day being displayed
 */
function getHourDiv(tense, hourIndex, scheduleData) {
  var timeLabel = getTimeLabel(hourIndex);
  var readOnly = "";
  var buttonState = "";
  var pastInput = "";
  if (tense == "past") {
    readOnly = "readonly";
    buttonState = "disabled";
    pastInput = "past-input";
  }
  if (hourIndex < 10) {
    hourIndex = "0" + hourIndex;
  }
  hourIndex = currentWorkingDate + hourIndex;
  var scheduleText = scheduleData[hourIndex.toString()];
  if (scheduleText == null) {
    scheduleText = "";
  }
  var divHtml = `<div class="row justify-content-center">
    <div class="col-md-2 time-column">
      <p>${timeLabel}</p>
    </div>
    <div class="col-md-9 details-column ${tense}">
    <input class="form-control input-style ${pastInput}" type="text" readonly data-hour="${hourIndex}"  value="${scheduleText}"/>
    </div>
    <div class="col-md-1 button-column">
      <button class="btn-primary edit-button" ${buttonState} data-hour="${hourIndex}">
        <img src="./assets/images/icons/lock-fill.svg" width="32" height="32" data-hour="${hourIndex}" data-lock="lock" />
      </button>
    </div>
  </div>`;
  return $(divHtml);
}

function getPresentHourDiv(hourIndex, scheduleData) {
  return getHourDiv("present", hourIndex, scheduleData);
}

function getFutureHourDiv(hourIndex, scheduleData) {
  return getHourDiv("future", hourIndex, scheduleData);
}

function getPastHourDiv(hourIndex, scheduleData) {
  return getHourDiv("past", hourIndex, scheduleData);
}

function getWorkingDateString(dateObj) {
  var retval = "";
  if (dateObj == null) {
    dateObj = new Date();
  }
  retval += dateObj.getFullYear();
  var month = dateObj.getMonth() + 1;
  if (month < 10) retval += "0";
  retval += month;
  var day = dateObj.getDate();
  if (day < 10) retval += "0";
  retval += day;
  return retval;
}
// starting from the
/*
 * Empties the schedule-section of the page and renders the information for the date parameter
 * @param renderDate: The date to be rendered. If null, the current date is rendered. Date format
 *   is yyyymmdd
 */
function renderScheduleSection(renderDate) {
  // get the <body> element
  var dateObj = new Date();
  if (renderDate == null) renderDate = getWorkingDateString();
  var scheduleData = localStorage.getItem(renderDate);
  if (scheduleData != null) {
    scheduleData = JSON.parse(scheduleData);
  } else {
    scheduleData = {};
  }

  console.log;
  var jqBodyEl = $("body");
  // get the schedule-section <div>
  var jqScheduleSectionEl = $("#schedule-section");
  // remove it from the body if it exists
  if (jqScheduleSectionEl != null) {
    jqScheduleSectionEl.empty();
  }

  var currentHour = dateObj.getHours();
  //
  var jqHourDivEl;
  for (let hourIndex = WORK_DAY_START; hourIndex <= WORK_DAY_END; hourIndex++) {
    if (hourIndex < currentHour) jqHourDivEl = getPastHourDiv(hourIndex, scheduleData);
    else if (currentHour == hourIndex) jqHourDivEl = getPresentHourDiv(hourIndex, scheduleData);
    else jqHourDivEl = getFutureHourDiv(hourIndex, scheduleData);

    //console.log(jqHourDivEl.html());
    if (jqHourDivEl != null) jqScheduleSectionEl.append(jqHourDivEl);
  }
  // attach event listeners to the buttons and to the input
  $(".edit-button").on("click", function () {
    scheduleEditButtonEventListenerCallback($(this));
  });

  $(".input-style").on("click", function () {
    scheduleInputEventListenerCallback($(this));
  });

  $(".past-input").tooltip({ trigger: "hover", title: "You can't touch this!" });
}

function scheduleEditButtonEventListenerCallback(jqButtonEl) {
  console.log("Edit Button Event Callback");
  console.log(jqButtonEl.prop("tagName"));
  // if this is chosen, it means the corresponding input can be set to editable.
  // get the data-hour value from this element
  var dataHourValue = jqButtonEl.attr("data-hour");
  console.log("data-hour value for this element is " + dataHourValue);
  // now find <input> with the same data-hour attribute value
  var jqInputEl = $("div").find("[data-hour='" + dataHourValue + "']");
  var jqImgEl = $("button").find("[data-hour='" + dataHourValue + "']");
  if (jqInputEl != null && jqImgEl != null) {
    // check status of the button
    var lockStatus = jqImgEl.attr("data-lock");
    if (lockStatus == "lock") {
      jqInputEl.attr("readonly", false);
      // set the image of the button to the open lock and set the data-lock attribute to "unlock"
      jqImgEl.attr("src", UNLOCK_IMG);
      jqImgEl.attr("data-lock", "unlock");
    } else {
      // get the value of the input
      var inputVal = jqInputEl.val();
      // set the input back to readonly
      jqInputEl.attr("readonly", true);
      // set the image to lock
      jqImgEl.attr("src", LOCK_IMG);
      jqImgEl.attr("data-lock", "lock");
      // get scheuleData from localStorage
      var scheduleData = localStorage.getItem(currentWorkingDate);
      if (scheduleData != null) {
        scheduleData = JSON.parse(scheduleData);
      } else scheduleData = {};
      // set the value for this dataHour
      scheduleData[dataHourValue] = inputVal;
      console.log(scheduleData);
      // save to localStorage
      localStorage.setItem(currentWorkingDate,JSON.stringify(scheduleData));
    }
  }
}

function scheduleInputEventListenerCallback(jqInputEl) {
  console.log("Input Event Callback");
  console.log(jqInputEl.prop("tagName"));
  var dateObj = new Date();
  var currentHour = dateObj.getHours();
}
