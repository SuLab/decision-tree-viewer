var json = {"evaluation" : {"modelrep":"J48 pruned tree\n------------------\n\nMASP1 <= 0.074\n|   E2F1 <= -0.299: non-relapse (6.0)\n|   E2F1 > -0.299: relapse (44.0/14.0)\nMASP1 > 0.074: non-relapse (28.0/4.0)\n\nNumber of Leaves  : \t3\n\nSize of the tree : \t5\n","accuracy":64}, "max_depth":"5","num_leaves":"3","tree_size":"5","tree":{"name":"MASP1","kind":"split_node","children":[{"name":"<= 0.074","kind":"split_value","children":[{"name":"E2F1","kind":"split_node","children":[{"name":"<= -0.299","kind":"split_value","children":[{"name":"non-relapse","kind":"leaf_node","bin_size":6.0,"errors":0.0}]},{"name":"> -0.299","kind":"split_value","children":[{"name":"relapse","kind":"leaf_node","bin_size":44.0,"errors":14.0}]}]}]},{"name":"> 0.074","kind":"split_value","children":[{"name":"non-relapse","kind":"leaf_node","bin_size":28.0,"errors":4.0}]}]}}

function kind(kind_text) {
  switch(kind_text)
  {
    case "split_node":
      return 0;
    case "split_value":
      return 1;
    case "leaf_node":
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
  width = 400,
  height = 600,
  depth = json.max_depth-1;

  var cluster = d3.layout.tree()
    .size([width-40, height-40]),
  diagonal = d3.svg.diagonal();

  var vis = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(0,8)");

  //Deeeebugging
  var nodes = cluster.nodes(json.tree),
      links = cluster.links(nodes),
      color = d3.scale.linear().domain([0, depth]).range([orange, green]),
  //Breaking out node types, uglyyyy
      split_nodes = [], split_values = [], leaf_nodes = [];
  _.each(nodes, function(node) {
    if( kind(node.kind) == 0) {
      split_nodes.push(node);
    } else if ( kind(node.kind) == 1 ) {
      split_values.push(node);
    } else if ( kind(node.kind) == 2 || kind(node.kind) == 3 ) {
      leaf_nodes.push(node);
    }
  })
  console.log(leaf_nodes);
  //Draw the links first so they're behind the nodes
  var link = vis.selectAll("path.link")
  .data(links)
  .enter().append("path")
  .transition().delay(400).duration(200)
  .attr("class", "link")
  .attr("d", diagonal)
  .style("stroke", function(d) { return color(d.source.depth) } )
  .style("stroke-width", function(d) { return 1.3*(depth - d.source.depth+1) +"px" } );
  
  //Drawing the groups to dom
  var split_node = vis.selectAll("g.split_node")
    .data(split_nodes)
    .enter().append("g")
    .attr("class", "split_node")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
  var split_value = vis.selectAll("g.split_value")
    .data(split_values)
    .enter().append("g")
    .attr("class", "split_value")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
  var leaf_node = vis.selectAll("g.leaf_node")
    .data(leaf_nodes)
    .enter().append("g")
    .attr("class", "leaf_node")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

  //Adding to the groups for that node type
  split_node.append("rect")
    .transition().delay(100).duration(400)
    .attr("height", "18")
    .attr("width", function(d) { return $.trim(d.name).length*9  })
    .attr("x", function(d) { return -( $.trim(d.name).length*4.5 ) } )
    .attr("y", "-2")
  split_node.append("text")
    //move it down slightly
    .transition().delay(100).duration(400)
    .attr("dy", 12)
    .text(function(d) { return d.name.toUpperCase() });

  split_value.append("circle")
    .transition().delay(100).duration(400)
    .style("fill", function(d) { return color( d.depth ) })
    .attr("r", "8")
  split_value.append("text")
    .transition().delay(100).duration(400)
    //move it down slightly
    .attr("dy", 4)
    .attr("dx", 32)
    .text(function(d) { return d.name.toUpperCase() });

  //Left node text
  leaf_node.append("text")
    .transition().delay(100).duration(400)
    //move it down slightly
    .attr("dy", 12)
    .text(function(d) { return d.name.toUpperCase() });

    //Adding the bar graphs
  _.each(leaf_nodes, function(d) {
    console.log(d);
    $("#chart").append("<div id='sprkln"+d.bin_size+""+d.errors+"' style='display:none;position:absolute;top:"+(d.y+10)+"px;left:"+(d.x +  $.trim(d.name).length*4.5   )+"px'></div>");
    $("#sprkln"+d.bin_size+""+d.errors).sparkline([d.bin_size,d.errors], {
      type: 'pie',
      width: '12',
      height: '12',
      sliceColors: ['#1FA13A','#D44413']
      }).fadeIn(1200);
    })
})
