// Tim's mapping functions
// Timothy C. Barmann
// tbarmann@providencejournal.com
// 11/16/2010
// last revision 1/27/2014

// now requires underscore.js
// removed functions that duplicated in underscore.js
// rewrote to initialized all fields at the start
// 'field' is no longer a global


/*
  fields array now optional. It is created automatically if it doesn't exist. The label is set to the field's
	name; if a field's value is numeric, it is automatically set to be mapable
*/

//////////////////////////////////////////////////////////////////////////////////////
// IE doesn't have Array.map, so this adds it
if (!Array.prototype.map)
{
  Array.prototype.map = function(fun /*, thisp */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in t)
        res[i] = fun.call(thisp, t[i], i, t);
    }

    return res;
  };
}

//////////////////////////////////////////////////////////////////////////////////////
String.prototype.replaceSpacesLowerCase = function() {
	var str = this.replace(/\s/, '_');
//	str = str.toLowerCase();
	return str;
};

//////////////////////////////////////////////////////////////////////////////////////
String.prototype.restoreSpaces = function()
{
	var str = this.replace(/_/g, ' ');
   // return str.toLowerCase().replace(/^(.)|\s(.)/g, function($1) { return $1.toUpperCase(); });
	return str;
}


//////////////////////////////////////////////////////////////////////////////////////
function generateColor(ranges) {
            if (!ranges) {
                ranges = [
                    [150,256],
                    [50, 190],
                    [50, 256]
                ];
            }
            var g = function() {
                //select random range and remove
                var range = ranges.splice(Math.floor(Math.random()*ranges.length), 1)[0];
                //pick a random number from within the range
                return Math.floor(Math.random() * (range[1] - range[0])) + range[0];
            }
            var rgb = {};
            rgb.r = g();
            rgb.g = g();
            rgb.b = g();

            return '' + ColorObjToHex(rgb);
}


//////////////////////////////////////////////////////////////////////////////////////
function isMapable(index) {
	if (map_init.fields[index].hasOwnProperty('mapable')) {
		if (map_init.fields[index].mapable === true){
			return true;
		}
	}
	return false;
}

