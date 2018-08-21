
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
	};
	function createTestVotes() {
		// global: map_init.data_source
		var distribution = [300000,5000,300000,10,10];
		for (var prop in map_init.data_source) {
			var thisProp = map_init.data_source[prop];
				var precinct_count = map_init.data_source[prop].precinct_count;
				map_init.data_source[prop].precincts_reporting = precinct_count;
				$.each(thisProp.contests,function(j){
					$.each(this.candidates, function(k) {
					//	console.log(map_init.data_source[prop].contests[j].candidates[k].name);
							map_init.data_source[prop].contests[j].candidates[k].votes=_.random(0,distribution[k]);
					});
				});
		}
	}

	function getParty(abbr) {
		var parties = {
			'dem':'Dem',
			'rep':'Rep',
			'ind':'Ind',
			'mod':'Mod'
		};

		var key = abbr.toLowerCase();
		return parties[key] || '';
	}

	function getCandidateLastName(full_name) {
		// global legend
		return _.find(candidates, function(candidate) { 
			return candidate.full_name === full_name;
		}).name;
	}

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
				contest_name = this.name;
				return;
			}
		});
		return contest_name;
	}

	function lookupCandidateBaseColor(fullName) {
		// global: legend
		return _.find(candidates, function(candidate) {
			return fullName.indexOf(candidate.name) !== -1;
		}).color;
	}

	// maps an input domain to an output range
	// domain is array with two values: min and max
	function createScale(domain, range) {
		return function(value) {
			if (value <= domain[0]) {
				return range[0];
			}
			if (value >= domain[1]) {
				return range[1];
			}
			var domainSpread = domain[1] - domain[0];
			var rangeSpread = (range[1] - range[0])
			return Math.floor(((value - domain[0]) * rangeSpread) / domainSpread);
		}
	}

	function getLegendColor(leader) {
		// global: legend, map_init
		var steps = map_init.steps;
		var candidate_count = candidates.length;
		var min_winner_pct = parseInt(100/candidate_count) + 1;
		var color = lookupCandidateBaseColor(leader.name);

		// get 1 more than needed - the first color will be white, which we get rid of
		var palette = mixPalette("FFFFFF", color, steps + 1);
		palette.shift(); // get rid of first element since it is pure white
		var scale = createScale([min_winner_pct, 100], [0, steps]);
		var paletteIndex = scale(leader.pct_votes);
		return palette[paletteIndex];
	}

function buildLegend(selector) {
	race_name = getRaceName(map_init.race_number);
	var html = '<div class="race_name">' + race_name + "</div>";
	for (var index = 0; index < candidates.length; index++) {
		html +=
			'<div class="color_box" style="background:#' +
			candidates[index].color +
			';"></div>';
		html += '<div class="candidate_name">' + candidates[index].name + "</div>";
	}
	html += "</div>";
	html += '<div style="clear:both;">';
	$(selector).html(html);
}

function mapOnMouseOver(location){
	var new_location = location.replace(" ","_");
	new_location = new_location.toLowerCase();
	results = get_results_by_race(map_init.data_source[new_location], map_init.race_number);
	var html = showResultsTableTip(results, location);
	Tip(html, BGCOLOR, '#FFFFFF', BORDERCOLOR, '#96A3AF', PADDING, '5', 'SHADOW', true);
}

