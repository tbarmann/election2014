// updated Sept. 9, 2014
// Timothy C. Barmann

String.prototype.toTitleCase = function() {
  var i, str, lowers, uppers;
  str = this.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

  // Certain minor words should be left lowercase unless
  // they are the first or last words in the string
  lowers = [
    "A",
    "An",
    "The",
    "And",
    "But",
    "Or",
    "For",
    "Nor",
    "As",
    "At",
    "By",
    "For",
    "From",
    "In",
    "Into",
    "Near",
    "Of",
    "On",
    "Onto",
    "To",
    "With"
  ];
  for (i = 0; i < lowers.length; i++)
    str = str.replace(new RegExp("\\s" + lowers[i] + "\\s", "g"), function(
      txt
    ) {
      return txt.toLowerCase();
    });

  // Certain words such as initialisms or acronyms should be left uppercase
  uppers = ["Id", "I", "II", "III", "IV"];
  for (i = 0; i < uppers.length; i++)
    str = str.replace(
      new RegExp("\\b" + uppers[i] + "\\b", "ig"),
      uppers[i].toUpperCase()
    );

  str.replace(/\b((m)(a?c))?([a-zA-Z])/gi, function($1, $2, $3, $4, $5) {
    if ($2) {
      return $3.toUpperCase() + $4 + $5.toUpperCase();
    }
    return $1.toUpperCase();
  });

  return str;
};

//function get_election_data(data) {
//   updated = data.updated;
//   precincts = data.precinct.precinct_string;
//   election_data = data.candidates;
//
//}

function compareVotes(a, b) {
  return parseInt(b.votes) - parseInt(a.votes);
}

function getReferendumRaceNumber(question) {
  q = parseInt(question);
  var questions = ["", 501, 502, 503, 504];
  return typeof questions[q] != "undefined" ? questions[q] : "";
}

function getSenateRaceNumber(district, show_uncontested) {
  var results = [];
  if (typeof show_uncontested === "undefined") {
    var show_uncontested = true;
  }
  // global: ga_senator
  d = parseInt(district);

  var count = ga_senator.contests.length;
  var re = new RegExp("district " + d + "$", "i");
  for (var x = 0; x < count; x++) {
    if (re.test(ga_senator.contests[x].name)) {
      if (
        show_uncontested === true ||
        ga_senator.contests[x].candidates.length > 1
      ) {
        results.push(ga_senator.contests[x].contest_number);
      }
    }
  }
  return results;
}

function getHouseRaceNumber(district, show_uncontested) {
  var results = [];
  if (typeof show_uncontested === "undefined") {
    var show_uncontested = true;
  }
  // global: ga_representative
  d = parseInt(district);

  var count = ga_representative.contests.length;
  var re = new RegExp("district " + d + "$", "i");
  for (var x = 0; x < count; x++) {
    if (re.test(ga_representative.contests[x].name)) {
      if (
        show_uncontested === true ||
        ga_representative.contests[x].candidates.length > 1
      ) {
        results.push(ga_representative.contests[x].contest_number);
      }
    }
  }
  return results;
}

function getSenateRaces(district, show_uncontested) {
  var results = [];
  if (typeof show_uncontested === "undefined") {
    var show_uncontested = true;
  }
  // global: ga_senator
  d = parseInt(district);

  var count = ga_senator.contests.length;
  var re = new RegExp("district " + d + "$", "i");
  for (var x = 0; x < count; x++) {
    if (re.test(ga_senator.contests[x].name)) {
      if (
        show_uncontested === true ||
        ga_senator.contests[x].candidates.length > 1
      ) {
        results.push(ga_senator.contests[x]);
      }
    }
  }
  return results;
}

function getHouseRaces(district, show_uncontested) {
  var results = [];
  if (typeof show_uncontested === "undefined") {
    var show_uncontested = true;
  }
  // global: ga_representative
  d = parseInt(district);

  var count = ga_representative.contests.length;
  var re = new RegExp("district " + d + "$", "i");
  for (var x = 0; x < count; x++) {
    if (re.test(ga_representative.contests[x].name)) {
      if (
        show_uncontested === true ||
        ga_representative.contests[x].candidates.length > 1
      ) {
        results.push(ga_representative.contests[x]);
      }
    }
  }
  return results;
}

