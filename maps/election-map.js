////////////////////////////////////////////////////////////////////////////////////

	String.prototype.capitalize = function() {
    	return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
	}
////////////////////////////////////////////////////////////////////////////////////


String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
////////////////////////////////////////////////////////////////////////////////////


	function createTestVotes() {
		// global: map_init.data_source

		var distribution = [10,10,10,0];

		for (var prop in map_init.data_source) {
			var thisProp = map_init.data_source[prop];
				$.each(thisProp.contests,function(j){
					var precinct_count = this.precinct_count;
					map_init.data_source[prop].contests[j].precincts_reporting = precinct_count;
					$.each(this.candidates, function(k) {
				//		console.log(map_init.data_source[prop].contests[j].candidates[k].name);
							map_init.data_source[prop].contests[j].candidates[k].votes=_.random(0,distribution[k]);
					});
				});


		}

	}

////////////////////////////////////////////////////////////////////////////////////

function compareVotes(a, b) {
return (parseInt(b.votes) - parseInt(a.votes));
}

////////////////////////////////////////////////////////////////////////////////////

function get_results_by_race(election_data,race_number) {

	var results = {};
	var total_votes = 0;


	if (typeof election_data === "undefined") {
		console.log("Error: no data source for race " . race_number);
		return null;
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

////////////////////////////////////////////////////////////////////////////////////
	function getParty(abbr) {
		var parties = {
			'dem':'Democrat',
			'rep':'Republican',
			'ind':'Independent',
			'mod':'Moderate'
		}

		abbr = abbr.toLowerCase();
		if (parties.hasOwnProperty(abbr)) {
			return parties[abbr];
		}
		return "";
	}

////////////////////////////////////////////////////////////////////////////////////

	function getRaceName(contest_number){
		// global: map_init.data_source
		var contest_name = null;
		var first_prop = {};
		for (var prop in map_init.data_source) {
			first_prop = map_init.data_source[prop];
			break;
		}
		$.each(first_prop.contests,function(){
			if (this.contest_number == contest_number) {
				contest_name=this.name
				return;
			}
		});
		return contest_name;

	}

////////////////////////////////////////////////////////////////////////////////////

	function getLegendColor(leader) {

		var steps = 5;
		var candidate_count = legend.length;
		var min_winner_pct = parseInt(100/candidate_count) + 1;


		for (var index=0; index<legend.length; index++) {
			var regex = new RegExp(legend[index].name, "i");
			if ((leader.name.search(regex))!=-1) {
				var palette = mixPalette("FFFFFF",legend[index].color,steps+4);
				palette.shift();palette.shift();palette.shift();
				palette.shift(); // get rid of first element since it is pure white
				var interval = (100 - min_winner_pct)/steps;
				max = 100;
				for (var x=steps; x>1; x--) {
					min = max - interval;
					if (leader.pct_votes>=min && leader.pct_votes <max) {
					break;
					}
					max=min;
				}
				var color_step = x;
				console.log("Pct: " + leader.pct_votes + "%, step: " + color_step);
				return palette[color_step-1];
			}
		}
		// default color if no match
		return legend[legend.length-1].color;
	}

////////////////////////////////////////////////////////////////////////////////////

	function buildLegend2() {
			var html ='<div class="map_legend2">';
			race_name = getRaceName(map_init.race_number);
			html += '<div class="race_name">' + race_name + '</div>';
			for (var index=0; index<legend.length; index++) {
				html += '<div class="color_box" style="background:#' + legend[index].color + ';"></div>';
				html += '<div class="candidate_name">' + legend[index].name + '</div>';
			}
			html +='</div>'
			html +='<div style="clear:both;"></div>';
			return html;
	}
////////////////////////////////////////////////////////////////////////////////////

function mapOnMouseOver(str){

	// global - map_init
	var max_tip_width =  -270  // negative number means max;

	var html = "";
	var new_str = str.replace(" ","_");
	new_str = new_str.toLowerCase();
	results = get_results_by_race(map_init.data_source[new_str],map_init.race_number);

	html = showResultsTableTip2(results,str);
	if (map_init.hasOwnProperty('is_mobile')) {
		if (map_init.is_mobile){
			html = showResultsTableTipMobile(results,str);
		}
	}

	Tip(html,WIDTH,max_tip_width,BGCOLOR,'#FFFFFF',BORDERCOLOR,'#999999',PADDING,'5','SHADOW',true);
}
////////////////////////////////////////////////////////////////////////////////////

	function getPartyIcon(party) {
		var icons = {
			'dem':'Dem_icon.png',
			'rep':'Rep_icon.png',
			'ind':'Ind_icon.png',
			'mod':'Mod_icon.png',
			'lib':'Lib_icon.png',
			'non':'clear.gif'
		}

		abbr = party.toLowerCase();
		if (icons.hasOwnProperty(abbr)) {
			return icons[abbr];
		}
		return null;
	}

	function isReferendum(contest_number) {
		return (contest_number>483);
	}

	function getReferendumOption(str) {
		if (str.indexOf('APPROVE')!== -1) {
			return 'Approve';
		}
		if (str.indexOf('REJECT')!== -1) {
			return 'Reject';
		}
		return str;

	}

////////////////////////////////////////////////////////////////////////////////////

function showResultsTableTip2(results,str) {

	var this_ward = parseInt(str.split(" ")[1]);
	var race_header = str;
	if (typeof prov_ward_demographics !== "undefined" ) {
		var demographics_obj = _.findWhere(prov_ward_demographics,{ward:this_ward})
		race_header += '<div class="neighborhood">' + demographics_obj.neighborhoods + '</div>';
	}
	var html = "";
	var new_str = str.replace(" ","_");
	new_str = new_str.toLowerCase();
	var candidate_heading = (isReferendum(results.contest_number)) ? "OPTIONS" : "CANDIDATE";
	results = get_results_by_race(map_init.data_source[new_str],map_init.race_number);
	var reporting_pct = (parseInt(results.precincts_reporting)/parseInt(results.precinct_count)) * 100;
	html += '<input type="hidden" id="buttonEID" value="' + results.name.toLowerCase() + '"><input type="hidden" id="pView" value="map"><input type="hidden" id="pFilter" value="' + results.contest_number + '"><input type="hidden" id="fNameHolder" value="statewide">\
	   <div class="key-races general-election">\
	      <div id="race-header">\
	         <h3>' + race_header + '</h3>\
	      </div>\
	      <div id="prec-container">\
	         <div id="prec-header" class="left">Precincts</div>\
	         <div id="prec-header" class="right">Reported</div>\
	         <div id="prec-header" class="right">Percent</div>\
	         <div style="clear: both;"></div>\
	         <div id="prec-content" class="thirty">' + results.precinct_count + '</div>\
	         <div id="prec-content">' + results.precincts_reporting + '</div>\
	         <div id="prec-content">' + reporting_pct.format("0.0%") + '</div>\
	         <div style="clear: both;"></div>\
	      </div>\
	      <div class="candidates-header-container">\
	         <div class="candidates-header-large">\
	            <h4>' + candidate_heading + '</h4>\
	         </div>\
	         <div class="candidates-header">Votes</div>\
	         <div class="candidates-header pct">Pct</div>\
	         <div style="clear: both;"></div>\
	      </div>';
	      for (var x=0;x<results.candidates.length;x++) {
			 var icon = getPartyIcon(results.candidates[x].party_code);
			 var candidate_name = (isReferendum(results.contest_number)) ? getReferendumOption(results.candidates[x].name) : results.candidates[x].name;
	      	 html += '<div id="candidate-row"' + ((x==0) ? ' class="solid-border">' : '>');
	         if (icon!==null && !isReferendum(results.contest_number)) {
	         	html+='<div class="icon-col">\
	         	<img src="http://res.providencejournal.com/politics/assets/images/' + icon + '"></div>';
	         }
	         html+='<div class="candidate-col">' + candidate_name.toProperCase() + '<br><span class="party-name"><span class="candidate-party">' + getParty(results.candidates[x].party_code) + '</span></span></div>\
	         <div class="candidate-col-votes">' + parseInt(results.candidates[x].votes).format("0,000") + '</div>\
	         <div class="candidate-col-percent">' + results.candidates[x].pct_votes.format("0.0%") + '</div>\
	         <div style="clear: both;"></div>\
	      </div>';
	      }
	      html += '</div>';
	      if (typeof demographics_obj !== "undefined" ) {
			  html += '<div class="demographics">Ward voting-age adults:' + demographics_obj.demographics + '</div>';
		  }

	return html;
}

////////////////////////////////////////////////////////////////////////////////////

	function getLastName(full_name) {
		for (var index=0; index<legend.length; index++) {
			var regex = new RegExp(legend[index].name, "i");
			if ((full_name.search(regex))!=-1) {
				return legend[index].name;
			}
		}
		return full_name;

	}

////////////////////////////////////////////////////////////////////////////////////

function showResultsTableTipMobile(results,str) {
	var threshhold = 5;  // any candidate with less than this percent of the vote put into the "Other" category
	var this_ward = parseInt(str.split(" ")[1]);
	var race_header = str;
	if (typeof prov_ward_demographics !== "undefined" ) {
		var demographics = _.findWhere(prov_ward_demographics,{ward:this_ward})
		race_header += '<div class="neighborhood">' + demographics.neighborhoods + '</div>';
	}

	var html = "";
	var new_str = str.replace(" ","_");
	new_str = new_str.toLowerCase();
	results = get_results_by_race(map_init.data_source[new_str],map_init.race_number);
	html += '<input type="hidden" id="buttonEID" value="' + results.name.toLowerCase() + '"><input type="hidden" id="pView" value="map"><input type="hidden" id="pFilter" value="' + results.contest_number + '"><input type="hidden" id="fNameHolder" value="statewide">\
	   <div class="key-races general-election">\
	      <div id="race-header">\
	         <h3>' + race_header + '</h3>\
	      </div>\
	      <div class="candidates-header-container">\
	         <div class="candidates-header-large">\
	            <h4></h4>\
	         </div>\
	         <div class="candidates-header">Votes</div>\
	         <div class="candidates-header pct">Pct</div>\
	         <div style="clear: both;"></div>\
	      </div>';
	      var other_votes=0;
	      var other_pct_votes=0;
	      for (var x=0;x<results.candidates.length;x++) {
	      	 if (x>2) {
	      	 	other_votes += parseInt(results.candidates[x].votes);
	      	 	other_pct_votes += results.candidates[x].pct_votes;
	      	 }
	      	 else {
				 var last_name = getLastName(results.candidates[x].name);
				 html += '<div id="candidate-row"' + ((x==0) ? ' class="solid-border">' : '>');
				 html += '<div class="candidate-col">' + last_name.capitalize() + '<br><span class="party-name"><span class="candidate-party">' + getParty(results.candidates[x].party_code) + '</span></span></div>\
				 <div class="candidate-col-votes">' + parseInt(results.candidates[x].votes).format("0,000") + '</div>\
				 <div class="candidate-col-percent">' + results.candidates[x].pct_votes.format("0.0%") + '</div>\
				 <div style="clear: both;"></div>\
				 </div>';
			}
	      }
	      if (other_votes>0) {
				 html += '<div id="candidate-row">';
				 html += '<div class="candidate-col">Other</div>\
				 <div class="candidate-col-votes">' + other_votes.format("0,000") + '</div>\
				 <div class="candidate-col-percent">' + other_pct_votes.format("0.0%") + '</div>\
				 <div style="clear: both;"></div>\
				 </div>';
			}

      	  var reporting_pct = (parseInt(results.precincts_reporting)/parseInt(results.precinct_count)) * 100;
	      html += '<div id="prec-container">\
				 <div id="prec-header" class="left">Precincts in</div>\
				 <div id="prec-content">' + reporting_pct.format("0.0%") + '</div>\
				 <div style="clear: both;"></div>\
			  	</div>\
			  </div>';

	return html;
}

////////////////////////////////////////////////////////////////////////////////////

	$(function color_map() {
	// color the map
	for (var this_town in map_init.data_source) {
		var results = get_results_by_race(map_init.data_source[this_town],map_init.race_number);
		if (results.precincts_reporting == 0)
			var color = 'DDDDDD';
		else {
			// sort candidates by number of votes, decending
			// that will leave the leader in the first array position [0]

			results.candidates.sort (function(a, b) {return parseInt(b.votes) - parseInt(a.votes)});
			var leader = results.candidates[0];
			var color = getLegendColor(leader);
		}


		$("area").each (function (i) {

			var thisOnMouseOver = $(this).attr('onMouseOver');
			// Extract the parameter - this is the town name
			var thisOnMouseOverArray = thisOnMouseOver.split("'");
			var town = thisOnMouseOverArray[1];
			var strokeWidth = (map_init.hasOwnProperty('stroke_width')) ? map_init.stroke_width : 1;
			town = town.toLowerCase();
			town = town.replace(" ","_");


			if (town==this_town) {
						var new_class = this_town + " {strokeColor:'FFFFFF',strokeWidth:" + strokeWidth + ",fillColor:'" + color + "',fillOpacity:1,alwaysOn:true}";
				$(this).addClass(new_class);
			}
		});
		//		$('.' + this_town).addClass(new_class);
	}
});

////////////////////////////////////////////////////////////////////////////////////
