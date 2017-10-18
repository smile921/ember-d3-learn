import Component from '@ember/component';
import d3select from 'd3-selection';
import d3format from 'd3-format';
import d3scale from 'd3-scale';
import d3hierarchy from 'd3-hierarchy';
import d3interpolate from 'd3-interpolate';
import d3transition from 'd3-transition';

export default Component.extend({
	color:null,
	pack:null,
	data:[],
	svg:null,
	didReceiveAttrs(){
		let data = Ember.get(this,'data'); 
		let convertData = this.convertData;
		let drawPack = this.drawPack;
		data.get(function(error,data) {
			if(error){
				console.log(error);
				return ;
			} 
			// data = data.children;
			// debugger
			drawPack(data);
		});
	 
	},	
	drawPack(data){
		
		let svg = d3select.select("svg"); 
    	let width =   svg.attr("width");//SVG绘制区域的宽度
    	let height =   svg.attr("height");//SVG绘制区域的高度

    	let format = d3format.format(",d"); 
 
		let   margin = 20;
		let   diameter = +svg.attr("width");
		let   g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

		let color = d3scale.scaleLinear()
		    .domain([-1, 5])
		    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
		    .interpolate(d3interpolate.interpolateHcl);

		let pack = d3hierarchy.pack()
		    .size([diameter - margin, diameter - margin])
		    .padding(2);
 
		let root = d3hierarchy.hierarchy(data)
		      .sum(function(d) { return d.size; })
		      .sort(function(a, b) { return b.value - a.value; });

		let focus = root,
		      nodes = pack(root).descendants(),
		      view;

		let circle = g.selectAll("circle")
		    .data(nodes)
		    .enter().append("circle")
		      .attr("class", function(d) { 
		      	return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; 
		      })
		      .style("fill", function(d) { 
		      	return d.children ? color(d.depth) : null; 
		      })
		      .on("click", function(d) { if (focus !== d) zoom(d), d3select.event.stopPropagation(); });

		let text = g.selectAll("text")
		    .data(nodes)
		    .enter().append("text")
		      .attr("class", "label")
		      .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
		      .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
		      .text(function(d) { return d.data.name+'\n' +format(d.data.size)+'家'; });

		  var node = g.selectAll("circle,text");

		  svg
		      .style("background", color(-1))
		      .on("click", function() { zoom(root); });

		  zoomTo([root.x, root.y, root.r * 2 + margin]);

		  function zoom(d) {
		    var focus0 = focus; focus = d;

		    var transition = d3transition.transition()
		        .duration(d3select.event.altKey ? 7500 : 750)
		        .tween("zoom", function(d) {
		          var i = d3interpolate.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
		          return function(t) { zoomTo(i(t)); };
		        });

		    transition.selectAll("text")
		      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
		        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
		        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
		        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
		  }

		  function zoomTo(v) {
		    var k = diameter / v[2]; view = v;
		    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
		    circle.attr("r", function(d) { return d.r * k; });
		  }
	 
	 
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
							// debugger
						}
					});
				};
				pushChild2target(res.children,ti,index[1]);
				// debugger
			}
		}
		// debugger
		
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