function stripe_table(id) {
  var table = document.getElementById(id);
  var rows = table.getElementsByTagName("tr");
  for (var i = 1; i < rows.length; i += 2) rows[i].className += " election_odd";
}

function makeUniqueId() {
  sleep(1);
  var id = "id_" + new Date().getTime();
  return id;
}

function sleep(milliSeconds) {
  var startTime = new Date().getTime();
  while (new Date().getTime() < startTime + milliSeconds);
}

function get_race_numbers(election_data, show_uncontested) {
  if (typeof show_uncontested === undefined) {
    var show_uncontested = true;
  }
  race_numbers = new Array();
  for (var x = 0; x < election_data.contests.length; x++) {
    if (
      show_uncontested === true ||
      election_data.contests[x].candidates.length > 1
    ) {
      race_numbers.push(election_data.contests[x].contest_number);
    }
  }
  return race_numbers;
}

function get_results_by_race(election_data, race_number) {
  var results = {};
  var total_votes = 0;

  for (var x = 0; x < election_data.contests.length; x++) {
    if (election_data.contests[x].contest_number == race_number) {
      results = election_data.contests[x];
      break;
    }
  }

  // add in total votes and pct. of vote for each candidate
  for (var x = 0; x < results.candidates.length; x++) {
    total_votes += parseInt(results.candidates[x].votes);
  }
  // prevent a divide by 0 error
  if (total_votes == 0) total_votes = 1;

  for (var x = 0; x < results.candidates.length; x++) {
    results.candidates[x].pct_votes =
      (results.candidates[x].votes / total_votes) * 100;
  }

  if (typeof results.precinct_count === "undefined")
    results.precinct_count = election_data.precinct_count;
  if (typeof results.precincts_reporting === "undefined")
    results.precincts_reporting = election_data.precincts_reporting;
  results.last_updated = election_data.last_updated;
  results.candidates.sort(compareVotes);

  return results;
}

function isEven(x) {
  return x % 2 ? false : true;
}
function isOdd(x) {
  return x % 2 ? true : false;
}

function showResultsTable(results) {
  var html = "";
  var count = 0;
  var isFinal =
    results.precincts_reporting > 0 &&
    results.precincts_reporting == results.precinct_count
      ? true
      : false;
  var contest_number = parseInt(results.contest_number);
  var isReferendum = contest_number > 499 ? true : false;
  var column_count = isReferendum ? 3 : 4;
  var desc = isReferendum ? getReferendumDesc(contest_number) : "";
  html += '<table class="pj_election_widget">';
  html += '<tr class="race_heading">';
  html +=
    '<td class="center" colspan="' +
    column_count +
    '">' +
    results.name.toTitleCase();
  if (isReferendum)
    html += ' <div style="white-space:nowrap">' + desc + "</div>";
  if (typeof results.votes_allowed !== undefined)
    if (results.votes_allowed > 1)
      html +=
        ' <span style="white-space:nowrap">Elect ' +
        results.votes_allowed +
        "</span>";
  html += "</td>";
  html += "</tr>";
  html += '<tr class="election_row">';
  if (isReferendum == false) html += "<td>Candidate</td>";
  else html += "<td> </td>";
  html += "<td>Votes</td>";
  html += "<td>Pct.</td>";
  html += "</tr>";
  for (var row = 0; row < results.candidates.length; row++) {
    html += "<tr";
    if (isEven(row)) html += ' class="election_even"';
    html += ">";
    html += "<td>" + results.candidates[row].name.toTitleCase();
    html += "</td>";
    html += "<td>" + results.candidates[row].votes + "</td>";
    html +=
      "<td>" + Math.round(results.candidates[row].pct_votes * 10) / 10 + "%";
    if (isFinal === true && row < parseInt(results.votes_allowed))
      html +=
        '<img src="http://res.providencejournal.com/politics/primary/2012/assets/pages/gcheck.gif"/>';
    html += "</td>";
    html += "</tr>";
  }
  html += '<tr class="update_row"><td colspan="' + column_count + '">Updated: ';
  html += results.last_updated;
  html += "</td></tr>";
  html += '<tr class="update_row"><td colspan="' + column_count + '">';
  html +=
    results.precincts_reporting +
    " of " +
    results.precinct_count +
    " precincts reporting";
  html += "</td></tr>";
  html += "</table>";
  return html;
}

