// Mapping functions
// Timothy C. Barmann
// 11/16/2010




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


String.prototype.replaceSpacesLowerCase = function() {
	var str = this.replace(/\s/, '_');
	str = str.toLowerCase();
	return str;
};

String.prototype.restoreSpacesProperCase = function()
{
	var str = this.replace(/_/g, ' ');
    return str.toLowerCase().replace(/^(.)|\s(.)/g,
      function($1) { return $1.toUpperCase(); });
}





function mixPalette(start_hex,end_hex) {

//	globals: palette, steps

	var step = {};
	var start_rgb = hexToRGB(start_hex);
	var end_rgb = hexToRGB(end_hex);
	var this_palette = [];


	var denominator = (steps<2) ? 1 : steps-1;

	step.r = (end_rgb.r - start_rgb.r) / denominator;
	step.g = (end_rgb.g - start_rgb.g) / denominator;
	step.b = (end_rgb.b - start_rgb.b) / denominator;

	for (var i = 0; i <= steps; i++) {
		var this_rgb = {};
		this_rgb.r = start_rgb.r + (step.r * i);
		this_rgb.g = start_rgb.g + (step.g * i);
		this_rgb.b = start_rgb.b + (step.b * i);
		this_palette.push(RGBToHex(this_rgb));
	}

	return this_palette;

}

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


function RGBToHex (rgb) {

	var r = (parseInt(rgb.r,10)).toString(16);
	var g = (parseInt(rgb.g,10)).toString(16);
	var b = (parseInt(rgb.b,10)).toString(16);

	r= (r.length == 1) ? '0' + r : r;
	g= (g.length == 1) ? '0' + g : g;
	b= (b.length == 1) ? '0' + b : b;

	return (r+g+b).toUpperCase();

}




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


function mapResizeWidth(width) {
	var maxXY = getMaxXY("area");
	var pct = width/maxXY.x;
	mapResizePct(pct);



}


function locDataLookup(loc,field) {

// globals: datasource

 loc = loc.replaceSpacesLowerCase();
 for (var x=0;x<datasource.length;x++) {
 	var new_loc_name = datasource[x].loc.replaceSpacesLowerCase();
 	if (new_loc_name == loc)
 		return datasource[x][field.name];
	}
return 0;
}


// Point object
function Point(x,y) {
  this.x=x;
  this.y=y;
}

// Contour object
function Contour(a) {
  this.pts = []; // an array of Point objects defining the contour
}
// ...add points to the contour...

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




Array.maxProp = function (array, prop) {
  var values = array.map(function (el) {
    return el[prop];
  });
  return Math.max.apply(Math, values);
};


Array.minProp = function (array, prop) {
  var values = array.map(function (el) {
    return el[prop];
  });
  return Math.min.apply(Math, values);
};


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


function getLegendStep(target) {
// given a target value, searches through all datasource values of a particular field
// and figures out which step the target value belongs
// globals: datasource, field, steps

	var max =  Math.ceil((Array.maxProp(datasource, field.name)))+1; // adding 1 ensures that target will be < max
	var min =  Math.floor((Array.minProp(datasource, field.name)));
    var range = max-min;
    var interval = range/steps;
    var this_step = (target-min)/interval;

    this_step = Math.floor(this_step);
	return this_step;

	}

function extractLoc(thisOnMouseOverStr) {
	// Extract the parameter - this is the location name
	var thisOnMouseOverArray = thisOnMouseOverStr.split("'");
	var loc = thisOnMouseOverArray[1];
	loc = loc.replaceSpacesLowerCase();
	return loc;

}


