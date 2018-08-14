
String.prototype.toTitleCase = function() {
    var i, str, lowers, uppers;
    str = this.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    // Certain minor words should be left lowercase unless
    // they are the first or last words in the string
    lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
    'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
    for (i = 0; i < lowers.length; i++)
        str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'),
            function(txt) {
                return txt.toLowerCase();
            });

    // Certain words such as initialisms or acronyms should be left uppercase
    uppers = ['Id','I','II','III','IV','RI','R.I.','U.S.','US'];
    for (i = 0; i < uppers.length; i++)
        str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'ig'),
            uppers[i].toUpperCase());

    str.replace( /\b((m)(a?c))?([a-zA-Z])/gi,
          function($1, $2, $3, $4, $5) { if($2){return $3.toUpperCase()+$4+$5.toUpperCase();} return $1.toUpperCase(); });

    return str;
}





Array.prototype.sum = function() {
  return (! this.length) ? 0 : this.slice(1).sum() +
      ((typeof this[0] == 'number') ? this[0] : 0);
};



function compareVotes(a, b) {
return (parseInt(b.votes) - parseInt(a.votes));
}


function loadScript(url) {

	  var fileref=document.createElement('script');
	  fileref.setAttribute("type","text/javascript");
	  fileref.setAttribute("src", url);

  	 if (typeof fileref!="undefined") {
	     document.getElementsByTagName("head")[0].appendChild(fileref)
	  }
}