//////////////////////////////////////////////////////////////////////////////////////
function needsPalette(index) {
	// if has a palette array, it has to have more than 1 member
	if (map_init.fields[index].hasOwnProperty('palette')) {
		if (map_init.fields[index].palette.length > 1) {
			return false;
		}
	}
	return true;
}
//////////////////////////////////////////////////////////////////////////////////////
function createPalette(index) {

	map_init.fields[index].palette = [];
	var steps = map_init.fields[index].steps;

	if (map_init.fields[index].hasOwnProperty('type')) {
		if (map_init.fields[index].type == 'string') {
			for (var x=0;x<steps;x++) {
				map_init.fields[index].palette[x] = generateColor();
			}
			return;
		}
	}
	map_init.fields[index].type = 'number';

	map_init.fields[index].palette = mixPalette(map_init.fields[index].start_color,
												map_init.fields[index].end_color,
												map_init.fields[index].steps);

}
//////////////////////////////////////////////////////////////////////////////////////
function checkPalette(index) {
	// globals: map_init.fields

	// check each color in the palette of this field
	// remove '#' if present
	// convert RGB string to Hex if necessary
	$.each(map_init.fields[index].palette,function(i,v){
		map_init.fields[index].palette[i] = this.replace('#','');
		if (this.toUpperCase().indexOf("RGB") !== -1) {
			map_init.fields[index].palette[i]=RGBStrToHex(this);
			}
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
function mapResizeWidth(width) {
	var maxXY = getMaxXY("area");
	var pct = width/maxXY.x;
	mapResizePct(pct);



}


//////////////////////////////////////////////////////////////////////////////////////
function moveArea(id,x_offset,y_offset) {

	var selector = '#id_' + id + ',1';
	var coordStr = $(selector).attr('coords');
	var coordArry = coordStr.split(',');
	for (var x=0;x<coordArry.length;x+=2) {
		coordArry[x]*=1;
		coordArry[x+1]*=1;
		coordArry[x]+= parseInt(x_offset);
		coordArry[x+1]+= parseInt(y_offset);

	}
	coordStr = coordArry.join();
	$(selector).attr('coords',coordStr);
}




//////////////////////////////////////////////////////////////////////////////////////
function locDataLookup(location,field_index) {

// globals: map_init

	 var join_field = map_init.join_field;
	 var target_field_name = map_init.fields[field_index].name;
	 var datasource = map_init.datasource;

	var searchObj = {};
	searchObj[join_field] = location;
	var data = _.findWhere(datasource,searchObj);
	if (data!== undefined) {
		return data[target_field_name];
	}

	return "No data for " + location;
}


//////////////////////////////////////////////////////////////////////////////////////
// Point object
function Point(x,y) {
  this.x=x;
  this.y=y;
}

//////////////////////////////////////////////////////////////////////////////////////
// Contour object
function Contour(a) {
  this.pts = []; // an array of Point objects defining the contour
}
// ...add points to the contour...

//////////////////////////////////////////////////////////////////////////////////////
Contour.prototype.area = function() {
  var area=0;
  var pts = this.pts;
  var nPts = pts.length;
  var j=nPts-1;
  var p1; var p2;

  for (var i=0;i<nPts;j=i++) {
     p1=pts[i]; p2=pts[j];
     area+=p1.x*p2.y;
     area-=p1.y*p2.x;
  }
  area/=2;
  return area;
};

//////////////////////////////////////////////////////////////////////////////////////
Contour.prototype.centroid = function() {
  var pts = this. pts;
  var nPts = pts.length;
  var x=0; var y=0;
  var f;
  var j=nPts-1;
  var p1; var p2;

  for (var i=0;i<nPts;j=i++) {
     p1=pts[i]; p2=pts[j];
     f=p1.x*p2.y-p2.x*p1.y;
     x+=(p1.x+p2.x)*f;
     y+=(p1.y+p2.y)*f;
  }

  f=this.area()*6;
  return new Point(parseInt(x/f),parseInt(y/f));
};


//////////////////////////////////////////////////////////////////////////////////////
function shrinkArea(area,pct) {


	var minXY = getMinXY(area);

	var coordStr = $(area).attr('coords');
	var coordArry = coordStr.split(',');
	var newCoordStr = "";

	for (var j=0;j<coordArry.length;j+=2) {
		var x = parseInt(((coordArry[j] - minXY.x)*pct) + minXY.x);
		var y = parseInt(((coordArry[j+1] - minXY.y)*pct) + minXY.y);
		if (newCoordStr.length > 0) {
			newCoordStr += ", ";

		}
		newCoordStr += x + "," + y;
	}

	$(area).first().attr('coords',newCoordStr);
}




//////////////////////////////////////////////////////////////////////////////////////
function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}


//////////////////////////////////////////////////////////////////////////////////////
function getLegendStep(target,field_index) {
// given a target value, searches through all datasource values of a particular field
// and figures out which step the target value belongs
// globals: datasource, map_init.fields, steps, map_init

	var delimiter = (typeof target === "string") ? "'" : "";

	field = map_init.fields[field_index];

	if (field.type==="string") {
		for (var x=0;x<field.values.length;x++) {
			if (field.values[x]==target) {
				return x;
			}
		}
	console.log ("Warning: Target in unique values not found: " + delimiter + target + delimiter);
	return null;
	}
	else {
		for (var index=0; index<field.boundaries.length; index++) {
			if ((target >= field.boundaries[index]['lower']) && (target <= field.boundaries[index]['upper'])) {
				return index;
			}
		}

	console.log ("Warning: Target in boundaries array not found: " + delimiter + target + delimiter);
	return null;
	}

}

//////////////////////////////////////////////////////////////////////////////////////
function extractLoc(thisOnMouseOverStr) {
	// Extract the parameter - this is the location name
	var thisOnMouseOverArray = thisOnMouseOverStr.split("'");
	var loc = thisOnMouseOverArray[1];
//	loc = loc.replaceSpacesLowerCase();
	return loc;

}


//////////////////////////////////////////////////////////////////////////////////////
function isEven(x) { return (x%2)?false:true; }
function isOdd(x) { return (x%2)?true:false; }


//////////////////////////////////////////////////////////////////////////////////////
function mapOnMouseOver(loc){

//	var loc = loc.replace(" ","_");
	var data = map_init.indexed_data[loc];
	var heading = "";
	var footer = "";

	if (map_init.hasOwnProperty('tooltip_heading')) {
		var tmp = _.template(map_init.tooltip_heading);
		heading = tmp(data);
	}
	else if (map_init.hasOwnProperty('join_field_label')) {
		heading = map_init.join_field_label + ': ' + loc;
	}
	else {
		heading = loc;
	}
	if (map_init.hasOwnProperty('tooltip_footer')) {
		var tmp = _.template(map_init.tooltip_footer);
		footer = tmp(data);
	}

	var html = '<table class="tip_table">';
	html +='<tr>';
	html +='<td colspan="2">';
	html += '<div class="label_loc">' + heading + '</div>';
	html += '</td></tr>';
	for (var field_index = 0; field_index<map_init.fields.length; field_index++) {
		if (map_init.fields[field_index].tooltip === false) {
			continue;
		}

		var field_name = map_init.fields[field_index].name;
		html+='<tr';
		if (isEven(field_index))
			html += ' class="even"';
		html+='>';
		html +='<td>';
		html +=map_init.fields[field_index].label;
		html +='</td>';
		html +='<td>';


		var field_value = (data===undefined) ? "No data" : data[field_name];

		if (map_init.fields[field_index].hasOwnProperty('format')===true && $.isNumeric(field_value)) {
			field_value = field_value.format((map_init.fields[field_index].format));
		}
		html += field_value;
		html += '</td></tr>';
	}
	if (footer.length) {

			html +='<tr>';
			html +='<td colspan="2">';
			html += '<div class="tooltip_footer">' + footer + '</div>';
			html += '</td></tr>';
	}
	html += '</table>';
	Tip(html);
}



//////////////////////////////////////////////////////////////////////////////////////
function buildLegend (field_index) {

	// global objects: map_init, map_init.fields

	var field = map_init.fields[field_index];

	var columns = 1;
	if (field.hasOwnProperty('legend_columns')) {
		if ($.isNumeric(field.legend_columns)) {
			columns = parseInt(field.legend_columns);
		}
	}
	var rows = Math.ceil(field.steps/columns);
	var colspan = 2 * columns;

	var html='<table class="map_legend">';
	html += '<tr><td colspan="' + colspan + '"><div class="legend_heading">' + field.label + '</div></td></tr>';

	var index = 0;
	for (var row=0; row < rows; row++) {
		html +='<tr>';
		for (var col=0; col < columns; col++) {
			if(index >= field.steps){
				html +="<td>&nbsp;</td><td>&nbsp;</td>";
				continue; // if there is no value for this index, add empty cells and continue on to the next column
			}
			if  (field.type==="string") {
				if ($.isNumeric(field.values[index])) {
					var desc = parseFloat(field.values[index]);
					desc = desc.format(field.format);
				}
				else {
					desc = field.values[index].restoreSpaces();

				}
			}
			else {
				var lower_range = field.boundaries[index]['lower'].format(field.format);
				var upper_range = field.boundaries[index]['upper'].format(field.format);
				if (upper_range.indexOf("Infinity")!==-1) {
					var desc = '&gt;= ' + lower_range;
				}
				else if (lower_range.indexOf("Infinity")!==-1) {
					var desc = '' + upper_range;
				}
				else if (lower_range === upper_range) {
					var desc = lower_range;
				}
				else {
				var desc = lower_range + ' to ' + upper_range;
				}
			}
			mouseOverStr  = 'onMouseOver="highlight_areas(\'step_' + index + '\');"';
			mouseOverStr += ' onMouseOut="unhighlight_areas(\'step_' + index + '\');"';

			html +='<td><div class="color_box" ' + mouseOverStr + ' style="background:#' + getPaletteColor(field_index,index) + ';">&nbsp;</div></td>';
			html +='<td>' + desc +  '</td>';
			index++;
		}
		html +='</tr>';
	}

	html +='</table>';


	$('#legend').html(html);

	$('.legend_div').width($('.map_legend').width());

	// place legend div
	var cssObj = {};
	cssObj[map_init.legend_h_offset_type] = map_init.legend_h_offset;
	$('.legend_div').css(cssObj);
	$('.legend_div').css('top',map_init.legend_v_offset);



	return;
}


//////////////////////////////////////////////////////////////////////////////////////
function initFields () {
	// if the field does not have a label property, add one using the field's name
	// global objects: map_init, map_init.fields


	if (typeof(map_init.datasource) === 'undefined') {
		console.log("Error: Data source has not been defined.");
		return;
	}

	if (typeof(map_init.fields) === 'undefined') {

		// create global array called fields
		map_init.fields = new Array();

		var props = _.keys(map_init.datasource[0]);
		for (var index=0; index<props.length; index++) {
			map_init.fields[index] = {"name": props[index]};
		}
	}

	for (var index=0; index< map_init.fields.length; index++) {
		if (!map_init.fields[index].hasOwnProperty('label')) {
				map_init.fields[index].label = map_init.fields[index].name;
		}
		if (!map_init.fields[index].hasOwnProperty('mapable')) {
			map_init.fields[index].mapable = $.isNumeric(map_init.datasource[0][map_init.fields[index].name]) ;
		}
		if (map_init.fields[index].mapable) {
			$.extend(map_init.fields[index],map_init.field_defaults);


			if (needsPalette(index)) {
				createPalette(index);
			}
			checkPalette(index);
		}
	}
	setStepBounds ();
	buildMapChooser();

}



//////////////////////////////////////////////////////////////////////////////////////
function setStepBounds () {

	// global objects: map_init,map_init.fields

	$.each(map_init.fields,function(field_index, value){

		// if the field type is string, the number of steps = the number of unique values for that field
		// get all the unique values, sorted, and save them to be used to build
		// the legend - buildLegend(), and then return. No need to determine boundaries.
		if (map_init.fields[field_index].hasOwnProperty('type')) {
			if (map_init.fields[field_index].type === 'string') {
				if (!map_init.fields[field_index].hasOwnProperty('values')) {
					map_init.fields[field_index].values = _.uniq(_.pluck(map_init.datasource,map_init.fields[field_index].name));
					map_init.fields[field_index].steps = map_init.fields[field_index].values.length;
					return;
				}
			}
		}

		map_init.fields[field_index].type = 'number';

		// Find out how many steps.

		// if the boundaries have already been set by the user in the field definition, just set the steps
		// and return. No need to classify.

		if (map_init.fields[field_index].hasOwnProperty('boundaries')) {
			map_init.fields[field_index].steps = map_init.fields[field_index].boundaries.length;
			return;

		}

		// no boundaries set yet
		// if a palette has been set, set steps to palette length

		if (map_init.fields[field_index].hasOwnProperty('palette')){
			map_init.fields[field_index].steps = map_init.fields[field_index].palette.length;

		}
		// now classify

		// get min and max values for entire dataset
		var all_values = [];
		$.each(map_init.datasource,function(){
			all_values.push(_.values(this));
		});

		all_values = _.flatten(all_values);
		all_numbers = _.filter(all_values,function(n){
			return _.isNumber(n);
		});

		var all_fields_max = Math.ceil(_.max(all_numbers))+1;  // adding 1 ensures that target will be < max
		var all_fields_min = Math.floor(_.min(all_numbers));

		// get min and max values for this field
		var this_max = Math.ceil(_.max(_.pluck(map_init.datasource,map_init.fields[field_index].name))) + 1; // adding 1 ensures that target will be < max
		var this_min = Math.floor(_.min(_.pluck(map_init.datasource,map_init.fields[field_index].name)));

		if (map_init.use_common_legend === true) {
			map_init.fields[field_index].max_value =  Math.max(all_fields_max,this_max);
			map_init.fields[field_index].min_value =  Math.min(all_fields_min,this_min);
		}
		else {
			map_init.fields[field_index].max_value = this_max;
			map_init.fields[field_index].min_value = this_min;
		}

		var max =  map_init.fields[field_index].max_value;
		var min =  map_init.fields[field_index].min_value;
			var range = max-min;

		if (map_init.fields[field_index].hasOwnProperty('interval')) {
				map_init.fields[field_index].steps =  Math.ceil(range/field.interval);
		}
		else {
			map_init.fields[field_index].interval = range/map_init.fields[field_index].steps;

		}

		var steps = map_init.fields[field_index].steps;
			var interval = map_init.fields[field_index].interval;
		map_init.fields[field_index].boundaries = [];
		var lower_bound = min;

		for (var x=0; x<steps; x++) {
			map_init.fields[field_index].boundaries[x]= {'lower':lower_bound, 'upper':lower_bound + interval};
			lower_bound += interval;

		}
		return;

	}); // end each

}





//////////////////////////////////////////////////////////////////////////////////////
function highlight_areas(e) {


	$('area').each (function(i) {
		var this_class = $(this).attr('class');
		this_class=this_class.replace("fillOpacity:1","fillOpacity:0.1");
		$(this).attr('class', this_class);
	});


	$('area.' + e).each (function(i) {
		var this_class = $(this).attr('class');
		this_class=this_class.replace("fillOpacity:0.1","fillOpacity:1");
		$(this).attr('class', this_class);
	});
	$('.map').maphilight();

}

//////////////////////////////////////////////////////////////////////////////////////
function unhighlight_areas(e) {
	$('area').each (function(i) {
		var this_class = $(this).attr('class');
		this_class=this_class.replace("fillOpacity:0.1","fillOpacity:1");
		$(this).attr('class', this_class);
	});
	$('.map').maphilight();

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
function getMinXY (selector) {
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

	// get min for the x's and y's

	var xmin = Math.min.apply(Math, xArry);
	var ymin = Math.min.apply(Math, yArry);
	return new Point(xmin,ymin);

}

//////////////////////////////////////////////////////////////////////////////////////
function getFieldIndexByName (fieldname) {
	for (var x=0;x<map_init.fields.length;x++) {
		if (map_init.fields[x].name==fieldname) {
			return x;
		}
	}
	return 0;
}

//////////////////////////////////////////////////////////////////////////////////////
function labelMap (field_index) {

	var field = map_init.fields[field_index];

	// set image to the correct dimensions
	var maxXY = getMaxXY("area");

	$('.map_container').css('width',maxXY.x + 'px');
	$('.map_container').css('height',maxXY.y + 'px');


	$('.map').css('width',maxXY.x + 'px');
	$('.map').css('height',maxXY.y + 'px');

	$('.map img').attr('width',maxXY.x);
	$('.map img').attr('height',maxXY.y);

 	var label_div_content = "";

	$("area").each (function (i) {

		//get the onMouseOver attribute
		var thisOnMouseOver = $(this).attr('onMouseOver');
		var thisOnMouseOverStr = thisOnMouseOver.toString();
		var location = extractLoc(thisOnMouseOverStr);
		var this_value = locDataLookup(location,field_index);
		var label = location.restoreSpaces();


		// see if we want the map labels to show location or the value for this field
		if (field.hasOwnProperty('map_display')) {
			if (field.map_display === "value") {
				label = this_value;

			}
		}

		// find the centroid coordinates for this polygon area - this is where the label goes
		// get the coordinate pairs for this polygon area and put them in an array
		var coordStr = $(this).attr('coords');
		var coordArry = coordStr.split(',');
		var perimeter = new Contour();

		for (var j=0;j<coordArry.length;j+=2) {
			var this_point = new Point(parseInt(coordArry[j]),parseInt(coordArry[j+1]));
			perimeter.pts.push(this_point);
		}
		var this_centroid_pt = perimeter.centroid();

		// create a style based on the centroid x,y coordinates
		var this_style = 'left:' + this_centroid_pt.x + 'px; top:' + this_centroid_pt.y + 'px; ';
		var this_id = location + '_label';

		// create a div and put in the style with the coordinates
		label_div_content += '<div onMouseOver="mapOnMouseOver(\'' + location.restoreSpaces() + '\');" class="map_label"';
		label_div_content += ' style="' + this_style + '" ';
		label_div_content += ' id="' + this_id + '" ';
		label_div_content += '>' + label  + '</div>';

	});  // end of each
	$('#label_div').html(label_div_content);
}


//////////////////////////////////////////////////////////////////////////////////////
function getPaletteColor(field_index,palette_index) {


	// global map_init.fields
	if (map_init.fields[field_index].palette.length>palette_index && palette_index !== null) {
		return map_init.fields[field_index].palette[palette_index];
	}
	return map_init.color_no_data;

}

//////////////////////////////////////////////////////////////////////////////////////
function colorMap(field_index) {

	var start = new Date().getTime();
	// global objects: map_init, map_init.fields

	var join_field = map_init.join_field;
	var map_field_name = map_init.fields[field_index].name;

	// index the data by the geo field to make it faster to search
	map_init.indexed_data = _.indexBy(map_init.datasource, join_field);


	$("area").each (function () {
			var thisOnMouseOver = $(this).attr('onMouseOver');
			var this_loc = extractLoc(thisOnMouseOver.toString());
			var border_color = map_init.polygon_border_color;

			var this_data_obj = map_init.indexed_data[this_loc];

			if (this_data_obj !== undefined) {
				var this_data = this_data_obj[map_field_name];
				var step = getLegendStep(this_data,field_index);
				var color=getPaletteColor(field_index,step);
				var new_class = "step_" + step + " {strokeColor:'" + border_color + "',strokeWidth:0.5,fillColor:'" + color + "',fillOpacity:1,alwaysOn:true,fade:false}";
				$(this).attr('class', new_class);
				$(this).attr('id', 'id_' +this_loc );
			}
			else {
				// No match for this place in the data; give it default color for no data
				var color = map_init.color_no_data;
				var fill_opacity = map_init.fill_opacity_no_data;
				var stroke_width = map_init.stroke_width_no_data;
				var stroke_color = map_init.stroke_color_no_data;
				var new_class = " {fillColor:'" + color + "', strokeColor:'" + stroke_color + "',strokeWidth:" + stroke_width + ",fillOpacity:" + fill_opacity + ",alwaysOn:true,fade:false}";
				$(this).attr('class', new_class);
			}

	});


var end = new Date().getTime();
var time = end - start;
time = (time>1000) ? time/1000 + ' sec' : time + ' millsec';
console.log('colorMap() execution time: ' + time);

}

//////////////////////////////////////////////////////////////////////////////////////
function getLabel(field_name) {

	// global map_init.fields
	var search_obj = {};
	search_obj['name'] = field_name;
	var this_field = _.findWhere(map_init.fields,search_obj);
	if (this_field !== undefined) {
		return this_field.label;
	}
	return field_name;
}

//////////////////////////////////////////////////////////////////////////////////////
function jsonToTable(json,this_class,this_id) {

	var classStr = (this_class) ? ' class="' + this_class + '" ' : '';
	var idStr = (this_id) ? ' id="' + this_id + '" ' : '';
	var headers = new Array();
	var formats = new Array();
	var data;
	var html = '';
	var location_field_name = map_init.join_field;
	var headers = _.pluck(map_init.fields, "name");

	html = '<table' + classStr + idStr + '>';
	html += '<thead>';
	html += '<tr>';
	html += '<th>' + map_init.join_field_label + '</th>';
	for (var col=0; col<headers.length; col++) {
		html += '<th>' + getLabel(headers[col]) + '</th>';
	}
	html += '</tr>';
	html += '<thead>';
	html += '<tbody>';

	for (var row = 0; row<json.length; row++) {
		html += '<tr>';
		html += '<td>' + json[row][map_init.join_field] + '</td>';
		for (var col = 0; col<headers.length; col++) {
			var raw = json[row][headers[col]];
			data = ($.isNumeric(raw) && (typeof map_init.fields !=='undefined')) ? raw.format(map_init.fields[col].format) : raw;
			html +='<td data-value="' + raw + '">' + data + '</td>';
		}
		html += '</tr>';
	}
	html += '</tbody>';
	html += '</table>';

	return html;
}
//////////////////////////////////////////////////////////////////////////////////////
function buildMapChooser(){
	// global - map_init
	if (map_init.show_map_chooser === true) {
		var html = '<select onchange="changeMap(this.value);">';
		$.each(map_init.fields, function(x, value) {
			if (value.mapable === true) {
				html += '<option value="' + x + '">' + value.label + '</option>'
			}  // end if
		}); // end each
		html += "</select>";
		$("#map_chooser").html(html);
	} // end if
}

//////////////////////////////////////////////////////////////////////////////////////
function changeMap(index) {
//	labelMap(index);
	colorMap(index);
	buildLegend(index);
	$('.map').maphilight();
}


//////////////////////////// events //////////////////////////////////////////
$(document).ready(function(){

			// make tooltip go away when mouse is moved off of area
			$("area").mouseleave(function() {
				UnTip();
			});
			$(".map_label").mouseleave(function() {
				UnTip();
			});

});
