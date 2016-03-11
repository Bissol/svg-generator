function makeSVG(tag, params, attrs)
{
	var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (var k in params)
		el.setAttribute(k, params[k]);
	for (k in attrs)
		el.setAttribute(k, attrs[k]);
	return el;
}
function go()
{
	t = document.getElementById('svg');
	sym4(t, {x:0, y:0, w:500, h:500}, {x:250, y:250}, [triangle,LEAF_rect], {stroke:'red', fill:'orange'}, 1);
}

function triangle(target, area, anchor, funcs, params, depth)
{
	console.log("triangle (depth:" + depth + "):");
	if (!funcs) alert();
	var funcsCopy = funcs.slice();
	var f = funcsCopy.shift();
	var narea, nanchor;
	
	if (!params) params = {};
	params.transform = "rotate(45, "+anchor.x+", "+anchor.y +"), translate(" + (area.w*0.4) + ",0),scale(0.3)";
	f(target, area, anchor, funcsCopy, params, depth+1);
	params.transform = "rotate(165, "+anchor.x+", "+anchor.y +"), translate(" + (area.w*0.4) + ",0),scale(0.3)";
	f(target, area, anchor, funcsCopy, params, depth+1);
	params.transform = "rotate(285, "+anchor.x+", "+anchor.y +"), translate(" + (area.w*0.4) + ",0),scale(0.3)";
	f(target, area, anchor, funcsCopy, params, depth+1);
}

function sym4(target, area, anchor, funcs, params, depth)
{
	console.log("sym4 (depth:" + depth + "):");
	
	
	if (!funcs) alert();
	var funcsCopy = funcs.slice();
	var f = funcsCopy.shift();
	var narea, nanchor;
	narea = {x:area.x, y:area.y, w:area.w / 2, h:area.h / 2};
	nanchor = {x: area.x + area.w/4, y: area.y + area.h/4};
	f(target, narea, nanchor, funcsCopy, params, depth+1);
	
	narea = {x:area.x + 0.5*area.w, y:area.y, w:0.5*area.w, h:0.5*area.h};
	nanchor = {x: area.x + 0.75*area.w, y: area.y + 0.25*area.h};
	f(target, narea, nanchor, funcsCopy, params, depth+1);
	
	narea = {x:area.x, y:area.y + 0.5*area.h, w:0.5*area.w, h:0.5*area.h};
	nanchor = {x: area.x + 0.25*area.w, y: area.y + 0.75*area.h};
	f(target, narea, nanchor, funcsCopy, params, depth+1);
	
	narea = {x:area.x + 0.5*area.w, y:area.y+0.5*area.h, w:0.5*area.w, h:0.5*area.h};
	nanchor = {x: area.x + 0.75*area.w, y: area.y + 0.75*area.h};
	f(target, narea, nanchor, funcsCopy, params, depth+1);
}

function LEAF_circle(target, area, anchor, funcs, params, depth)
{
	console.log("LEAF_circle (depth:" + depth + ") params:");
	console.log(params);
	// We ignore funcs and depth here

	var circle= makeSVG('circle', params, {cx: anchor.x, cy: anchor.y, r:0.95*area.h/2, 'stroke-width': 2});
	target.appendChild(circle);
}

function LEAF_rect(target, area, anchor, funcs, params, depth)
{
	console.log("LEAF_rect (depth:" + depth + ") params:");
	console.log(params);
	// We ignore funcs and depth here

	var rect= makeSVG('rect', params, {x: anchor.x - area.w/2, y: anchor.y - 0.5*area.h, width:0.95*area.h, height:area.h/2, 'stroke-width': 2});
	target.appendChild(rect);
}

function LEAF_ellipse(target, area, anchor, funcs, params, depth)
{
	console.log("LEAF_ellipse (depth:" + depth + ") params:");
	console.log(params);
	// We ignore funcs and depth here

	var ell= makeSVG('ellipse', params, {cx: anchor.x, cy: anchor.y, rx:0.95*area.h/2, ry:0.95*area.h/3, 'stroke-width': 2});
	target.appendChild(ell);
}