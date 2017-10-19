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


export default Component.extend({
	data:null,
	version:null,
	colors:null,
	didReceiveAttrs(){
		let data = Ember.get(this,'data');
		let colors = Ember.get(this,'colors');
		this.drawSvg(colors);
		data.get(function (err,data) {
			//debugger
		});
		//debugger
	},
	drawSvg(colors){
		// Dimensions of sunburst.
		var width = 1024;
		var height = 768;
		var radius = Math.min(width, height) / 2;

		// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
		var b = {
		  w: 75, h: 30, s: 3, t: 10
		};

		// Mapping of step names to colors.
		

		// Total size of all segments; we set this later, after loading the data.
		var totalSize = 0; 

		var vis = d3select.select("#chart").append("svg:svg")
		    .attr("width", width)
		    .attr("height", height)
		    .append("svg:g")
		    .attr("id", "container")
		    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		var partition = d3hierarchy.partition()
		    .size([2 * Math.PI, radius * radius]);

		var arc = d3shape.arc()
		    .startAngle(function(d) { return d.x0; })
		    .endAngle(function(d) { return d.x1; })
		    .innerRadius(function(d) { return Math.sqrt(d.y0); })
		    .outerRadius(function(d) { return Math.sqrt(d.y1); });

		// Use d3.text and d3.csvParseRows so that we do not need to have a header
		// row, and can receive the csv as an array of arrays.
		d3request.text("assets/data/area-visit.csv", function(text) {
			//debugger
		  var csv = d3dsv.csvParseRows(text);
		  var json = buildHierarchy(csv);
		  createVisualization(json,vis);
		});

		// Main function to draw and set up the visualization, once we have the data.
		function createVisualization(json,vis) {

		  // Basic setup of page elements.
		  initializeBreadcrumbTrail();
		  drawLegend();
		  d3select.select("#togglelegend").on("click", toggleLegend);

		  // Bounding circle underneath the sunburst, to make it easier to detect
		  // when the mouse leaves the parent g.
		  vis.append("svg:circle")
		      .attr("r", radius)
		      .style("opacity", 0);

		  // Turn the data into a d3 hierarchy and calculate the sums.
		  var root = d3hierarchy.hierarchy(json)
		      .sum(function(d) { return d.size; })
		      .sort(function(a, b) { return b.value - a.value; });
		  
		  // For efficiency, filter nodes to keep only those large enough to see.
		  var nodes = partition(root).descendants()
		      .filter(function(d) {
		          return (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
		      });
		      // debugger
		  var path = vis.data([json]).selectAll("path")
		      .data(nodes)
		      .enter().append("svg:path")
		      .attr("display", function(d) { 
		      	// debugger
		      	return d.depth ? null : "none"; 
		      })
		      .attr("d", arc)
		      .attr("fill-rule", "evenodd")
		      .style("fill", function(d) { 
		      	return colors[d.data.name]; })
		      .style("opacity", 1)
		      .on("mouseover", mouseover);

		  // Add the mouseleave handler to the bounding circle.
		  d3select.select("#container").on("mouseleave", mouseleave);
		  // debugger
		  // Get total size of the tree = value of root node from partition.
		  totalSize = path.datum().value;
		 };

		// Fade all but the current sequence, and show it in the breadcrumb trail.
		function mouseover(d) {

		  var percentage = (100 * d.value / totalSize).toPrecision(3);
		  var percentageString = percentage + "%";
		  if (percentage < 0.1) {
		    percentageString = "< 0.1%";
		  }

		  d3select.select("#percentage")
		      .text(percentageString);

		  d3select.select("#explanation")
		      .style("visibility", "");

		  var sequenceArray = d.ancestors().reverse();
		  sequenceArray.shift(); // remove root node from the array
		  updateBreadcrumbs(sequenceArray, percentageString);

		  // Fade all the segments.
		  d3select.selectAll("path")
		      .style("opacity", 0.3);

		  // Then highlight only those that are an ancestor of the current segment.
		  vis.selectAll("path")
		      .filter(function(node) {
		                return (sequenceArray.indexOf(node) >= 0);
		              })
		      .style("opacity", 1);
		}

		// Restore everything to full opacity when moving off the visualization.
		function mouseleave(d) {

		  // Hide the breadcrumb trail
		  d3select.select("#trail")
		      .style("visibility", "hidden");

		  // Deactivate all segments during transition.
		  d3select.selectAll("path").on("mouseover", null);

		  // Transition each segment to full opacity and then reactivate it.
		  d3select.selectAll("path")
		      .transition()
		      .duration(1000)
		      .style("opacity", 1)
		      .on("end", function() {
		              d3select.select(this).on("mouseover", mouseover);
		            });

		  d3select.select("#explanation")
		      .style("visibility", "hidden");
		}

		function initializeBreadcrumbTrail() {
		  // Add the svg area.
		  var trail = d3select.select("#sequence").append("svg:svg")
		      .attr("width", width)
		      .attr("height", 50)
		      .attr("id", "trail");
		  // Add the label at the end, for the percentage.
		  trail.append("svg:text")
		    .attr("id", "endlabel")
		    .style("fill", "#000");
		}

		// Generate a string that describes the points of a breadcrumb polygon.
		function breadcrumbPoints(d, i) {
		  var points = [];
		  points.push("0,0");
		  points.push(b.w + ",0");
		  points.push(b.w + b.t + "," + (b.h / 2));
		  points.push(b.w + "," + b.h);
		  points.push("0," + b.h);
		  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
		    points.push(b.t + "," + (b.h / 2));
		  }
		  return points.join(" ");
		}

		// Update the breadcrumb trail to show the current sequence and percentage.
		function updateBreadcrumbs(nodeArray, percentageString) {

		  // Data join; key function combines name and depth (= position in sequence).
		  var trail = d3select.select("#trail")
		      .selectAll("g")
		      .data(nodeArray, function(d) { return d.data.name + d.depth; });

		  // Remove exiting nodes.
		  trail.exit().remove();

		  // Add breadcrumb and label for entering nodes.
		  var entering = trail.enter().append("svg:g");

		  entering.append("svg:polygon")
		      .attr("points", breadcrumbPoints)
		      .style("fill", function(d) { return colors[d.data.name]; });

		  entering.append("svg:text")
		      .attr("x", (b.w + b.t) / 2)
		      .attr("y", b.h / 2)
		      .attr("dy", "0.35em")
		      .attr("text-anchor", "middle")
		      .text(function(d) { return d.data.name; });

		  // Merge enter and update selections; set position for all nodes.
		  entering.merge(trail).attr("transform", function(d, i) {
		    return "translate(" + i * (b.w + b.s) + ", 0)";
		  });

		  // Now move and update the percentage at the end.
		  d3select.select("#trail").select("#endlabel")
		      .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
		      .attr("y", b.h / 2)
		      .attr("dy", "0.35em")
		      .attr("text-anchor", "middle")
		      .text(percentageString);

		  // Make the breadcrumb trail visible, if it's hidden.
		  d3select.select("#trail")
		      .style("visibility", "");

		}

		function drawLegend() {

		  // Dimensions of legend item: width, height, spacing, radius of rounded rect.
		  var li = {
		    w: 75, h: 30, s: 3, r: 3
		  };

		  var legend = d3select.select("#legend").append("svg:svg")
		      .attr("width", li.w)
		      .attr("height", d3collection.keys(colors).length * (li.h + li.s));

		  var g = legend.selectAll("g")
		      .data(d3collection.entries(colors))
		      .enter().append("svg:g")
		      .attr("transform", function(d, i) {
		              return "translate(0," + i * (li.h + li.s) + ")";
		           });

		  g.append("svg:rect")
		      .attr("rx", li.r)
		      .attr("ry", li.r)
		      .attr("width", li.w)
		      .attr("height", li.h)
		      .style("fill", function(d) { return d.value; });

		  g.append("svg:text")
		      .attr("x", li.w / 2)
		      .attr("y", li.h / 2)
		      .attr("dy", "0.35em")
		      .attr("text-anchor", "middle")
		      .text(function(d) { return d.key; });
		}

		function toggleLegend() {
		  var legend = d3select.select("#legend");
		  if (legend.style("visibility") == "hidden") {
		    legend.style("visibility", "");
		  } else {
		    legend.style("visibility", "hidden");
		  }
		}

		// Take a 2-column CSV and transform it into a hierarchical structure suitable
		// for a partition layout. The first column is a sequence of step names, from
		// root to leaf, separated by hyphens. The second column is a count of how 
		// often that sequence occurred.
		function buildHierarchy(csv) {
		  var root = {"name": "root", "children": []};
		  for (var i = 0; i < csv.length; i++) {
		    var sequence = csv[i][0];
		    var size = +csv[i][1];
		    if (isNaN(size)) { // e.g. if this is a header row
		      continue;
		    }
		    var parts = sequence.split("-");
		    var currentNode = root;
		    for (var j = 0; j < parts.length; j++) {
		      var children = currentNode["children"];
		      var nodeName = parts[j];
		      var childNode;
		      if (j + 1 < parts.length) {
		   // Not yet at the end of the sequence; move down the tree.
		 	var foundChild = false;
		 	for (var k = 0; k < children.length; k++) {
		 	  if (children[k]["name"] == nodeName) {
		 	    childNode = children[k];
		 	    foundChild = true;
		 	    break;
		 	  }
		 	}
		  // If we don't already have a child node for this branch, create it.
		 	if (!foundChild) {
		 	  childNode = {"name": nodeName, "children": []};
		 	  children.push(childNode);
		 	}
		 	currentNode = childNode;
		      } else {
		 	// Reached the end of the sequence; create a leaf node.
		 	childNode = {"name": nodeName, "size": size};
		 	children.push(childNode);
		      }
		    }
		  }
		  return root;
		};
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