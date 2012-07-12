var json = {"name":"feathers","children":[{"name":"= false","children":[{"name":"milk","children":[{"name":"= false","children":[{"name":"backbone","children":[{"name":"= false","children":[{"name":"airborne","children":[{"name":"= false","children":[{"name":"predator","children":[{"name":"= false","children":[{"name":"legs","children":[{"name":"<= 2","children":[{"name":"invertebrate (2.0)"}]},{"name":"> 2","children":[{"name":"insect (2.0)"}]}]}]},{"name":"= true","children":[{"name":"invertebrate (8.0)"}]}]}]},{"name":"= true","children":[{"name":"insect (6.0)"}]}]}]},{"name":"= true","children":[{"name":"fins","children":[{"name":"= false","children":[{"name":"tail","children":[{"name":"= false","children":[{"name":"amphibian (3.0)"}]},{"name":"= true","children":[{"name":"reptile (6.0/1.0)"}]}]}]},{"name":"= true","children":[{"name":"fish (13.0)"}]}]}]}]}]},{"name":"= true","children":[{"name":"mammal (41.0)"}]}]}]},{"name":"= true","children":[{"name":"bird (20.0)"}]}]}

//@Ben -- how will this get triggered?
$(document).ready(function() {
  var green = "#1FA13A",
  orange = "#D44413",
  width = 900,
  height = 800;

  var cluster = d3.layout.tree()
    .size([width-40, height-40]);

  var diagonal = d3.svg.diagonal();

  var vis = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(20,20)");

  //Deeeebugging
  var nodes = cluster.nodes(json);
  console.log(nodes);
  var links = cluster.links(nodes);
  console.log(links);
  //updated: will just have push this into json.metadata.tree_depth
  var network_depth = _.max(_.pluck(nodes, "depth"));
  var color = d3.scale.linear().domain([0, network_depth]).range([orange, green]);

  //Draw the links first so they're behind the nodes
  var link = vis.selectAll("path.link")
  .data(links)
  .enter().append("path")
  .transition().delay(400).duration(200)
  .attr("class", "link")
  .attr("d", diagonal)
  .style("stroke", function(d) { return color(d.source.depth) } )
  .style("stroke-width", function(d) { return 1.3*(network_depth - d.source.depth+1) +"px" } );

  var node = vis.selectAll("g.node")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

  node.append("ellipse")
    //.style("fill", function(d) { return color( d.depth ) } )
    .style("fill", "steelblue" )
    .transition()
    .delay(10*network_depth)
    .duration(100*network_depth)
    .attr("ry", function(d) { return 12 } )
    .attr("rx", function(d) { return (($.trim(d.name).length * 2.6) < 14 ? 14 : ($.trim(d.name).length * 2.6) ) });

  node.append("text")
    //this is way off, fiugre out what values are going to get returned
    .attr("dx", function(d) { return -($.trim(d.name).length)*2.6  })
    //move it down slightly to center in circle
    .attr("dy", 3)
    .style("font-family", "Helvetica")
    .style("font-weight", "bold")
    .style("fill", "#fff")
    .text(function(d) { return d.name; });
})
