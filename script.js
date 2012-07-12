var json = {"evaluation" : {"modelrep":"J48 pruned tree\n------------------\n\nMASP1 <= 0.074\n|   E2F1 <= -0.299: non-relapse (6.0)\n|   E2F1 > -0.299: relapse (44.0/14.0)\nMASP1 > 0.074: non-relapse (28.0/4.0)\n\nNumber of Leaves  : \t3\n\nSize of the tree : \t5\n","accuracy":64}, "max_depth":"5","num_leaves":"3","tree_size":"5","tree":{"name":"MASP1","kind":"split_node","children":[{"name":"<= 0.074","kind":"split_value","children":[{"name":"E2F1","kind":"split_node","children":[{"name":"<= -0.299","kind":"split_value","children":[{"name":"non-relapse","kind":"leaf_node","bin_size":6.0,"errors":0.0}]},{"name":"> -0.299","kind":"split_value","children":[{"name":"relapse","kind":"leaf_node","bin_size":44.0,"errors":14.0}]}]}]},{"name":"> 0.074","kind":"split_value","children":[{"name":"non-relapse","kind":"leaf_node","bin_size":28.0,"errors":4.0}]}]}}

function kind(kind_text) {
  switch(kind_text)
  {
    case "split_node":
      return 0;
    case "split_value":
      return 1;
    case "split_node":
      return 2;
    default:
      return 3;
  }
  return 3;
}

//@Ben -- how will this get triggered?
$(document).ready(function() {
  var green = "#1FA13A",
  orange = "#D44413",
  width = 900,
  height = 800,
  depth = json.max_depth-1;

  var cluster = d3.layout.tree()
    .size([width-40, height-40]);

  var diagonal = d3.svg.diagonal();

  var vis = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(20,20)");

  //Deeeebugging
  var nodes = cluster.nodes(json.tree);
  console.log(nodes);
  var links = cluster.links(nodes);
  console.log(links);
  var color = d3.scale.linear().domain([0, depth]).range([orange, green]);

  //Draw the links first so they're behind the nodes
  var link = vis.selectAll("path.link")
  .data(links)
  .enter().append("path")
  .transition().delay(400).duration(200)
  .attr("class", "link")
  .attr("d", diagonal)
  .style("stroke", function(d) { return color(d.source.depth) } )
  .style("stroke-width", function(d) { return 1.3*(depth - d.source.depth+1) +"px" } );

  var node = vis.selectAll("g.node")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

  node.append("ellipse")
    //.style("fill", function(d) { return color( d.depth ) } )
    .style("fill", "steelblue" )
    .transition()
    .delay(10*depth)
    .duration(100*depth)
    .attr("ry", function(d) { return 12 } )
    .attr("rx", function(d) { return (($.trim(d.name).length * 2.6) < 14 ? 14 : ($.trim(d.name).length * 2.6) ) });

  node.append("text")
    //this is way off, fiugre out what values are going to get returned
    .attr("dx", function(d) { return -($.trim(d.name).length)*2.6  })
    //move it down slightly to center in circle
    .attr("dy", 3)
    .style("font-family", "Helvetica")
    .style("font-weight", "bold")
    .style("fill", "#000")
    .text(function(d) { return (kind(d.kind) + " // " + d.name) });
})
