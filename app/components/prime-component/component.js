import Component from '@ember/component';
import  d3selection from 'd3-selection';
import d3scale from 'd3-scale';
import d3zoom from 'd3-zoom';
import d3drag from 'd3-drag';
import d3array from 'd3-array';
import d3axis from 'd3-axis';
// import * as d3 from 'd3';
export default Component.extend({

	didInsertElement(){
		console.log('did insert element');
		debugger
	},
	didRender1(){
		let width = 960,
		    height = 600,
		    range0 = 1,
		    range1 = 1000,
		    svg = d3selection.select("#vis").append("svg");

		let s;
		if (s = window.location.search) {
		  var m = s.match(/[\?&]range=([^&,]+),([^&]+)$/);
		  if (m) {
		    range0 = +m[1];
		    range1 = +m[2];
		  }
		}

		var clipRect = svg.append("defs").append("clipPath").attr("id", "clip").append("rect");

		// debugger
		var x = d3scale.scaleLinear ().domain([0, 31]).range([0, width]);

		var zoom = d3zoom.zoom()
		    .scaleExtent([1 / 5, 2])
		    .on("zoom", function() {
		      var t = d3drag.event.translate,
		          k = d3drag.event.scale;
		      t[0] = Math.min(0, t[0]);
		      update(~~x.invert(-t[0] / k));
		      g2.select("rect").attr("x", -t[0]);
		      g2.attr("transform", "translate(" + t[0] + ")scale(" + k + ")")
		        .style("stroke-width", 1 / k + "px");
		      zoom.translate(t);
		    }); 

		var g = svg.append("g")
		    .attr("clip-path", "url(#clip)")
		    .style("pointer-events", "all")
		    .call(zoom);

		d3selection.select(window).on("resize", resize);

		d3selection.select("#close").on("click", function() {
		  d3selection.select("#header")
		      .style("opacity", 1)
		    .transition()
		      .style("opacity", 1e-6)
		      .remove();
		  d3drag.event.preventDefault();
		});

		function resize() {
			debugger
		  svg .attr("width", width = Math.max(600, window.innerWidth))
		      .attr("height", height = Math.max(400, window.innerHeight));
		  clipRect
		      .attr("y", -height / 2)
		      .attr("width", width)
		      .attr("height", height);
		  g.attr("transform", "translate(0," + height / 2 + ")");
		  x.range([0, width]);
		  update(~~x.invert(-zoom.translate()[0] / zoom.scale()));
		  // update(~~x.invert(-8/ zoom.scale()));
		}

		g.append("line").attr("x2", "100%");

		g.append("rect")
		    .attr("y", -height / 2)
		    .attr("width", width)
		    .attr("height", height);

		var focusLine = g.append("line")
		    .attr("class", "focus")
		    .attr("y1", "-50%")
		    .attr("y2", "50%");

		var g2 = g.append("g");

		var focusText = g.selectAll("text")
		    .data(d3array.range(3))
		  .enter().append("text")
		    .attr("dy", function(d, i) { return (i - 2) * 1.2 - .5 + "em"; })
		    .attr("y", "50%");

		var path = g2.selectAll("path.factor");
		var prime = g2.selectAll("g.prime");

		resize();

		function update(lo) {
		  var hi = lo + x.invert(width / zoom.scale());
		  path = path.data(d3array.range(range0, range1), Number);
		  path.enter().append("path")
		      .attr("class", "factor");
		  path.attr("d", function(d) {
		        if (d > hi) return "";
		        var q = ~~(lo / d),
		            d0 = q * d,
		            path = ["M", [x(d0), 0]],
		            r = (x(d) - x(0)) / 2;
		        for (var i = d0 + d, j = (q & 1) ^ 1; i < hi + d; i += d, j ^= 1) {
		          path.push("a", [r, r, 0, 1, j, 2 * r, 0]);
		        }
		        return path.join("");
		      });
		  path.exit().remove();

		  prime = prime.data(primes(hi), Number);
		  var primeEnter = prime.enter().append("g");
		  primeEnter.append("circle").attr("r", 5.5);
		  primeEnter.append("text").attr("dy", "1.8em").attr("text-anchor", "middle").text(String);
		  prime.exit().remove();
		  prime.attr("transform", function(d) { return "translate(" + x(d) + ")"; });
		}

		d3selection.select(window)
		    .on("mousemove", mousemove)
		    .on("touchstart", mousemove, true);

		function mousemove() {
		  var m = d3selection.mouse(g2.node()),
		      p = Math.max(0, Math.round(x.invert(m[0])));
		  path.classed("highlight", function(d) {
		    var h = p % d === 0;
		    if (h) {
		      var parent = this.parentNode;
		      if (parent) parent.insertBefore(this, prime[0][0]);
		    }
		    return h;
		  });
		  var tx = x(p) * zoom.scale() + zoom.translate()[0];
		  focusLine.attr("transform", "translate(" + tx + ")");
		  if (p) {
		    var f = factors(p),
		        s = d3array.sum(f),
		        implication = s - p === 1 ? " ⇒ prime"
		          : s - p < p ? " < n ⇒ deficient"
		          : s - p === p ? " = n ⇒ perfect"
		          : " > n ⇒ abundant"
		    focusText
		        .data([
		          "n = " + p,
		          "σ(n) = " + (f.length ? f.join(" + ") + " = " : "") + s,
		          "s(n) = σ(n) - n = " + s + " - " + p + " = " + (s - p) + implication
		        ])
		        .attr("transform", "translate(" + tx + ")")
		        .attr("text-anchor", tx > width / 2 ? "end" : "start")
		        .attr("dx", tx > width / 2 ? "-.3em" : ".3em")
		        .text(String);
		  } else {
		    focusText.text("");
		  }
		}

		function primes(n) {
		  return d3array.range(n).filter(isPrime);
		}

		function isPrime(n) {
		  if (2 > n) return false;
		  if (0 === n % 2) return 2 === n;
		  for (var index = 3; n / index >= index; index += 2) {
		    if (0 === n % index) return false;
		  }
		  return true;
		}

		function factors(n) {
		  var result = [];
		  for (var i = 1; i <= n / 2; i++) {
		    if (n % i === 0) result.push(i);
		  }
		  if (n) result.push(n);
		  return result;
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