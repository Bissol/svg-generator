svggenApp.factory("paramService", function() {
        // Private variables
        var dnaString = "";
        var binString = "";
        this.finishAlready = false;
 
 		function char2bin(c)
 		{
 			return c.charCodeAt(0).toString(2);
 		}
 		
 		function str2bin(str)
 		{
 			var res = "";
 			for (var i=0; i<str.length; i++) res += char2bin(str.charAt(i));
 			return res;
 		}
 		
        // Request new parameter
        requestNewParameter = function(range, precision, fromEnd)
        {
        	if (this.binString.length === 0)
        	{
        		alert("No DNA left");
        		this.finishAlready = true;
        		return 1;
        	}
        	var smallRange = range/precision;
        	var nbdigits = (range === 1 || smallRange < 1 ? 1 : Math.ceil(Math.log2(smallRange)));
        	var loss =  Math.pow(2, nbdigits) - (smallRange);
        	if (this.binString.length < nbdigits)
        	{
        		alert("No DNA left");
        		this.finishAlready = true;
        		return 1;
        	}
        	
        	var parStr;
        	if (fromEnd)
        	{
        		parStr = this.binString.substring(this.binString.length - nbdigits);
        		this.binString = this.binString.substring(0, this.binString.length - nbdigits);
        	}
        	else
        	{
        		parStr = this.binString.substring(0, nbdigits);
        		this.binString = this.binString.substring(nbdigits);
        	}
        	
        	var parInt = Math.floor(parseInt(parStr,2) * (smallRange / (smallRange + loss)));
        	
        	parInt = parInt * precision;
        	if (isNaN(parInt)) parInt = 1;
        	//console.log(nbdigits + " digits consumed " + this.binString);
        	
        	return parInt;
        };
        
        setDna = function(dna)
        {
        	this.dnaString = dna;
        	this.binString = str2bin(dna);
        	this.finishAlready = false;
        };
        
        dnaConsumed = function(dna)
        {
        	return this.finishAlready;
        };
        
        getDna = function()
        {
        	return this.dnaString;
        };
        
        mutate = function()
        {
        	var index = Math.floor(Math.random()*this.binString.length);
        	var c = this.binString.charAt(index);
        	c = c === '0' ? '1' : '0';
        	this.binString = this.binString.substr(0, index) + c + this.binString.substr(index+1);
        };
        
        // Service API
        return {
        	requestNewParameter: requestNewParameter,
        	setDna: setDna,
        	getDna: getDna,
        	mutate: mutate,
        	dnaConsumed : dnaConsumed,
        };
    }
);