function mapOnMouseOver(loc){

	var lower_loc = loc.replace(" ","_");
	lower_loc = lower_loc.toLowerCase();
	var html = '<table class="tip_table">';
	html +='<tr>';
	html +='<td colspan="2">';
		html += '<div class="label_loc">' + loc + '</div>';
	html += '</td></tr>';
	var rows = tip_fields.length;
	for (var row = 0; row<rows; row++) {
		html +='<tr>';
		html +='<td>';	
		html +=tip_fields[row].name;
		html +='</td>';	
		html +='<td>';	
		
		var data = locDataLookup(loc,tip_fields[row]);
		var digit_factor = Math.pow(10,field.digits)
		data = Math.round(data*digit_factor)/digit_factor;
		if (tip_fields[row].addcommas === "true") {
			data = addCommas(data);
		}
		html += tip_fields[row].prefix + data + tip_fields[row].postfix;
		html += '</td></tr>';
	} 
	html += '</table>';
	Tip(html,BGCOLOR,'#FFFFFF',BORDERCOLOR,'#999999',PADDING,'5');

}


function buildLegend () {

	// globals: datasource,field,palette,steps

	var max =  Math.ceil((Array.maxProp(datasource, field.name)))+1;
	var min =  Math.floor((Array.minProp(datasource, field.name)));
    	var range = max-min;
    	var interval = range/steps;

	var html='<table class="map_legend">';
	html += '<tr><td colspan="2"><div class="legend_heading">' + field.name.restoreSpacesProperCase() + '</div></td></tr>';

	for (var index=0; index<steps; index++) {
		var digit_factor = Math.pow(10,field.digits)
		var lower_range = Math.round(min*digit_factor)/digit_factor;
		var upper_range = Math.round((min+interval)*digit_factor)/digit_factor;
		if (field.addcommas==="true") {
			lower_range = addCommas(lower_range);
			upper_range = addCommas(upper_range);
		}
		mouseOverStr  = 'onMouseOver="highlight_areas(\'step_' + index + '\');"';
		mouseOverStr += ' onMouseOut="unhighlight_areas(\'step_' + index + '\');"';
		html +='<tr>';
		html +='<td><div class="color_box" ' + mouseOverStr + ' style="background:#' + palette[index] + ';">&nbsp;</div></td>';
		html +='<td>' + field.prefix + lower_range + field.postfix + ' - ' + field.prefix + upper_range + field.postfix + '</td>';
		html +='</tr>';
		min +=interval;
		}
	html +='</table>';
	

	$('.legend_div').html(html);
	return;
}


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

function unhighlight_areas(e) {


	$('area').each (function(i) {
		var this_class = $(this).attr('class');
		this_class=this_class.replace("fillOpacity:0.1","fillOpacity:1");
		$(this).attr('class', this_class);
	});



	$('.map').maphilight();

}


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

function labelMap () {
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
		var this_loc = extractLoc(thisOnMouseOverStr);

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
		var this_id = this_loc + '_label';

		// create a div and put in the style with the coordinates
		label_div_content += '<div onMouseOver="mapOnMouseOver(\'' + this_loc.restoreSpacesProperCase() + '\');" class="map_label"';
		label_div_content += ' style="' + this_style + '" ';
		label_div_content += ' id="' + this_id + '" ';
		label_div_content += '>' + this_loc.restoreSpacesProperCase()  + '</div>';
	});  // end of each
	$('#label_div').html(label_div_content);
}



function colorMap() {

	$("area").each (function (i) {
		for (var row in datasource) {
			var this_loc = datasource[row].loc.replaceSpacesLowerCase();
			var this_field_value = datasource[row][field.name];
			var step = getLegendStep(this_field_value);
			var color=palette[step];
			var thisOnMouseOver = $(this).attr('onMouseOver');
			var loc = extractLoc(thisOnMouseOver.toString());
			if (loc===this_loc) {
				var new_class = "step_" + step + " " + loc + " {strokeColor:'FFFFFF',strokeWidth:1,fillColor:'" + color + "',fillOpacity:1,alwaysOn:true,fade:false}";
				$(this).attr('class', new_class);
				break;
			}	// end if
		}  // end for
	}); // end each

	$('.map').maphilight();
	
}	
	