function dataSourceLookup(race) {
	var race = parseInt(race);
	var ds;
	var datasource;

	var base_url = "http://res.providencejournal.com/politics/election2014/results/general/";
	var ext = "json";

	r = [];r[222]="barrington";r[223]="barrington";r[224]="barrington";r[225]="bristol";r[226]="bristol";r[227]="bristol";r[228]="bristol";r[229]="burrillville";r[230]="burrillville";r[231]="charlestown";r[232]="charlestown";r[233]="charlestown";r[234]="charlestown";r[235]="coventry";r[236]="coventry";r[237]="coventry";r[238]="coventry";r[239]="coventry";r[240]="cranston";r[241]="cranston";r[242]="cranston";r[243]="cranston";r[244]="cranston";r[245]="cranston";r[246]="cranston";r[247]="cranston";r[248]="cranston";r[249]="cranston";r[250]="cranston";r[251]="cranston";r[252]="cranston";r[253]="cranston";r[254]="cumberland";r[255]="cumberland";r[256]="cumberland";r[257]="cumberland";r[258]="cumberland";r[259]="cumberland";r[260]="cumberland";r[261]="cumberland";r[262]="cumberland";r[263]="cumberland";r[264]="cumberland";r[265]="cumberland";r[266]="cumberland";r[267]="cumberland";r[268]="cumberland";r[269]="cumberland";r[270]="cumberland";r[271]="cumberland";r[272]="cumberland";r[273]="east_greenwich";r[274]="east_greenwich";r[275]="east_greenwich";r[276]="east_providence";r[277]="east_providence";r[278]="east_providence";r[279]="east_providence";r[280]="east_providence";r[281]="east_providence";r[282]="east_providence";r[283]="east_providence";r[284]="east_providence";r[285]="east_providence";r[286]="exeter";r[287]="exeter";r[288]="exeter";r[289]="exeter";r[290]="exeter";r[291]="exeter";r[292]="exeter";r[293]="exeter";r[294]="foster";r[295]="foster";r[296]="foster";r[297]="foster";r[298]="foster";r[299]="foster";r[300]="glocester";r[301]="glocester";r[302]="glocester";r[303]="glocester";r[304]="glocester";r[305]="hopkinton";r[306]="hopkinton";r[307]="hopkinton";r[308]="hopkinton";r[309]="hopkinton";r[310]="hopkinton";r[311]="jamestown";r[312]="jamestown";r[313]="jamestown";r[314]="johnston";r[315]="johnston";r[316]="johnston";r[317]="johnston";r[318]="johnston";r[319]="johnston";r[320]="johnston";r[321]="johnston";r[322]="johnston";r[323]="lincoln";r[324]="lincoln";r[325]="lincoln";r[326]="lincoln";r[327]="lincoln";r[328]="lincoln";r[329]="lincoln";r[330]="lincoln";r[331]="lincoln";r[332]="lincoln";r[333]="lincoln";r[334]="lincoln";r[335]="little_compton";r[336]="little_compton";r[337]="little_compton";r[338]="little_compton";r[339]="little_compton";r[340]="little_compton";r[341]="middletown";r[342]="middletown";r[343]="narragansett";r[344]="narragansett";r[345]="newport";r[346]="newport";r[347]="newport";r[348]="newport";r[349]="newport";r[350]="new_shoreham";r[351]="new_shoreham";r[352]="new_shoreham";r[353]="new_shoreham";r[354]="new_shoreham";r[355]="new_shoreham";r[356]="new_shoreham";r[357]="new_shoreham";r[358]="new_shoreham";r[359]="new_shoreham";r[360]="north_kingstown";r[361]="north_kingstown";r[362]="north_providence";r[363]="north_providence";r[364]="north_providence";r[365]="north_providence";r[366]="north_providence";r[367]="north_providence";r[368]="north_providence";r[369]="north_providence";r[370]="north_smithfield";r[371]="north_smithfield";r[372]="north_smithfield";r[373]="pawtucket";r[374]="pawtucket";r[375]="pawtucket";r[376]="pawtucket";r[377]="pawtucket";r[378]="pawtucket";r[379]="pawtucket";r[380]="pawtucket";r[381]="pawtucket";r[382]="portsmouth";r[383]="portsmouth";r[384]="portsmouth";r[385]="providence";r[386]="providence";r[387]="providence";r[388]="providence";r[389]="providence";r[390]="providence";r[391]="providence";r[392]="providence";r[393]="providence";r[394]="providence";r[395]="providence";r[396]="providence";r[397]="providence";r[398]="providence";r[399]="providence";r[400]="providence";r[401]="richmond";r[402]="richmond";r[403]="richmond";r[404]="richmond";r[405]="richmond";r[406]="scituate";r[407]="scituate";r[408]="scituate";r[409]="scituate";r[410]="scituate";r[411]="scituate";r[412]="scituate";r[413]="smithfield";r[414]="smithfield";r[415]="south_kingstown";r[416]="south_kingstown";r[419]="tiverton";r[420]="tiverton";r[421]="tiverton";r[422]="tiverton";r[423]="tiverton";r[424]="tiverton";r[425]="warren";r[426]="warren";r[427]="warren";r[428]="warren";r[429]="warwick";r[430]="warwick";r[431]="warwick";r[432]="warwick";r[433]="warwick";r[434]="warwick";r[435]="warwick";r[436]="warwick";r[437]="warwick";r[438]="warwick";r[439]="warwick";r[440]="warwick";r[441]="warwick";r[442]="westerly";r[443]="westerly";r[444]="west_greenwich";r[445]="west_greenwich";r[446]="west_greenwich";r[447]="west_greenwich";r[448]="west_warwick";r[449]="west_warwick";r[450]="west_warwick";r[451]="west_warwick";r[452]="west_warwick";r[453]="west_warwick";r[454]="west_warwick";r[455]="west_warwick";r[712]="barrington";r[713]="barrington";r[714]="barrington";r[715]="barrington";r[716]="barrington";r[717]="barrington";r[718]="bristol";r[719]="cumberland";r[720]="cumberland";r[721]="east_greenwich";r[722]="east_greenwich";r[723]="east_greenwich";r[724]="east_greenwich";r[725]="middletown";r[726]="middletown";r[727]="narragansett";r[728]="narragansett";r[729]="north_kingstown";r[730]="north_kingstown";r[731]="north_kingstown";r[732]="north_kingstown";r[733]="richmond";r[734]="richmond";r[735]="richmond";r[736]="richmond";r[737]="south_kingstown";r[738]="south_kingstown";r[739]="tiverton";r[740]="westerly";r[741]="westerly";r[742]="west_warwick";r[743]="west_warwick";r[744]="west_warwick";r[756]="barrington";r[757]="barrington";r[758]="barrington";r[759]="barrington";r[760]="barrington";r[761]="barrington";r[762]="barrington";r[763]="barrington";r[764]="barrington";r[765]="barrington";r[766]="barrington";r[767]="barrington";r[768]="barrington";r[769]="barrington";r[770]="barrington";r[771]="barrington";r[772]="barrington";r[773]="barrington";r[774]="barrington";r[775]="barrington";r[776]="barrington";r[777]="barrington";r[778]="barrington";r[779]="barrington";r[780]="barrington";r[781]="barrington";r[782]="barrington";r[783]="barrington";r[784]="barrington";r[785]="barrington";r[786]="barrington";r[787]="barrington";r[788]="barrington";r[789]="barrington";r[790]="coventry";r[791]="coventry";r[792]="coventry";r[793]="coventry";r[794]="coventry";r[795]="coventry";r[796]="coventry";r[797]="coventry";r[798]="cranston";r[799]="cranston";r[800]="cranston";r[801]="cranston";r[802]="cranston";r[803]="cranston";r[804]="exeter";r[805]="exeter";r[806]="exeter";r[807]="exeter";r[808]="glocester";r[809]="glocester";r[810]="glocester";r[811]="glocester";r[812]="glocester";r[813]="glocester";r[814]="lincoln";r[815]="lincoln";r[816]="lincoln";r[817]="lincoln";r[818]="lincoln";r[819]="lincoln";r[820]="little_compton";r[821]="little_compton";r[822]="little_compton";r[823]="little_compton";r[824]="little_compton";r[825]="little_compton";r[826]="little_compton";r[827]="little_compton";r[828]="little_compton";r[829]="little_compton";r[830]="little_compton";r[831]="little_compton";r[832]="little_compton";r[833]="newport";r[834]="newport";r[835]="newport";r[836]="newport";r[837]="newport";r[838]="newport";r[839]="newport";r[840]="newport";r[841]="newport";r[842]="newport";r[843]="newport";r[844]="newport";r[845]="newport";r[846]="new_shoreham";r[847]="new_shoreham";r[848]="north_smithfield";r[849]="north_smithfield";r[850]="north_smithfield";r[851]="north_smithfield";r[852]="north_smithfield";r[853]="north_smithfield";r[854]="north_smithfield";r[855]="north_smithfield";r[856]="north_smithfield";r[857]="north_smithfield";r[858]="north_smithfield";r[859]="north_smithfield";r[860]="north_smithfield";r[861]="north_smithfield";r[862]="north_smithfield";r[863]="smithfield";r[864]="smithfield";r[865]="smithfield";r[866]="smithfield";r[867]="smithfield";r[868]="smithfield";r[869]="smithfield";r[870]="smithfield";r[871]="smithfield";r[872]="smithfield";r[873]="smithfield";r[874]="warren";r[875]="pawtucket";r[876]="pawtucket";r[877]="pawtucket";r[878]="pawtucket";r[879]="pawtucket";r[880]="pawtucket";r[881]="pawtucket";r[882]="pawtucket";

	if ((race >= 101 && race <= 108) || (race >= 484 && race <= 490)) {
		ds = "statewide";

	}
	else if (race >= 109 && race <= 146) {
		ds = "ga_senator";
	}
	else if (race >= 147 && race <= 221) {
		ds = "ga_representative";
	}
	else {
		ds = r[race];
	}

	var script_url = base_url + ds + "." + ext;
	loadScript(script_url);

	try {
		datasource = eval(ds);
	}
	catch(error) {
		console.log("Variable " + ds + " not defined.");

	}

	return datasource;

}




