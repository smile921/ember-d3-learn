import Route from '@ember/routing/route';
import d3request from 'd3-request';
import d3csv from 'd3-dsv';
export default Route.extend({
	model(){
		let data = {};
		let version = {
		  "d3-array": "1.0.2",
		  "d3-axis": "1.0.4" 		   
		};
		data.data= [];
		let url =  'assets/data/treemap.csv' ;
		let csv = d3request.request(url)
    		.mimeType("text/csv")
    		.response(function(xhr) { 

    			return d3csv.csvParse(xhr.responseText, function(d) {
    				  
					  d.size = +d.size;
					  return d;
				}); 
    		});
    	data.data[0] = csv;
		// debugger;
		data.version= version;
		return data;
	} 
});
