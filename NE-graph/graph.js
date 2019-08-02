d3.json("data.json").then(d => showData(d));

function showData(data) {
    // setup canvas
    let height = 400
    let width = 400

    let svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "canvas")

    // initialize elements from data
    createElements(data);

    // apply force simulation
    let simulation = d3.forceSimulation(data.nodes)   // apply algorithm to data.nodes
        .force("link", d3.forceLink()                 // link the nodes
            .id(function(d) { return d.id; }))         // node id
            // .links(data.links))                       // links
        .force("charge", d3.forceManyBody())          // .strength(-400) repulsion between nodes
        .force("center", d3.forceCenter(width/2, height/2)) // attract nodes to center of area

    // update node and link locations
    simulation.nodes(data.nodes)
        .on("tick", updateElements);
    simulation.force("link").links(data.links)

    
    function createElements(data) {

        let body = d3.select(".canvas")

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

        nodes.append("circle")
            .attr("class", "node")
            .attr("r", 5)
            .attr("fill", "black")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
            .on("click", function() {
                nodeToggle();
            });;

        nodes.append("text")
            .attr("class", "label")
            .attr("fill", "gray")
            .attr("z-index", -1)
            .text(function(d) { return d.id});

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

        d3.selectAll(".label")
            .attr("x", d => d.x + 10)
            .attr("y", d => d.y + 5)
    }


    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        // console.log("started")
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
        // console.log("dragging")
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        // console.log("ended")
        // simulation.force("center", d3.forceCenter());
    }

    function nodeToggle() {
        // d3.mouse(this).style("fill", "blue")
    }


}