function getReferendumRaceNumber(question) {
	var q=parseInt(question);
	var race = q + 483;
	if (race>=484 && race<=490) {
		return race;
	}
	return '';
}

function getSenateRaceNumber (district) {

	// district 1 = race 109, district 2 = 110, etc.
	// races are 109 to 146
	var first_race = 109;
	var last_race = 146;
	var offset = first_race-1;

	var race = parseInt(district) + offset;
	if (race>=first_race && race<=last_race) {
		return race;
	}
	return '';
}

function getHouseRaceNumber(district) {
	var d = parseInt(district);
	// district 1 = race 147, district 2 = 148, etc.
	// races are 147 to 221
	var first_race = 147;
	var last_race = 221;
	var offset = first_race-1;

	var race = parseInt(district) + offset;
	if (race>=first_race && race<=last_race) {
		return race;
	}
	return '';

}

function stripe_table(id) {

var table = document.getElementById(id);
  var rows = table.getElementsByTagName("tr");
  	for ( var i = 1; i < rows.length; i += 2 )
	      rows[i].className += " odd";
}

function makeUniqueId() {
	sleep(1);
	var id = 'id_' + new Date().getTime();
	return id;
}

function sleep(milliSeconds){
	var startTime = new Date().getTime();
	while (new Date().getTime() < startTime + milliSeconds);

}

