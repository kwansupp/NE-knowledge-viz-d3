d3.json("data.json").then(d => showData(d));

// functions
function createElements(data) {
  let body = d3.select("#canvas")
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
  
  createElements(data)
  let simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id((d) => d.id))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(bodyWidth/2, bodyHeight/2))
  
  simulation.nodes(data.nodes)
    .on("tick", updateElements);
  simulation.force("link").links(data.links)
}