function showResultsTableShort(results) {
  var html = "";
  var count = 0;
  var isFinal =
    results.precincts_reporting > 0 &&
    results.precincts_reporting == results.precinct_count
      ? true
      : false;
  var contest_number = parseInt(results.contest_number);
  var isReferendum = contest_number > 499 ? true : false;
  var column_count = isReferendum ? 3 : 4;
  var desc = isReferendum ? getReferendumDesc(contest_number) : "";
  html += '<table class="pj_election_widget">';
  html += '<tr class="race_heading">';
  html +=
    '<td class="center" colspan="' +
    column_count +
    '">' +
    results.name.toTitleCase();
  if (isReferendum)
    html += ' <div style="white-space:nowrap">' + desc + "</div>";
  if (typeof results.votes_allowed !== undefined)
    if (results.votes_allowed > 1)
      html +=
        ' <span style="white-space:nowrap">Elect ' +
        results.votes_allowed +
        "</span>";
  html += "</td>";
  html += "</tr>";
  html += '<tr class="election_row">';
  if (isReferendum == false) html += "<td>Candidate</td>";
  else html += "<td> </td>";
  if (isReferendum == false) html += "<td>Party</td>";
  html += "<td>Votes</td>";
  html += "<td>Pct.</td>";
  html += "</tr>";
  for (var row = 0; row < results.candidates.length; row++) {
    html += "<tr";
    if (isEven(row)) html += ' class="election_even"';
    html += ">";
    html += "<td>" + results.candidates[row].name.toTitleCase();
    html += "</td>";
    if (isReferendum == false)
      html += "<td>" + results.candidates[row].party_code + "</td>";
    html += "<td>" + results.candidates[row].votes + "</td>";
    html +=
      "<td>" + Math.round(results.candidates[row].pct_votes * 10) / 10 + "%";
    if (isFinal === true && row < parseInt(results.votes_allowed))
      html += '<img src="gcheck.gif"/>';
    html += "</td>";
    html += "</tr>";
  }
  html += '<tr class="update_row"><td colspan="' + column_count + '">Updated: ';
  html += results.last_updated;
  html += "</td></tr>";
  html += '<tr class="update_row"><td colspan="' + column_count + '">';
  html +=
    results.precincts_reporting +
    " of " +
    results.precinct_count +
    " precincts reporting";
  html += "</td></tr>";
  html += "</table>";
  return html;
}

function showResultsTableTip(results) {
  var html = "";
  var count = 0;
  var isFinal =
    results.precincts_reporting > 0 &&
    results.precincts_reporting == results.precinct_count
      ? true
      : false;
  var contest_number = parseInt(results.contest_number);
  var isReferendum = contest_number > 499 ? true : false;
  var column_count = isReferendum ? 3 : 4;
  var desc = isReferendum ? getReferendumDesc(contest_number) : "";
  html += '<table class="pj_election_widget_tip">';
  html += '<tr class="race_heading">';
  html +=
    '<td class="center" colspan="' +
    column_count +
    '">' +
    results.name.toTitleCase();
  if (isReferendum)
    html += ' <div style="white-space:nowrap">' + desc + "</div>";
  if (typeof results.votes_allowed !== undefined)
    if (results.votes_allowed > 1)
      html +=
        ' <span style="white-space:nowrap">Elect ' +
        results.votes_allowed +
        "</span>";
  html += "</td>";
  html += "</tr>";
  html += '<tr class="election_row">';
  if (isReferendum == false) html += "<td>Candidate</td>";
  else html += "<td> </td>";
  html += "<td>Votes</td>";
  html += "<td>Pct.</td>";
  html += "</tr>";
  for (var row = 0; row < results.candidates.length; row++) {
    html += "<tr";
    if (isEven(row)) html += ' class="election_even"';
    html += ">";
    html += "<td>" + results.candidates[row].name.toTitleCase();
    html += "</td>";
    html += "<td>" + results.candidates[row].votes + "</td>";
    html +=
      "<td>" + Math.round(results.candidates[row].pct_votes * 10) / 10 + "%";
    if (isFinal === true && row < parseInt(results.votes_allowed))
      html += '<img src="gcheck.gif"/>';
    html += "</td>";
    html += "</tr>";
  }
  html += '<tr class="update_row"><td colspan="' + column_count + '">Updated: ';
  html += results.last_updated;
  html += "</td></tr>";
  html += '<tr class="update_row"><td colspan="' + column_count + '">';
  html +=
    results.precincts_reporting +
    " of " +
    results.precinct_count +
    " precincts reporting";
  html += "</td></tr>";
  html += "</table>";
  return html;
}

