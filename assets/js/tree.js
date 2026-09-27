var STAT_ORDER = ["hp", "atk", "def", "spdef", "spd", "nat"];

var STAT_NAMES = {
  hp: "HP",
  atk: "Attack",
  def: "Defense",
  spdef: "Sp. Def",
  spd: "Speed",
  nat: "Natured"
};

var BREEDERS = [
  "hp", "atk", "hp", "def", "atk", "def", "atk", "spdef",
  "atk", "def", "atk", "spdef", "def", "spdef", "def", "spd",
  "atk", "def", "atk", "spdef", "def", "spdef", "def", "spd",
  "atk", "def", "atk", "spdef", "atk", "def", "atk", "nat"
];

function buildTree(breeders) {
  var columns = [breeders.map(function(stat) { return [stat]; })];

  while (columns[columns.length - 1].length > 1) {
    var previous = columns[columns.length - 1];
    var next = [];

    for (var i = 0; i < previous.length; i += 2) {
      next.push(STAT_ORDER.filter(function(stat) {
        return previous[i].indexOf(stat) !== -1 || previous[i + 1].indexOf(stat) !== -1;
      }));
    }
    columns.push(next);
  }
  return columns;
}

function toggleHtml(col, n, kind, index) {
  var id = "checkbox-" + col + "-" + (3 * (n - 1) + index);
  return '<input id="' + id + '" class="toggle-' + kind + '" type="checkbox"><label for="' + id + '"></label>';
}

function nodeHtml(col, n, stats) {
  var ivs = stats.filter(function(stat) { return stat !== "nat"; }).length;
  var bands = stats.map(function(stat) {
    return '<div class="band ' + stat + '">' + STAT_NAMES[stat] + "</div>";
  }).join("");
  var row = (2 * n - 1) * Math.pow(2, col - 1);

  return '<div id="minimize-col-' + col + "-" + n + '" class="node node-col-' + col + '" style="grid-column: ' + col + "; grid-row: " + row + '">' +
    toggleHtml(col, n, "male", 1) +
    toggleHtml(col, n, "female", 2) +
    '<div class="panel">' + bands + "</div>" +
    toggleHtml(col, n, "ball", 3) +
    '<div class="iv">' + ivs + "x31</div>" +
    (col > 1 ? '<input class="minimize-button" onclick="minimize(' + col + ", " + n + ')" type="image" src="assets/img/min.png">' : "") +
    "</div>";
}

var TREE_COLUMNS = buildTree(BREEDERS);

(function() {
  var tree = document.getElementById("tree");
  var html = "";

  TREE_COLUMNS.forEach(function(boxes, i) {
    boxes.forEach(function(stats, j) {
      html += nodeHtml(i + 1, j + 1, stats);
    });
  });
  tree.style.setProperty("--columns", TREE_COLUMNS.length);
  tree.innerHTML = html;
})();
