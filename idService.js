svggenApp.factory("idService", function() {
        // Private variables
        this.curId = 0;
        var that = this;
 		
        // Request new parameter
        getId = function()
        {
        	var id = "id_" + that.curId;
        	that.curId++;
        	return id;
        };
        
        // Service API
        return {
        	getId: getId,
        };
    }
);