function get_race_numbers(election_data) {
	race_numbers = new Array();
	for (var x=0;x<election_data.contests.length;x++)
		race_numbers.push(election_data.contests[x].contest_number);
	return race_numbers;
}


function get_results_by_race(a,b) {


	var args = Array.prototype.slice.call(arguments);

	if (args.length == 2) {
		var election_data = a;
		var race_number = b;
	}
	else {
		var race_number = a;
		var election_data = dataSourceLookup(race_number);
	}

	var results = {};
	var total_votes = 0;


	if (typeof election_data === "undefined") {
		console.log("Error: no data source for race " . race_number);
	}

	for (var x=0;x<election_data.contests.length;x++) {
		if (election_data.contests[x].contest_number == race_number) {
			results = election_data.contests[x];
			break;
		}
	}

	// add in total votes and pct. of vote for each candidate
	for (var x=0;x<results.candidates.length;x++) {
		total_votes += parseInt(results.candidates[x].votes);
	}


	for (var x=0;x<results.candidates.length;x++) {
		if (total_votes > 0) {
			results.candidates[x].pct_votes = (results.candidates[x].votes / total_votes) *100 ;
		}
		else {
			results.candidates[x].pct_votes = 0;
		}
	}

	if (!results.hasOwnProperty('precinct_count') && election_data.hasOwnProperty('precinct_count')) {
  		results.precinct_count = election_data.precinct_count;
  		results.precincts_reporting = election_data.precincts_reporting;
	}

	results.last_updated = election_data.last_updated;
	results.candidates.sort(compareVotes);
return results;

}


function isEven(x) { return (x%2)?false:true; }
function isOdd(x)  { return (x%2)?true:false; }

function showResultsTableOld(results) {
	var html='';
	var count=0;
	var contest_number = parseInt(results.contest_number);
	var isReferendum = (contest_number>499 && contest_number<900) ? true : false;
	var column_count = (isReferendum) ? 3 : 4;
	var desc = (isReferendum) ? getReferendumDesc(contest_number) : "";

	html+='<table class="pj_election_widget">';
	html+='<tr class="race_heading">';
	html+='<td class="center" colspan="' + column_count + '">' + results.name;
		if (isReferendum) {
		html +=' <div style="white-space:nowrap">' + desc + '</div>';
	}
	if (typeof (results.elect_count)===undefined)
		if (results.elect_count.length > 0)
			html +=' <span style="white-space:nowrap">' + results.elect_count + '</span>';
	html += '</td>';
	html+='</tr>';
	html+='<tr class="election_row">';
	if (isReferendum==false)
		html+='<td>Candidate</td>';
	else
		html+='<td> </td>';
	if (isReferendum==false)
		html+='<td>Party</td>';
	html+='<td>Votes</td>';
	html+='<td>Pct.</td>';
	html+='</tr>';
	for (var row=0;row<results.candidates.length;row++) {
		html+='<tr';
		if (isEven(row))
			html += ' class="election_even"';
		html+='>';
		html+='<td>' + results.candidates[row].name + '</td>';
		if (isReferendum==false)
			html+='<td>' + results.candidates[row].party_code + '</td>';
		html+='<td>' + results.candidates[row].votes + '</td>';
		html+='<td>' + Math.round(results.candidates[row].pct_votes * 10) /10 + '%</td>';
		html+='</tr>';
	}
	html+='<tr class="update_row"><td colspan="' + column_count + '">Updated: ';
	html+=results.last_updated;
	html+='</td></tr>';
	html+='<tr class="update_row"><td colspan="' + column_count + '">';
	html+=results.precincts_reporting + ' of ' + results.precinct_count + ' precincts reporting';
	html+='</td></tr>';
	html+='</table>';
	return(html);


}

