import Route from '@ember/routing/route';
import d3request from 'd3-request';
import d3csv from 'd3-dsv';
export default Route.extend({
	model(){
		let data = {};
		let version = {
		  "d3-array": "1.0.2",
		  "d3-axis": "1.0.4",
		  "d3-brush": "1.0.3",
		  "d3-chord": "1.0.3",
		  "d3-collection": "1.0.2",
		  "d3-color": "1.0.2",
		  "d3-dispatch": "1.0.2",
		  "d3-drag": "1.0.2",
		  "d3-dsv": "1.0.3",
		  "d3-ease": "1.0.2",
		  "d3-force": "1.0.4",
		  "d3-format": "1.0.2",
		  "d3-geo": "1.4.0",
		  "d3-hierarchy": "1.0.3",
		  "d3-interpolate": "1.1.2",
		  "d3-path": "1.0.3",
		  "d3-polygon": "1.0.2",
		  "d3-quadtree": "1.0.2",
		  "d3-queue": "3.0.3",
		  "d3-random": "1.0.2",
		  "d3-request": "1.0.3",
		  "d3-scale": "1.0.4",
		  "d3-selection": "1.0.3",
		  "d3-shape": "1.0.4",
		  "d3-time": "1.0.4",
		  "d3-time-format": "2.0.3",
		  "d3-timer": "1.0.3",
		  "d3-transition": "1.0.3",
		  "d3-voronoi": "1.1.0",
		  "d3-zoom": "1.1.0"
		};
		data.data= [];
		let url =  'assets/data/treemap.csv' ;
		let csv = d3request.request(url)
    		.mimeType("text/csv")
    		.response(function(xhr) { 

    			return d3csv.csvParse(xhr.responseText, function(d) {
    				  // debugger
					  d.size = +d.size;//   没数据的自动补 0对齐
					  return d;
				}); 
    		});
    	data.data[0] = csv;
		// debugger;
		data.version= version;
		return data;
	},
	csvPost: function(d) {
		  d.size = +d.size;
		  return d;
	}
});
