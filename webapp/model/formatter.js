sap.ui.define([], function () {
	"use strict";
	 
	return {
		
		Statuscolor : function (Status) {  
			try {   
			if (Status === "G") {   
				 return ("green");   
			} else if (Status === "R"){   
				return "red";   
			}  
			} catch (err) {        
				return "None";      
			}  } 
			
	};
}); 