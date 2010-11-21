/* ad-hoc SVG javascript library */

var svgns = document.rootElement.namespaceURI;

/* function getBBoxAsRectElement from http://my.opera.com/MacDev_ed/blog/2009/01/21/getting-boundingbox-of-svg-elements */
function getBBoxAsRectElement(elm)
{
	var bb = elm.getBBox();
	var rect = document.createElementNS(svgns, "rect");
	rect.x.baseVal.value = bb.x;
	rect.y.baseVal.value = bb.y;
	rect.width.baseVal.value = bb.width;
	rect.height.baseVal.value = bb.height;
	return rect;
}

/* returns a <rect/> element which is an outline of the supplied element nd, and with any attributes provided in the "associative array" supplied as attrs */
function getOutline(nd,attrs) { //attrs: too python? :D
	attrs = ( arguments.length == 1 ? {} : attrs);

	var bbox=getBBoxAsRectElement(nd);

	/* provide styling/identifying hooks (and indeed any other attributes, why not?)  */
	for(var name in attrs) {
		bbox.setAttribute(name,attrs[name]);
	}

	if (typeof(attrs['class']) == "undefined") {
		/* kind of making assumptions here but there should be something that renders by default */
		bbox.setAttribute("fill","none");
		bbox.setAttribute("stroke","black");
		bbox.setAttribute("stroke-width","1");
	}
	// still not sure if the above-type styles (esp fill:none) should be set here and require overriding or allow a blank slate for styling

	return bbox;
}

/* draws an outline of a node after it */
/* this and drawOutlineBefore might have been done as parameters but I don't want to be faffing around with messy optional parameter handling */
function drawOutlineAfter(nd,attrs) {
	attrs = ( arguments.length == 1 ? {} : attrs);
	var outline = getOutline(nd,attrs);
	var nextSiblingNode = nd.nextSibling;
	if (nextSiblingNode) {
		nd.parentNode.insertBefore(outline,nextSiblingNode);  // just in case it matters that this is appended directly after nd
	}
	else {
		nd.parentNode.appendChild(outline);
	}
}

/* draws an outline of a node before it */
function drawOutlineBefore(nd,attrs) {
	attrs = ( arguments.length == 1 ? {} : attrs);
	var outline = getOutline(nd,attrs);
	nd.parentNode.insertBefore(outline,nd);
}

function getCentroid(nd) {
	var bb = nd.getBBox();
	var centroid = document.documentElement.createSVGPoint();
	centroid.x = bb.x + bb.width / 2;
	centroid.y = bb.y + bb.height / 2;
	return centroid;
}

/* hey, how about some javascript to overlay gridlines for dev/debugging ?? */
function drawGrid(nd,interval) { // class, labels
	var bb = nd.getBBox();
	/* warp */
	for (var xi = bb.x + interval; xi < bb.x + bb.width; xi += interval) {
		var gridline = document.createElementNS(svgns, "line"); //CHECKME: still looking for an SVG DOM method to do this and set attributes more compactly
		gridline.setAttribute("x1",xi);
		gridline.setAttribute("y1",bb.y);
		gridline.setAttribute("x2",xi);
		gridline.setAttribute("y2",bb.y + bb.height);
		gridline.setAttribute("class","grid debug x");
		nd.appendChild(gridline); // hmm, never append to another node like the parent??

		/* label */
		//FIXME - pretty crude values and result
		addTextElement(
			nd.parentNode, // is it always going to be outside the target object?
			Math.round(xi),
			{
				'x':xi-4, //FIXME: unhardcode
				'y':bb.y-5, //FIXME: unhardcode
				'class':'grid debug x'
			}
		);
	}

	/* weft */
	for (var yi = bb.y + interval; yi < bb.y + bb.height; yi += interval) {
		var gridline = document.createElementNS(svgns, "line");
		gridline.setAttribute("x1",bb.x);
		gridline.setAttribute("y1",yi);
		gridline.setAttribute("x2",bb.x + bb.width);
		gridline.setAttribute("y2",yi);
		gridline.setAttribute("class","grid debug y");
		nd.appendChild(gridline);

		/* label - comments and FIXME as above */
		addTextElement(nd.parentNode,Math.round(yi),{'x':bb.x-10,'y':yi+2,'class':'grid debug y'});
	}
}

/* convenience function to add a text node to a node, might save a few lines here and there ... */
function addTextElement(nd,text,attrs) {
	attrs = ( arguments.length == 2 ? {} : attrs);
	var textElement = document.createElementNS(svgns, "text");
	for(var name in attrs) {
		textElement.setAttribute(name,attrs[name]);
	}
	var textNode = document.createTextNode(String(text));
	textElement.appendChild(textNode);
	nd.appendChild(textElement);
}

function randomColour() { /* a near copy of Color() provided by David Dailey in course material */
	var R=parseInt(Math.random()*255);
	var G=parseInt(Math.random()*255);
	var B=parseInt(Math.random()*255);
	return "rgb("+R+","+G+","+B+")";
}
