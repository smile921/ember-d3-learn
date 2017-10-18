import Component from '@ember/component';
import d3select from 'd3-selection';
import d3format from 'd3-format';
import d3scale from 'd3-scale';
import d3hierarchy from 'd3-hierarchy';

export default Component.extend({
	color:null,
	pack:null,
	data:[],
	svg:null,
	didReceiveAttrs(){

		let svg = d3select.select("svg");
		Ember.set(this,'svg',svg);
    	let width =   svg.attr("width");//SVG绘制区域的宽度
    	let height =   svg.attr("height");//SVG绘制区域的高度

    	let format = d3format.format(",d");

		let color = d3scale.scaleOrdinal(d3scale.schemeCategory20c);
		Ember.set(this,'color',color);
		// debugger
		let pack = d3hierarchy.pack()
		    .size([width, height]) 	    	 
		    .padding(2);
		Ember.set(this,'pack',pack);
		let data = Ember.get(this,'data');
		// debugger
		let drawPack = this.drawPack;
		let convertData = this.convertData;
		data.get(function(error,data) {
			if(error){
				console.log(error)
				return ;
			}
			// debugger
			// convertData(data);
			drawPack(data,pack,svg,color,format);
		});
	 
	},
	convertData(data){

		let res = {}; 
		for(let it of data){			
			let index = it.area.split(";");
			// debugger
			if(index.length == 1){
				res.name = it.area; 
				res.children = [];
				res.size = it.size;
			}else if(index.length == 2){
				let ti = {};
				ti.name =index[1];
				ti.children = [];
				ti.size = it.size;
				res.children.push(ti);
			}else if(index.length == 3){
				let ti = {};
				ti.name =index[2];
				ti.children = [];
				ti.size = it.size; 

				let pushChild2target =function pushChild2target( target,obj,name){
					target.forEach(function(el,index,target){
						if(el.name == name){
							target[index].children.push(obj);
							target[index].size += obj.size;
							// debugger
						}
					});
				};
				pushChild2target(res.children,ti,index[1]);
				// debugger
			}
		}
		debugger
		
	},
	drawPack(data,pack,svg,color,format){
		 
		// debugger
		//let nodes = pack.nodes(data);
		
		let root = d3hierarchy.hierarchy({children: data})
	      .sum(function(d) {
	      	// debugger 
	      	return d.size; 
	      })
	      .each(function(d) {
	      	// debugger
		       if (id = d.data.area) {
		          var id, i = id.lastIndexOf(";");
		          d.id = id;
		          d.package = id.slice(0, i);
		          d.class = id.slice(i + 1);
		        }
	      }); 
		  let node = svg.selectAll(".bubble")
		    .data(pack(root).leaves())
		    .enter().append("g")
		      .attr("class", "bubble")
		      .attr("transform", function(d) { 
		      	return "translate(" + d.x + "," + d.y + ")"; 
		      });

		  node.append("circle")
	      .attr("id", function(d) { return d.id; })
	      .attr("r", function(d) { return d.r; })
	      .style("fill", function(d) { return color(d.package); });

		  node.append("clipPath")
		      .attr("id", function(d) { return "clip-" + d.id; }) ;

		  node.append("text")  
		  	.text(function(d) { 
				// debugger
				return d.class+ "\n" + format(d.value); })
			// .selectAll("tspan")
			// .data(function(d) { 
			// 	// debugger
			// 	return [d.class]; })
			// .enter() 
			// .text(function(d) { 
			// 	// debugger
			// 	return d; });

		  node.append("title")
		      .text(function(d) { return d.id + "\n" + format(d.value); });

			  
	 
	}

});

 // "d3-array": "1.0.2",
  // "d3-axis": "1.0.4",
  // "d3-brush": "1.0.3",
  // "d3-chord": "1.0.3",
  // "d3-collection": "1.0.2",
  // "d3-color": "1.0.2",
  // "d3-dispatch": "1.0.2",
  // "d3-drag": "1.0.2",
  // "d3-dsv": "1.0.3",
  // "d3-ease": "1.0.2",
  // "d3-force": "1.0.4",
  // "d3-format": "1.0.2",
  // "d3-geo": "1.4.0",
  // "d3-hierarchy": "1.0.3",
  // "d3-interpolate": "1.1.2",
  // "d3-path": "1.0.3",
  // "d3-polygon": "1.0.2",
  // "d3-quadtree": "1.0.2",
  // "d3-queue": "3.0.3",
  // "d3-random": "1.0.2",
  // "d3-request": "1.0.3",
  // "d3-scale": "1.0.4",
  // "d3-selection": "1.0.3",
  // "d3-shape": "1.0.4",
  // "d3-time": "1.0.4",
  // "d3-time-format": "2.0.3",
  // "d3-timer": "1.0.3",
  // "d3-transition": "1.0.3",
  // "d3-voronoi": "1.1.0",
  // "d3-zoom": "1.1.0"