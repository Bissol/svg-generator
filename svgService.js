svggenApp.factory("svgService", ['paramService', 'idService', function(paramService, idService) {
        // Private variables
        this.width = 600;
        this.height = 600;
        this.functions = [[],[],[],[],[],[]];
        this.startDepth = 4;
        
        var that = this;
        this.svgns = "http://www.w3.org/2000/svg";
        this.xlinkns = "http://www.w3.org/1999/xlink";
 
        // SVG size
        setWidth = function(w)
        {
        	this.width = w;
        };
        
        setHeight = function(h)
        {
        	this.height = h;
        };
        
        function makeSVG(tag, params, attrs)
		{
			var el= document.createElementNS(that.svgns, tag);
			for (var k in params)
				el.setAttribute(k, params[k]);
			for (k in attrs)
				el.setAttribute(k, attrs[k]);
			return el;
		}
		
		// Usage: addFunc(f, [0,1,1,0,2]) f will be available at depth 1,2, 4 but not 0 or 3.
		function addfunc(f, depthArray)
		{
			// i is depth, depthArray[i] is weight, functions[i] is arr containg fct to call at depth i
			for (var i=0; i<depthArray.length; i++)
			{
				if(typeof that.functions[i] === 'undefined')
				{
				    // does not exist
				    that.functions[i] = [];
				}
				
				for (var j=0; j<depthArray[i]; j++)
				{
					that.functions[i].push(f);
				}
			}
		}
		
		function getfunc(depth)
		{
			if(typeof that.functions[depth] === 'undefined')
			{
				console.error("No function found at depth" + depth);
				depth = 0;
			}
			
			if (paramService.dnaConsumed())
			{
				console.error("Not enough DNA @ depth " + depth);
				depth = 0;
			}
			var i = paramService.requestNewParameter(that.functions[depth].length, 1, true);
			return that.functions[depth][i];
			/*if (depth === 1 || paramService.dnaConsumed() || isNaN(depth))
			{
				var i = paramService.requestNewParameter(that.leafFunctions.length, 1);
				return that.leafFunctions[i];
			}
			else
			{
				var ii = paramService.requestNewParameter(that.nodeFunctions.length, 1);
				return that.nodeFunctions[ii];
			}*/
		}
		
		// ===================================================================================
		// ===================================================================================
		
		var changeColor = function(target, anchor, size, funcs, params, depth)
		{
			console.log("changeColor (depth:" + depth + ", size: " + size + ")");
			var color = "hsl(" + paramService.requestNewParameter(360, 40) + ", " + (40 + paramService.requestNewParameter(60,20)) + "%, " + (50 + paramService.requestNewParameter(50, 20)) + "%)";
			params.fill = color;
			var f = getfunc(depth);
			f(target, anchor, size, funcs, params, depth);
		};
		addfunc(changeColor, [0,1,1]);
		
		var fillPattern = function(target, anchor, size, funcs, params, depth)
		{
			console.log("fillPattern (depth:" + depth + ", size: " + size + ")");
			var defs = document.createElementNS(that.svgns, 'defs');
			var pattern = document.createElementNS(that.svgns, 'pattern');
			var id = idService.getId();
			pattern.setAttribute("id", id);
			pattern.setAttribute("patternUnits", "userSpaceOnUse");
			pattern.setAttribute("x", 0);
			pattern.setAttribute("y", 0);
			var patsize = size / (1 + paramService.requestNewParameter(7, 1));
			pattern.setAttribute("width", patsize);
			pattern.setAttribute("height", patsize);
			var fpat = getfunc(2);
			fpat(pattern, {x:patsize/2,y:patsize/2}, patsize, funcs, params, 2);
			defs.appendChild(pattern);
			target.appendChild(defs);
			
			var f = getfunc(depth);
			params.fill = "url(#"+id+")";
			f(target, anchor, size, funcs, params, depth-1);
		};
		addfunc(fillPattern, [0,1]);
		
		var linearGradient = function(target, anchor, size, funcs, params, depth)
		{
			console.log("linearGradient (depth:" + depth + ", size: " + size + ")");
			
			var defs = document.createElementNS(that.svgns, 'defs');
			var grad = document.createElementNS(that.svgns, 'linearGradient');
			var id = idService.getId();
			grad.setAttribute("id", id);
			grad.setAttribute("x1", paramService.requestNewParameter(100, 20) + "%");
			grad.setAttribute("x2", paramService.requestNewParameter(100, 20) + "%");
			grad.setAttribute("y1", paramService.requestNewParameter(100, 20) + "%");
			grad.setAttribute("y2", paramService.requestNewParameter(100, 20) + "%");
			
			var st1 = document.createElementNS(that.svgns, 'stop');
			st1.setAttribute("offset", "0%");
			var color = "hsl(" + paramService.requestNewParameter(360, 40) + ", " + (50 + paramService.requestNewParameter(50,20)) + "%, " + (50 + paramService.requestNewParameter(50, 20)) + "%)";
			st1.setAttribute("style", "stop-color:"+ color + ";stop-opacity:1");
			grad.appendChild(st1);
			
			var st2 = document.createElementNS(that.svgns, 'stop');
			st2.setAttribute("offset", "100%");
			color = "hsl(" + paramService.requestNewParameter(360, 40) + ", " + (50 + paramService.requestNewParameter(50,20)) + "%, " + (50 + paramService.requestNewParameter(50, 20)) + "%)";
			st2.setAttribute("style", "stop-color:"+ color + ";stop-opacity:1");
			grad.appendChild(st2);
			
			defs.appendChild(grad);
			target.appendChild(defs);
			
			params.fill = "url(#"+id+")";
			var f = getfunc(depth);
			f(target, anchor, size, funcs, params, depth);
		};
		addfunc(linearGradient, [0,2,1]);
		
		var changeStroke = function(target, anchor, size, funcs, params, depth)
		{
			console.log("changeStroke (depth:" + depth + ", size: " + size + ")");
			var color = "hsl(" + paramService.requestNewParameter(360, 40) + ", " + (50 + paramService.requestNewParameter(50,20)) + "%, " + (50 + paramService.requestNewParameter(50, 20)) + "%)";
			params.stroke = color;
			params['stroke-width'] = paramService.requestNewParameter(size/5, 1) + "px";
			params['stroke-dasharray'] = paramService.requestNewParameter(size/10, 1) + "," + paramService.requestNewParameter(size/20, 1);
			var f = getfunc(depth);
			f(target, anchor, size, funcs, params, depth);
		};
		addfunc(changeStroke, [0,1,2]);
		
		var asym2 = function(target, anchor, size, funcs, params, depth)
		{
			console.log("asym2 (depth:" + depth + ", size: " + size + ")");
			var f1 = getfunc(depth), f2 = getfunc(depth);
			var divider = 1.5 + paramService.requestNewParameter(2, 1);
			f1(target, {x:anchor.x - size*0.4, y:anchor.y}, size / divider, funcs, params, depth-1);
			f2(target, {x:anchor.x + size*0.4, y:anchor.y}, size / divider, funcs, params, depth-1);
		};
		addfunc(asym2, [0,1,1]);
		
		var sym2 = function(target, anchor, size, funcs, params, depth)
		{
			console.log("sym2 (depth:" + depth + ", size: " + size + ")");
			var defs = document.createElementNS(that.svgns, 'defs');
			var g = document.createElementNS(that.svgns, 'g');
			var id = idService.getId();
			g.setAttribute("id", id);
			var f = getfunc(depth);
			f(g, anchor, size/2, funcs, params, depth-1);
			defs.appendChild(g);
			target.appendChild(defs);
			
			var u1 = document.createElementNS(that.svgns, 'use');
			u1.setAttributeNS(that.xlinkns, "href", "#" + id);
			u1.setAttribute("x", -size/4);
			u1.setAttribute("y", 0);
			u1.setAttribute("transform", "scale(-1,1) translate(-"+(2*anchor.x)+", 0)");
			target.appendChild(u1);
			
			var u2 = document.createElementNS(that.svgns, 'use');
			u2.setAttributeNS(that.xlinkns, "href", "#" + id);
			u2.setAttribute("x", -size/4);
			u2.setAttribute("y", 0);
			target.appendChild(u2);
		};
		addfunc(sym2, [0,0,2,1]);
		
		var sym2v = function(target, anchor, size, funcs, params, depth)
		{
			console.log("sym2v (depth:" + depth + ", size: " + size + ")");
			var defs = document.createElementNS(that.svgns, 'defs');
			var g = document.createElementNS(that.svgns, 'g');
			var id = idService.getId();
			g.setAttribute("id", id);
			var f = getfunc(depth);
			f(g, anchor, size/2, funcs, params, depth-1);
			defs.appendChild(g);
			target.appendChild(defs);
			
			var u1 = document.createElementNS(that.svgns, 'use');
			u1.setAttributeNS(that.xlinkns, "href", "#" + id);
			u1.setAttribute("x", 0);
			u1.setAttribute("y", -size/4);
			u1.setAttribute("transform", "scale(1,-1) translate(0, -"+(2*anchor.x)+")");
			target.appendChild(u1);
			
			var u2 = document.createElementNS(that.svgns, 'use');
			u2.setAttributeNS(that.xlinkns, "href", "#" + id);
			u2.setAttribute("x", 0);
			u2.setAttribute("y", -size/4);
			target.appendChild(u2);
		};
		//this.nodeFunctions.push(sym2);
		addfunc(sym2v, [0,0,1,2]);
		
		var superimpose = function(target, anchor, size, funcs, params, depth)
		{
			console.log("superimpose (depth:" + ", size: " + size + depth + ")");
			var f1 = getfunc(depth), f2 = getfunc(depth);
			var divider = 1 + paramService.requestNewParameter(2, 1);
			params.opacity = "0.3";
			f1(target, {x:anchor.x, y:anchor.y}, size, funcs, params, depth-1);
			params.opacity = "1";
			f2(target, {x:anchor.x, y:anchor.y}, size / divider, funcs, params, depth-1);
		};
		addfunc(superimpose, [0,1,1]);

		var flower = function(target, anchor, size, funcs, params, depth)
		{
			console.log("flower (depth:" + depth + ", size: " + size + ")");
			var defs = document.createElementNS(that.svgns, 'defs');
			var g = document.createElementNS(that.svgns, 'g');
			var id = idService.getId();
			g.setAttribute("id", id);
			var f = getfunc(depth);
			var d = 1.2 + paramService.requestNewParameter(3, 1);
			var f1 = getfunc(1);
			params.opacity = "0.4";
			f1(g, anchor, size/d, funcs, params, 0);
			params.opacity = "1";
			f(g, anchor, size/d, funcs, params, depth-1);
			defs.appendChild(g);
			target.appendChild(defs);
			
			var dist = paramService.requestNewParameter(size/2, 5);
			var incr = 12 + paramService.requestNewParameter(100, 12);
			var spiralize = paramService.requestNewParameter(2,1);
			for (var angle=0; angle<360; angle+= incr)
			{
				var u1 = document.createElementNS(that.svgns, 'use');
				u1.setAttributeNS(that.xlinkns, "href", "#" + id);
				u1.setAttribute("x", 0);
				u1.setAttribute("y", 0);
				if (spiralize === 1) dist*=0.75;
				u1.setAttribute("transform", "rotate(" + angle + "," + anchor.x +"," + anchor.y + ") translate("+dist+"," + dist + ")");
				target.appendChild(u1);
			}
		};
		//this.nodeFunctions.push(flower);
		addfunc(flower, [0,0,1,2,3,1,1]);
		
		var split4square = function(target, anchor, size, funcs, params, depth)
		{
			console.log("split4square (depth:" + depth + ", size: " + size + ")");
			var defs = document.createElementNS(that.svgns, 'defs');
			var g = document.createElementNS(that.svgns, 'g');
			var id = idService.getId();
			g.setAttribute("id", id);
			var f = getfunc(depth);
			
			var sq = 2 + paramService.requestNewParameter(3,1);
			var sqsize = size / sq;
			f(g, {x:anchor.x - size/2 + sqsize/2,y:anchor.y - size/2 + sqsize/2}, sqsize, funcs, params, depth-1);
			defs.appendChild(g);
			target.appendChild(defs);
			
			
			for (var i=0; i<sq;i++)
			{
				for (var j=0; j<sq;j++)
				{
					var u = document.createElementNS(that.svgns, 'use');
					u.setAttributeNS(that.xlinkns, "href", "#" + id);
					u.setAttribute("x", i * sqsize);
					u.setAttribute("y", j * sqsize);
					u.setAttribute("transform", "rotate(" + ((i+j)*360/sq) + "," + (i * sqsize + sqsize/2) +"," + (j * sqsize + sqsize/2) + ")");
					target.appendChild(u);
				}
			}
		};
		//this.nodeFunctions.push(split4square);
		addfunc(split4square, [0,1,1,2,2,1]);
		
        var LEAF_circle = function(target, anchor, size, funcs, params, depth)
		{
			console.log("LEAF_circle (depth:" + depth + ", size: " + size + ")");
			var nsize = size * 0.6 + paramService.requestNewParameter(size*0.6, 2);
			var circle= makeSVG('circle', params, {cx: anchor.x, cy: anchor.y, r:nsize});
			target.appendChild(circle);
		};
		//this.leafFunctions.push(LEAF_circle);
		addfunc(LEAF_circle, [1]);
		
		var LEAF_ellipse = function(target, anchor, size, funcs, params, depth)
		{
			console.log("LEAF_ellipse (depth:" + depth + ", size: " + size + ")");
			var rx = size * 0.6 + paramService.requestNewParameter(size*0.6, 2);
			var ry = size * 0.6 + paramService.requestNewParameter(size*0.6, 2);
			var el= makeSVG('ellipse', params, {cx: anchor.x, cy: anchor.y, rx:rx, ry:ry});
			target.appendChild(el);
		};
		//this.leafFunctions.push(LEAF_circle);
		addfunc(LEAF_ellipse, [1]);
		
		var LEAF_rect = function(target, anchor, size, funcs, params, depth)
		{
			console.log("LEAF_rect (depth:" + depth + ", size: " + size + ")");
			var rect= makeSVG('rect', params, {x: anchor.x, y: anchor.y, width:size, height:size});
			target.appendChild(rect);
		};
		//this.leafFunctions.push(LEAF_rect);
		addfunc(LEAF_rect, [1]);
		
		var LEAF_ClosedShape = function(target, anchor, size, funcs, params, depth)
		{
			console.log("LEAF_ClosedShape (depth:" + depth + ", size: " + size + ")");
			var nbPts = 4 + paramService.requestNewParameter(5, 1);
			var d = "M";
			var x0 = anchor.x + (size/2 - paramService.requestNewParameter(size, 20));
			var y0 = anchor.y + (size/2 - paramService.requestNewParameter(size, 20));
			d+= x0 + " " + y0;
			
			for (var i=0; i<nbPts; i++)
			{
				var x = size/2 - paramService.requestNewParameter(size, 10);
				var y = size/2 - paramService.requestNewParameter(size, 10);
				d+= " l" + x + " " + y;
			}
			d+= " z";
			var path= makeSVG('path', params, {d: d});
			target.appendChild(path);
		};
		//this.leafFunctions.push(LEAF_ClosedShape);
		addfunc(LEAF_ClosedShape, [1]);
		
		var LEAF_ClosedBezier = function(target, anchor, size, funcs, params, depth)
		{
			console.log("LEAF_ClosedBezier (depth:" + depth + ", size: " + size + ")");
			var nbPts = 4 + paramService.requestNewParameter(5, 1);
			var d = "M";
			var base = size*2;
			var x0 = anchor.x + (base/2 - paramService.requestNewParameter(base, 20));
			var y0 = anchor.y + (base/2 - paramService.requestNewParameter(base, 20));
			d+= x0 + " " + y0;
			
			for (var i=0; i<nbPts; i++)
			{
				var x = base/2 - paramService.requestNewParameter(base, 10);
				var y = base/2 - paramService.requestNewParameter(base, 10);
				var xb = base/2 - paramService.requestNewParameter(base, 10);
				var yb = base/2 - paramService.requestNewParameter(base, 10);
				d+= " q" + x + " " + y + " " + xb + " " + yb;
			}
			d+= " z";
			var path= makeSVG('path', params, {d: d});
			target.appendChild(path);
		};
		//this.leafFunctions.push(LEAF_ClosedBezier);
		addfunc(LEAF_ClosedBezier, [1]);

        generateSvg = function(initialDepth)
        {
        	console.log ("--- Starting generation --- ");
        	paramService.requestNewParameter(64,1);
        	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svg.setAttribute("width", "100%");
			svg.setAttribute("height", "100%");
			svg.setAttribute("viewBox", "0 0  "+this.width+" "+this.height);
			var rect= makeSVG('rect', [], {x: 0, y: 0, width:this.width, height:this.height, 'stroke':'black', 'stroke-width': 1, 'fill' : 'transparent'});
			svg.appendChild(rect);
			
			var color = "hsl(" + paramService.requestNewParameter(360, 20) + ", 100%, 50%)";
			var f = getfunc(initialDepth);
        	f(svg, {x:this.width/2, y:this.height/2}, this.width, null, {fill: color}, initialDepth);
        	//fillPattern(svg, {x:this.width/2, y:this.height/2}, this.width * 0.8, null, {fill: color}, 0);
        	return svg;
        };
        
        // Service API
        return {
        	setWidth: setWidth,
        	setHeight: setHeight,
        	generateSvg: generateSvg,
        };
    }]
);