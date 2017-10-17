import Component from '@ember/component';
import d3select from 'd3-selection';
import d3scale from 'd3-scale';
import d3format from 'd3-format';
import d3hierarchy from 'd3-hierarchy';
import d3geo from 'd3-geo';
export default Component.extend({
	data:[],
  dversion:{},
	treemap:null,
  svg:null,
  format: null,
  color: null,
	 
	didInsertElement(){
		let svg = d3select.select("svg");
    let width =   svg.attr("width");
    let height =   svg.attr("height");
    Ember.set(this,'svg',svg);
		let color = d3scale.scaleOrdinal(d3scale.schemeCategory20);
    Ember.set(this,'color',color);
		let format = d3format.format(",d");
    Ember.set(this,'format',format);
		let treemap = d3hierarchy.treemap()
		    .size([width, height])
		    .round(true)
		    .padding(1);
		Ember.set(this,'treemap',treemap);
	},
	didReceiveAttrs() {
    // Schedule a call to our `drawCircles` method on Ember's "render" queue, which will
    // happen after the component has been placed in the DOM, and subsequently
    // each time data is changed.
      let data =  Ember.get(this,'data');
        if (!data){
          return;
        }
      let com = this ;
      data[0].get(function(err,data){ 
          // debugger
          Ember.run.scheduleOnce('render', this, com.drawTreeMap(data));
      });
    	
  	},
	drawTreeMap: function(data) {
  		let svg = Ember.get(this,'svg');
       
      // debugger;  //创建一个分层操作
  		let root = d3hierarchy.stratify()
  		.id(function(d) {
  			return d.path; 
  		})
  		.parentId(function(d) { 
  			return d.path.substring(0, d.path.lastIndexOf("/")); 
  		})(data)
  		.sum(function(d) { 
  			return d.size; 
  		})
  		.sort(function(a, b) { 
  			return b.height - a.height || b.value - a.value; 
  		});
  		let treemap = Ember.get(this,'treemap');
  		treemap(root);
      
      let version = Ember.get(this,'dversion');
      console.log(version);
       
  		let cell = svg.selectAll("a")
  			.data(root.leaves())
  		    .enter().append("a")
  		    .attr("target", "_blank")
  		    .attr("xlink:href", function(d) { 
  		    		let p = d.data.path.split("/"); 
          
              return "https://github.com/" 
                    + p.slice(0, 2).join("/") 
                    + "/blob/v" 
                    + version[p[1]] 
                    + "/src/" 
                    + p.slice(2).join("/"); 
  		    	})
  	        .attr("transform", function(d) { 
  	        	return "translate(" + d.x0 + "," + d.y0 + ")"; 
  	        });

        let color = Ember.get(this,'color');
  	    cell.append("rect")
  	          .attr("id", function(d) { 
  	          	return d.id; 
  	          })
  	          .attr("width", function(d) { 
  	          	return d.x1 - d.x0; 
  	          })
      		  .attr("height", function(d) { 
      		  	return d.y1 - d.y0; 
      		  })
      		  .attr("fill", function(d) { 
      		  	let a = d.ancestors();  
      		  	return color(a[a.length - 2].id); 
      		  });

  		cell.append("clipPath")
      		.attr("id", function(d) { 
      			return "clip-" + d.id; 
      		})
    		.append("use")
      		.attr("xlink:href", function(d) { 
      			return "#" + d.id; 
      		});

  		let label = cell.append("text")
      		.attr("clip-path", function(d) { 
      			return "url(#clip-" + d.id + ")"; 
      		});

  		label.append("tspan")
      		.attr("x", 4)
      		.attr("y", 13)
      		.text(function(d) { 
      			return d.data.path.substring(d.data.path.lastIndexOf("/") + 1, d.data.path.lastIndexOf(".")); 
      		});

      let format = Ember.get(this,'format');
  		label.append("tspan")
      		.attr("x", 4)
      		.attr("y", 25)
      		.text(function(d) { 
      			return format(d.value); 
      		});

  		cell.append("title")
      		.text(function(d) { 
      			return d.id + "\n" + format(d.value); 
      		});
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