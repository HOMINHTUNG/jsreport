var number = 2;

function numberPage() {
    return number++;
}

function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

function formatDateCampaign(duration) {
    var tmp = duration.split("&");
    var start_date = new Date(tmp[0]);
    var end_date = new Date(tmp[1]);
    return formatDate(start_date) + ' - ' +formatDate(end_date);
}


function formatDateTimeRequest(time) {
    var date = new Date(time);
    return date.toLocaleString("en-US");
}

function toJSON(data) {
  return JSON.stringify(data);
}