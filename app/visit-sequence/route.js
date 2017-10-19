import Route from '@ember/routing/route';
import d3request from 'd3-request';
import d3csv from 'd3-dsv';
export default Route.extend({
	model(){
		let data = {};
		let version = { 
		};		 
		let url =  'assets/data/visit-sequences.csv' ;
		let csv = d3request.request(url)
    		.mimeType("text/csv")
    		.response(function(xhr) { 

    			return d3csv.csvParse(xhr.responseText, function(d) {
    				  // debugger 
					  return d;
				}); 
    		});
    	data.data = csv;
		// debugger;
		data.version= version;
		return data;
	} 
});
