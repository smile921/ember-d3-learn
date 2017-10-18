import Route from '@ember/routing/route';
import d3request from 'd3-request';
import d3csv from 'd3-dsv';

export default Route.extend({
	model(){
		let data ={};
		let url =  'assets/data/list-count.csv' ;
		let json = d3request.request(url)
		 	.mimeType("text/csv")
    		.response(function(xhr) { 
    			return d3csv.csvParse(xhr.responseText, function(d) {
    				  // debugger
					  d.size = +d.size;//   没数据的自动补 0对齐
					  return d;
    				  });
    		});
    		data.data = json;
    		// debugger
		return data;
	}

});
