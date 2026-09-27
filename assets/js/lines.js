var LINE_RADIUS = 10;

(function() {
  var tree = document.getElementById("tree");
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  var lines = [];

  svg.setAttribute("class", "lines");
  tree.insertBefore(svg, tree.firstChild);

  function panel(col, n) {
    return document.querySelector("#minimize-col-" + col + "-" + n + " .panel");
  }

  for (var col = 2; col <= TREE_COLUMNS.length; col++) {
    for (var n = 1; n <= TREE_COLUMNS[col - 1].length; n++) {
      for (var child = 2 * n - 1; child <= 2 * n; child++) {
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("class", "line-col-" + col + "-" + n);
        svg.appendChild(path);
        lines.push({ path: path, from: panel(col - 1, child), to: panel(col, n) });
      }
    }
  }

  function draw() {
    var origin = tree.getBoundingClientRect();

    lines.forEach(function(line) {
      var from = line.from.getBoundingClientRect();
      var to = line.to.getBoundingClientRect();
      var x1 = Math.round(from.right - origin.left);
      var y1 = Math.round(from.top + from.height / 2 - origin.top) + 0.5;
      var x2 = Math.round(to.left + to.width / 2 - origin.left) + 0.5;
      var above = from.top < to.top;
      var y2 = Math.round((above ? to.top : to.bottom) - origin.top);
      var r = Math.min(LINE_RADIUS, Math.abs(y2 - y1), Math.abs(x2 - x1));
      var dy = above ? r : -r;

      line.path.setAttribute("d",
        "M" + x1 + " " + y1 +
        " H" + (x2 - r) +
        " A" + r + " " + r + " 0 0 " + (above ? 1 : 0) + " " + x2 + " " + (y1 + dy) +
        " V" + y2);
    });
  }

  draw();
  if (window.ResizeObserver) {
    new ResizeObserver(draw).observe(tree);
  }
  window.addEventListener("resize", draw);
  window.addEventListener("load", draw);
  if (document.fonts) {
    document.fonts.ready.then(draw);
  }
})();
