'use strict';

console.log('\'Allo \'Allo!');
'use strict';

function drawGraph(diameter) {
  d3.select('#graphholder').remove();
  var format = d3.format(',d'),
      color = d3.scaleOrdinal(d3.schemeCategory20c);

  var bubble = d3.pack().size([diameter, diameter]).padding(1.5);

  var svg = d3.select('body').select('#graph').append('svg').attr('id', 'graphholder').attr('width', diameter).attr('height', diameter).attr('class', 'bubble');

  d3.json('flare.json', function (error, data) {
    if (error) throw error;

    var root = d3.hierarchy(classes(data)).sum(function (d) {
      return d.value;
    }).sort(function (a, b) {
      return b.value - a.value;
    });

    bubble(root);
    var node = svg.selectAll('.node').data(root.children).enter().append('g').attr('class', 'node').attr('transform', function (d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    });

    node.append('title').text(function (d) {
      return d.data.className + ': ' + format(d.value);
    });

    node.append('circle').attr('r', function (d) {
      return d.r;
    }).style('fill', function (d) {
      return color(d.data.packageName);
    });

    node.append('text').attr('dy', '.3em').style('text-anchor', 'middle').text(function (d) {
      return d.data.className.substring(0, d.r / 3);
    });
  });
  d3.select(self.frameElement).style('height', diameter + 'px');
}
// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function (child) {
      recurse(node.name, child);
    });else classes.push({ packageName: name, className: node.name, value: node.size });
  }

  recurse(null, root);
  return { children: classes };
}

$(window).resize(function () {
  if ($(window).width() > 1000) {
    drawGraph($(window).width() / 2);
  } else {
    drawGraph($(window).width() - 100);
  }
});
//draw graph the first time
if ($(window).width() > 1000) {
  drawGraph($(window).width() / 2);
} else {
  drawGraph($(window).width() - 100);
}