function showResultsTableTipNew(results) {
  var race_class =
    results.contest_party_designation == "DEM" ? "democrat" : "republican";
  var pct_precincts =
    results.precincts_reporting > 0
      ? (results.precincts_reporting / results.precinct_count) * 100
      : 0;
  pct_precincts = Math.round(pct_precincts * 10) / 10;
  var html =
    '<div id="town-header-container">\
    <div id="town-header">\
      <h3>' +
    results.town +
    '</h3></div></div>\
  <div class="key-races"> \
   <div id="race-header" class="' +
    race_class +
    '"> \
      <h3>' +
    results.name.toTitleCase() +
    '</h3> \
   </div> \
   <div id="prec-container"> \
      <div id="prec-header"><strong>Precincts</strong></div> \
      <div id="prec-header"><strong>Reported</strong></div> \
      <div id="prec-header"><strong>Percent</strong></div> \
      <div style="clear: both;"></div> \
      <div id="prec-content">' +
    results.precinct_count +
    '</div> \
      <div id="prec-content">' +
    results.precincts_reporting +
    '</div>\
      <div id="prec-content">' +
    pct_precincts +
    '%</div>\
      <div style="clear: both;"></div>\
   </div>\
   <div class="candidates-header-container" style="padding-top: 10px;">\
      <div class="candidates-header-large">\
         <h4>Candidates</h4>\
      </div>\
      <div class="candidates-header">Total</div>\
      <div class="candidates-header">Pct</div>\
      <div style="clear: both;"></div>\
   </div>';

  for (var row = 0; row < results.candidates.length; row++) {
    var candidate_class = "candidate-" + (row % 2 == 0 ? "odd " : "even ");
    var pct_votes =
      results.total_votes > 0
        ? (results.candidates[row].votes / results.total_votes) * 100
        : 0;
    var pct_votes = Math.round(pct_votes * 10) / 10;
    html += '<div class="' + candidate_class + '">';
    html += '<div class="' + candidate_class;
    html += 'candidate-col-one">' + results.candidates[row].name.toTitleCase();
    html +=
      ' <span style="font-size: 12px;">(' +
      results.candidates[row].party_code.toTitleCase() +
      ")</span></div>";
    html +=
      '<div class="' +
      candidate_class +
      ' candidate-col-TT">' +
      results.candidates[row].votes +
      "</div>";
    html +=
      '<div class="' +
      candidate_class +
      ' candidate-col-TT">' +
      pct_votes +
      "%</div>";
    html += '<div style="clear: both;"></div>';
    html += "</div>";
  }
  html += "</div>";
  html += '<div class="races_updated">Updated: ';
  html += results.last_updated;
  html += "</div>";

  return html;
}

// var headID = document.getElementsByTagName("head")[0];
// var cssNode = document.createElement("link");
// cssNode.type = "text/css";
// cssNode.rel = "stylesheet";
// cssNode.href = "election_results_widget.css";
// cssNode.media = "screen";
// headID.appendChild(cssNode);
