d3.json("data.json").then(d => showData(d));

// functions
function createElements(data) {
  let body = d3.select(".canvas")
      .attr("width", "500px")
      .attr("height", "500px")
  
  let links = body.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
      .attr("stroke", "gray")
  
  let nodes = body.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .attr("fill", "black")
  
}

function updateElements() {
  d3.select(".nodes")
    .selectAll("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
  
  d3.select(".links")
    .selectAll("line")
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y)
}


function showData(data) {
  let bodyHeight = 400
  let bodyWidth = 400

  let svg = d3.select("body").append("svg")
    .attr("width", bodyWidth)
    .attr("height", bodyHeight)
    .attr("class", "canvas")
  
  createElements(data)
  let simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id((d) => d.id))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(bodyWidth/2, bodyHeight/2))
    .on("tick", ticked);  

  simulation.nodes(data.nodes)
    .on("tick", updateElements);
  simulation.force("link").links(data.links)
}

function ticked() {
  link.attr("d", linkArc)
  node.attr('transform', d => `translate(${d.x},${d.y})`);
}

function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    } 
 
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      //d.fx = null;
      //d.fy = null;
    }
    function releasenode(d) {
        d.fx = null;
        d.fy = null;
    }
  
    function linkArc(d) {
      var dx = (d.target.x - d.source.x),
          dy = (d.target.y - d.source.y),
          dr = Math.sqrt(dx * dx + dy * dy),
          unevenCorrection = (d.sameUneven ? 0 : 0.5);
          // curvature term defines how tight the arcs are (lower number = tigher curve)
      var curvature = 2,
          arc = (1.0/curvature)*((dr * d.maxSameHalf) / (d.sameIndexCorrected - unevenCorrection));
          
      //console.log(d.maxSameHalf)
      //d.maxSameHalf always showing zero...
      if (d.sameMiddleLink) {
        arc = 0;
      }

      return "M" + d.source.x + "," + d.source.y + "A" + arc + "," + arc + " 0 0," + d.sameArcDirection + " " + d.target.x + "," + d.target.y;
    }