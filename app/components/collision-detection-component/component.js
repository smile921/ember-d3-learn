import Component from '@ember/component';

import d3select from 'd3-selection';
import d3scale from 'd3-scale';
import d3format from 'd3-format';
import d3hierarchy from 'd3-hierarchy';
import d3geo from 'd3-geo';   
import d3interpolate from 'd3-interpolate';
import d3transition from 'd3-transition';
import d3shape from 'd3-shape';
import d3request from 'd3-request';
import d3dsv from 'd3-dsv';
import d3collection from 'd3-collection';
import d3array from 'd3-array';
import d3force from 'd3-force';
import d3quadtree from 'd3-quadtree';

export default Component.extend({
	data:null,
	didReceiveAttrs(){
		this.drawSvg();
	},
	drawSvg(){
		var width = 960,
		    height = 500;

		var nodes = d3array.range(200).map(function() { return {radius: Math.random() * 12 + 4}; }),
		    root = nodes[0];
		    // color = d3scale.scale.category10();
		let color = d3scale.scaleOrdinal(d3scale.schemeCategory20c);

		root.radius = 0;
		root.fixed = true;
		debugger
		var force = d3force.forceSimulation(nodes);
		    // .gravity(0.05)
		    // .charge(function(d, i) { return i ? 0 : -2000; });
		    // .nodes(nodes)
		    // .size([width, height]);
		force = force.force('charge',d3force.forceManyBody());		
		force.force("center", d3force.forceCenter());
		force.force(0.05);
		// force.start();

		var svg = d3select.select("body").append("svg")
		    .attr("width", width)
		    .attr("height", height);

		svg.selectAll("circle")
		    .data(nodes.slice(1))
		  .enter().append("circle")
		    .attr("r", function(d) { return d.radius; })
		    .style("fill", function(d, i) { return color(i % 3); });

		force.on("tick", function(e) {
		  var q = d3quadtree.quadtree(nodes),
		      i = 0,
		      n = nodes.length;

		  while (++i < n) q.visit(collide(nodes[i]));

		  svg.selectAll("circle")
		      .attr("cx", function(d) { return d.x; })
		      .attr("cy", function(d) { return d.y; });
		});

		svg.on("mousemove", function() {
		  var p1 = d3select.mouse(this);
		  root.px = p1[0];
		  root.py = p1[1];
		  debugger
		  d3force.forceCenter(root);
		  // d3force.forceCollide( function(d, i) { 
		  // 	return i ? 0 : -2000;  
		  // });
		  force.restart();
		});

		function collide(node) {
		  var r = node.radius + 16,
		      nx1 = node.x - r,
		      nx2 = node.x + r,
		      ny1 = node.y - r,
		      ny2 = node.y + r;
		  return function(quad, x1, y1, x2, y2) {
		    if (quad.point && (quad.point !== node)) {
		      var x = node.x - quad.point.x,
		          y = node.y - quad.point.y,
		          l = Math.sqrt(x * x + y * y),
		          r = node.radius + quad.point.radius;
		      if (l < r) {
		        l = (l - r) / l * .5;
		        node.x -= x *= l;
		        node.y -= y *= l;
		        quad.point.x += x;
		        quad.point.y += y;
		      }
		    }
		    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
		  };
		}
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