function showResultsTable(results) {
	var html='';
	var count=0;
	var isFinal = (results.precincts_reporting>0 && results.precincts_reporting == results.precinct_count)? true: false;
	var contest_number = parseInt(results.contest_number);
	var isReferendum = (contest_number>499) ? true : false;
	var column_count = (isReferendum) ? 3 : 4;
	var desc = (isReferendum) ? getReferendumDesc(contest_number) : "";
	html+='<table class="pj_election_widget" id="contest_' + contest_number + '">';
	html+='<tr class="race_heading">';
	html+='<td class="center" colspan="' + column_count + '">' + results.name.toTitleCase();
	if (isReferendum)
		html +=' <div style="white-space:nowrap">' + desc + '</div>';
	if (typeof (results.votes_allowed)!==undefined)
		if (results.votes_allowed > 1)
			html +=' <span style="white-space:nowrap">Elect ' + results.votes_allowed + '</span>';
	html += '</td>';
	html+='</tr>';
	html+='<tr class="election_row">';
	if (isReferendum==false)
		html+='<td>Candidate</td>';
	else
		html+='<td> </td>';
	if (isReferendum==false)
		html+='<td>Party</td>';
	html+='<td>Votes</td>';
	html+='<td>Pct.</td>';
	html+='</tr>';
	for (var row=0;row<results.candidates.length;row++) {
		html+='<tr';
		if (isEven(row))
			html += ' class="election_even"';
		html+='>';
		html+='<td>' + results.candidates[row].name.toTitleCase();
		html+= '</td>';
		if (isReferendum==false)
			html+='<td>' + results.candidates[row].party_code + '</td>';
		html+='<td>' + results.candidates[row].votes + '</td>';
		html+='<td>' + Math.round(results.candidates[row].pct_votes * 10) /10 + '%';
		if ((isFinal===true) && (row<parseInt(results.votes_allowed)))
			html+='<img src="http://res.providencejournal.com/politics/primary/2012/assets/scripts/gcheck.gif"/>';
		html+='</td>';
		html+='</tr>';
	}
	html+='<tr class="update_row"><td colspan="' + column_count + '">Updated: ';
	html+=results.last_updated;
	html+='</td></tr>';
	html+='<tr class="update_row"><td colspan="' + column_count + '">';
	html+=results.precincts_reporting + ' of ' + results.precinct_count + ' precincts reporting';
	html+='</td></tr>';
	html+='</table>';
	return(html);


}




function showResultsTableTip(results) {
	var html='';
	var count=0;
	var isFinal = (results.precincts_reporting>0 && results.precincts_reporting == results.precinct_count)? true: false;
	var contest_number = parseInt(results.contest_number);
	var isReferendum = (contest_number>499) ? true : false;
	var column_count = (isReferendum) ? 3 : 4;
	var desc = (isReferendum) ? getReferendumDesc(contest_number) : "";
	html+='<table class="pj_election_widget" id="contest_' + contest_number + '">';
	html+='<tr class="race_heading">';
	html+='<td class="center" colspan="' + column_count + '">' + results.name.toTitleCase();
	if (isReferendum)
		html +=' <div style="white-space:nowrap">' + desc + '</div>';
	if (typeof (results.votes_allowed)!==undefined)
		if (results.votes_allowed > 1)
			html +=' <span style="white-space:nowrap">Elect ' + results.votes_allowed + '</span>';
	html += '</td>';
	html+='</tr>';
	html+='<tr class="election_row">';
	if (isReferendum==false)
		html+='<td>Candidate</td>';
	else
		html+='<td> </td>';
	if (isReferendum==false)
		html+='<td>Party</td>';
	html+='<td>Votes</td>';
	html+='<td>Pct.</td>';
	html+='</tr>';
	for (var row=0;row<results.candidates.length;row++) {
		html+='<tr';
		if (isEven(row))
			html += ' class="election_even"';
		html+='>';
		html+='<td>' + results.candidates[row].name.toTitleCase();
		html+= '</td>';
		if (isReferendum==false)
			html+='<td>' + results.candidates[row].party_code + '</td>';
		html+='<td>' + results.candidates[row].votes + '</td>';
		html+='<td>' + Math.round(results.candidates[row].pct_votes * 10) /10 + '%';
		if ((isFinal===true) && (row<parseInt(results.votes_allowed)))
			html+='<img src="http://res.providencejournal.com/politics/primary/2012/assets/scripts/gcheck.gif"/>';
		html+='</td>';
		html+='</tr>';
	}
	html+='<tr class="update_row"><td colspan="' + column_count + '">Updated: ';
	html+=results.last_updated;
	html+='</td></tr>';
	html+='<tr class="update_row"><td colspan="' + column_count + '">';
	html+=results.precincts_reporting + ' of ' + results.precinct_count + ' precincts reporting';
	html+='</td></tr>';
	html+='</table>';
	return(html);


}