function showResultsTableTip(results, str) {
	var threshhold = 5;  // any candidate with less than this percent of the vote put into the "Other" category
	var html = '';
	var new_str = str.replace(" ","_");
	new_str = new_str.toLowerCase();
	results = get_results_by_race(map_init.data_source[new_str],map_init.race_number);
	html += '<input type="hidden" id="buttonEID" value="' + results.name.toLowerCase() + '"><input type="hidden" id="pView" value="map"><input type="hidden" id="pFilter" value="' + results.contest_number + '"><input type="hidden" id="fNameHolder" value="statewide">\
	   <div class="key-races general-election">\
	      <div id="race-header">\
	         <h3>' + str + '</h3>\
	      </div>\
	      <div class="candidates-header-container">\
	         <div class="candidates-header-large">\
	            <h4>NAME</h4>\
	         </div>\
	         <div class="candidates-header">Votes</div>\
	         <div class="candidates-header pct">Pct</div>\
	         <div style="clear: both;"></div>\
	      </div>';
	      var other_votes=0;
	      var other_pct_votes=0;
	      for (var x=0;x<results.candidates.length;x++) {
	      	 if (results.candidates[x].pct_votes < threshhold) {
	      	 	other_votes += parseInt(results.candidates[x].votes);
	      	 	other_pct_votes += results.candidates[x].pct_votes;
	      	 }
	      	 else {
				 var last_name = getCandidateLastName(results.candidates[x].name);
				 html += '<div id="candidate-row"' + ((x==0) ? ' class="solid-border">' : '>');
				 html += '<div class="candidate-col">' + last_name.capitalize() + '<br><span class="party-name"><span class="candidate-party">' + getParty(results.candidates[x].party_code) + '</span></span></div>\
				 <div class="candidate-col-votes">' + Number(results.candidates[x].votes).format("0,000") + '</div>\
				 <div class="candidate-col-percent">' + Number(results.candidates[x].pct_votes).format("0.0%") + '</div>\
				 <div style="clear: both;"></div>\
				 </div>';
			}
	      }
	      if (other_votes>0) {
				 html += '<div id="candidate-row">';
				 html += '<div class="candidate-col">Other</div>\
				 <div class="candidate-col-votes">' + Number(other_votes).format("0,000") + '</div>\
				 <div class="candidate-col-percent">' + Number(other_pct_votes).format("0.0%") + '</div>\
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

//////////////////////////////////////////////////////////////////////////////////////
function mapResizePct(pct) {

	$("area").each (function (i) {

	// get the coordinate pairs for this polygon area and put them in an array
	var coordStr = $(this).attr('coords');
	var coordArry = coordStr.split(',');

	for (var x=0;x<coordArry.length;x++) {
		coordArry[x] = Math.round(coordArry[x] * pct);
	}

	coordStr = coordArry.join();
	$(this).attr('coords',coordStr);
	});
}

//////////////////////////////////////////////////////////////////////////////////////
function mixPalette(start_hex,end_hex,steps) {

//	globals: none

	var step = {};
	var start_rgb = hexToRGB(start_hex);
	var end_rgb = hexToRGB(end_hex);
	var palette = [];


	var denominator = (steps<2) ? 1 : steps-1;

	step.r = (end_rgb.r - start_rgb.r) / denominator;
	step.g = (end_rgb.g - start_rgb.g) / denominator;
	step.b = (end_rgb.b - start_rgb.b) / denominator;

	for (var i = 0; i < steps; i++) {
		var this_rgb = {};
		this_rgb.r = start_rgb.r + (step.r * i);
		this_rgb.g = start_rgb.g + (step.g * i);
		this_rgb.b = start_rgb.b + (step.b * i);
		palette.push(ColorObjToHex(this_rgb));
	}

	return palette;

}

//////////////////////////////////////////////////////////////////////////////////////
function hexToRGB (color_str) {
	color_str = color_str.toUpperCase();
	color_str = color_str.replace(/[\#rgb\(]*/,'');
	if (color_str.length == 3) {
		var r = color_str.substr(0,1);
		var g = color_str.substr(1,1);
		var b = color_str.substr(2,1);
		color_str = r + r + g + g + b + b;
	}
	var red_hex = color_str.substr(0,2);
	var green_hex = color_str.substr(2,2);
	var blue_hex = color_str.substr(4,2);
	var this_color = {};
	this_color.r = parseInt(red_hex,16);
	this_color.g = parseInt(green_hex,16);
	this_color.b = parseInt(blue_hex,16);

	return this_color;
}


//////////////////////////////////////////////////////////////////////////////////////
function ColorObjToHex (rgb) {

	var r = (parseInt(rgb.r,10)).toString(16);
	var g = (parseInt(rgb.g,10)).toString(16);
	var b = (parseInt(rgb.b,10)).toString(16);

	r= (r.length == 1) ? '0' + r : r;
	g= (g.length == 1) ? '0' + g : g;
	b= (b.length == 1) ? '0' + b : b;

	return (r+g+b).toUpperCase();

}

//////////////////////////////////////////////////////////////////////////////////////
function RGBStrToHex(str) {

	// this converts an RGB string to a hex color:
	// rgb(229,245,249) --> e5f5f9
	var a = str.split("(")[1].split(")")[0];
	a = a.split(",");

	// Convert the single numbers to hex
	var b = a.map(function(x){             //For each array element
	    x = parseInt(x).toString(16);      //Convert to a base16 string
	    return (x.length==1) ? "0"+x : x;  //Add zero if we get only one character
	})
	// Glue it back together:

	return b.join("");

}

//////////////////////////////////////////////////////////////////////////////////////
// Point object
function Point(x,y) {
  this.x=x;
  this.y=y;
}
//////////////////////////////////////////////////////////////////////////////////////
function getMaxXY (selector) {
	var xArry = [];
	var yArry = [];
	$(selector).each (function (i) {
		// get the coordinate pairs for each polygon area and put them in an array
		var coordStr = $(this).attr('coords');
		var coordArry = coordStr.split(',');

		// split off the x's in one array, the y's in another
		for (x=0;x<coordArry.length;x+=2) {
			xArry.push(parseInt(coordArry[x]));
			yArry.push(parseInt(coordArry[x+1]));
		}

	}); // each

	// get max,min, average for the x's and y's
	// the average x,y will be the center of the square that bounds the polygon
	var xmax = Math.max.apply(Math, xArry);
	var ymax = Math.max.apply(Math, yArry);
	return new Point(xmax,ymax);

}

//////////////////////////////////////////////////////////////////////////////////////
function mapResizeWidth(width) {
	var maxXY = getMaxXY("area");
	var pct = width/maxXY.x;
	mapResizePct(pct);

	// set image to the correct dimensions
	var maxXY = getMaxXY("area");
	$('.map').css('width',maxXY.x + 'px');
	$('.map').css('height',maxXY.y + 'px');
	$('.map img').attr('width',maxXY.x);
	$('.map img').attr('height',maxXY.y);

}

function createGeoLabels() {

	start = new Date();
 	var label_div_content = '';

	$("area").each (function (i) {
		//get the onMouseOver attribute
		var thisOnMouseOver = $(this).attr('onMouseOver');

		// Extract the parameter - this is the town name
		var thisOnMouseOverArray = thisOnMouseOver.split("'");
		var this_town = thisOnMouseOverArray[1];

		var this_town_lower = this_town.replace(" ","_").toLowerCase();

		// get the coordinate pairs for this polygon area and put them in an array
		var coordStr = $(this).attr('coords');
		var coordArry = coordStr.split(',');
		var xArry = [];
		var yArry = [];

		// split off the x's in one array, the y's in another
		for (x=0;x<coordArry.length;x+=2) {
			xArry.push(parseInt(coordArry[x]));
			yArry.push(parseInt(coordArry[x+1]));
		}
		// get max,min, average for the x's and y's
		// the average x,y will be the center of the square that bounds the polygon
		var xmax = Math.max.apply(Math, xArry);
		var xmin = Math.min.apply(Math, xArry);
		var ymax = Math.max.apply(Math, yArry);
		var ymin = Math.min.apply(Math, yArry);
		var xavg = parseInt((xmax-xmin)/2) + xmin;
		var yavg = parseInt((ymax-ymin)/2) + ymin;

		var xsum= _.sum(xArry);
		var ysum= _.sum(yArry);

		// create a style based on the average x,y coordinates
		this_style = 'left:' + xavg + 'px; top:' + yavg + 'px; ';

		// create a div and put in the style with the coordinates
		label_div_content += '<div onMouseOver="mapOnMouseOver(\'' + this_town + '\');" class="map_label ' + this_town_lower + '_label"';
		label_div_content += ' style="' + this_style + '" ';
		label_div_content += '>' + this_town  + '</div>';
	});  // end of each

	$('#label_div').html(label_div_content);
	$('#label_div').css({display: map_init.default_hide_labels ? 'none': null })

	var end = new Date();
	console.log(end-start);
}

function assignColorsToPolygons() {
	// color the map
	for (var this_town in map_init.data_source) {
		var results = get_results_by_race(map_init.data_source[this_town],map_init.race_number);
		if (results.precincts_reporting == 0) {
			var color = 'DDDDDD';
		}
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

			if (town === this_town) {
						var new_class = this_town + " {strokeColor:'FFFFFF',strokeWidth:" + strokeWidth + ",fillColor:'" + color + "',fillOpacity:1,alwaysOn:true}";
				$(this).addClass(new_class);
			}
		}); // end area each
	}  // end for 
} // end function colormap

function attachMouseEvents() {
	$("area").mouseleave(function() {
  		UnTip();
	});
 	$(".map_label").mouseleave(function() {
   		UnTip();
	});
}

	// // place legend div
	// var legend_width = parseInt($('.map_legend').css('width'));
	// var container_width = parseInt($('.map_container').css('width'))+map_init.legend_width_offset;
	// $('.map_legend').css('left',(map_init.legend_left_offset)+'px');
	// $('.map_legend').css('top',map_init.legend_top_offset + 'px');



