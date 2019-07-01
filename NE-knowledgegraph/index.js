var margin = {top: 20, right: 120, bottom: 20, left: 120},
  width = 960 - margin.right - margin.left,
  height = 500 - margin.top - margin.bottom;

var svg = d3.select("#canvas").append("svg")
    .attr("width", width)
    .attr("height", height);

var data = {
  "name": "A1",
  "children": [
    {
      "name": "B1",
      "children": [
        {
          "name": "C1",
          "value": 100
        },
        {
          "name": "C2",
          "value": 300
        },
        {
          "name": "C3",
          "value": 200
        }
      ]
    },
    {
      "name": "B2",
      "value": 200
    }
  ]
}

var root = d3.hierarchy(data)

var treeLayout = d3.tree()
	.size([400,200]);

treeLayout(root);

function link(d) {
	return "M" + d.y + "," + d.x
    + "C" + (d.y + d.parent.y) / 2 + "," + d.x
    + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
    + " " + d.parent.y + "," + d.parent.x;
}

function make(root) {
	var nodes = d3.select('.nodes')
		.selectAll('g.node')
		.data(root.descendants());

	var enteringNodes = nodes.enter()
		.append('g')
		.classed('node', true)
		.attr('transform', function(d) {
			return 'translate(' + d.y + ',' + d.x + ')';
		});

	enteringNodes
		.append('circle')
		.attr('r', 2);

	enteringNodes
		.append('text')
		.attr('x', 5)
		.attr('y', 4)
		.text(function(d) {
			switch(d.depth) {
			case 1:
			case 2:
				return d.data.key;
			case 3:
				return d.data.Film;
			}

			return '';
		});

	var links = d3.select('.links')
		.selectAll('path')
		.data(root.descendants().slice(1));

	links.enter()
		.append('path')
		.attr('d', link);
}



function ready(err, data) {
	var nest = d3.nest()
	  .key(function(d) { return d.Genre; })
	  .key(function(d) { return d['Lead Studio']; })
	  .entries(data);

	nest = {
		key: 'root',
		values: nest
	};

	var root = d3.hierarchy(nest, function(d) {
		return d.values;
	});

	treeLayout(root);
	make(root);
}

// // Nodes
// d3.select('svg g.nodes')
//   .selectAll('circle.node')
//   .data(root.descendants())
//   .enter()
//   .append('circle')
//   .classed('node', true)
//   .attr('cx', function(d) {return d.x;})
//   .attr('cy', function(d) {return d.y;})
//   .attr('r', 4);

// // Links
// d3.select('svg g.links')
//   .selectAll('line.link')
//   .data(root.links())
//   .enter()
//   .append('line')
//   .classed('link', true)
//   .attr('x1', function(d) {return d.source.x;})
//   .attr('y1', function(d) {return d.source.y;})
//   .attr('x2', function(d) {return d.target.x;})
//   .attr('y2', function(d) {return d.target.y;});