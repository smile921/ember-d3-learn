import Route from '@ember/routing/route';
import d3request from 'd3-request';
import d3csv from 'd3-dsv';

export default Route.extend({
	model(){
		let data ={};
		let url =  'assets/data/list-data.json' ;
		let json = d3request.request(url)
			 	.mimeType("application/json")
	    		.response(function(xhr) { 
	    			return JSON.parse(xhr.responseText); 
	    		});
	    data.data = json;
	    		// debugger
			return data;
		    		 
	}

});
