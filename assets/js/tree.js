var STAT_ORDER = ["hp", "atk", "def", "spdef", "spd", "nat"];

var STAT_NAMES = {
  hp: "HP",
  atk: "Attack",
  def: "Defense",
  spdef: "Sp. Def",
  spd: "Speed",
  nat: "Natured"
};

var SELECT_OPTIONS = ["HP", "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"];

var BREEDERS = [
  "hp", "atk", "hp", "def", "atk", "def", "atk", "spdef",
  "atk", "def", "atk", "spdef", "def", "spdef", "def", "spd",
  "atk", "def", "atk", "spdef", "def", "spdef", "def", "spd",
  "atk", "def", "atk", "spdef", "atk", "def", "atk", "nat"
];

var TARGETS = [
  { id: "2x31", label: "2x31", from: 0, to: 2 },
  { id: "3x31", label: "3x31", from: 0, to: 4 },
  { id: "4x31", label: "4x31", from: 0, to: 8 },
  { id: "5x31", label: "5x31", from: 0, to: 16 },
  { id: "2x31-nat", label: "2x31 Natured", from: 28, to: 32 },
  { id: "3x31-nat", label: "3x31 Natured", from: 24, to: 32 },
  { id: "4x31-nat", label: "4x31 Natured", from: 16, to: 32 },
  { id: "5x31-nat", label: "5x31 Natured", from: 0, to: 32 }
];

var DEFAULT_TARGET = "5x31-nat";
var TARGET_KEY = "irrion-target";

var TARGET = (function() {
  var id = DEFAULT_TARGET;
  try {
    id = localStorage.getItem(TARGET_KEY) || DEFAULT_TARGET;
  } catch (e) {}

  var matches = TARGETS.filter(function(target) { return target.id === id; });
  return matches[0] || TARGETS.filter(function(target) { return target.id === DEFAULT_TARGET; })[0];
})();

function storageKey(base) {
  return TARGET.id === DEFAULT_TARGET ? base : base + ":" + TARGET.id;
}

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

function checkboxesHtml(col, n) {
  var html = "";
  var kinds = ["male", "female", "ball"];

  for (var i = 0; i < kinds.length; i++) {
    var id = "checkbox-" + col + "-" + (3 * (n - 1) + i + 1);
    var className = "toggle-" + kinds[i];
    if (kinds[i] === "ball" && col >= 4) {
      className += " ball-col-" + col;
    }
    html += '<input id="' + id + '" class="' + className + '" type="checkbox">' +
      '<label for="' + id + '"></label>' +
      '<div class="' + kinds[i] + '"></div>';
  }
  return html;
}

function fieldsHtml(col, n, stats) {
  if (col === 1) {
    var options = stats[0] === "nat" ? [STAT_NAMES.nat] : SELECT_OPTIONS;
    var optionsHtml = options.map(function(option) {
      return "<option" + (option === STAT_NAMES[stats[0]] ? " selected" : "") + ">" + option + "</option>";
    }).join("");

    return '<div class="form-group">' +
      '<select id="field-1-' + n + '" class="form-control form-control-col-1 transparent-input" disabled>' +
      optionsHtml +
      "</select>" +
      "</div>";
  }

  return stats.map(function(stat, i) {
    var className = "form-control form-control-col-2 transparent-input input-sm";
    if (col === 2 && i === 0) {
      className += " input-field-col-2";
    } else if (col >= 3) {
      className += " input-field-col-" + col + "-" + (i + 1);
    }
    return '<input id="field-' + col + "-" + ((n - 1) * stats.length + i + 1) + '" type="text" class="' + className +
      '" placeholder="' + STAT_NAMES[stat] + '" readonly>';
  }).join("");
}

function boxHtml(col, n, stats) {
  var panelClass = "panel panel-default " + stats.join("-") + (col >= 4 ? " panel-col-" + col : "");
  var ivs = stats.filter(function(stat) { return stat !== "nat"; }).length;

  return '<div id="minimize-col-' + col + "-" + n + '" class="' + panelClass + '">' +
    checkboxesHtml(col, n) +
    fieldsHtml(col, n, stats) +
    '<div class="iv' + (col > 1 ? " iv-col-" + col : "") + '">' + ivs + "x31</div>" +
    (col > 1 ? '<input class="button-min-' + col + '" onclick="minimize(' + col + ", " + n + ')" type="image" src="assets/img/min.png">' : "") +
    "</div>";
}

function rowsHtml(columns, col, n) {
  var row = "";
  for (var cell = 1; cell <= columns.length; cell++) {
    row += '<div class="col-xs-2">' + (cell === col ? boxHtml(col, n, columns[col - 1][n - 1]) : "") + "</div>";
  }
  row = '<div class="row">' + row + "</div>";

  if (col === 1) {
    return row;
  }
  return rowsHtml(columns, col - 1, 2 * n - 1) + row + rowsHtml(columns, col - 1, 2 * n);
}

$(document).ready(function() {
  var columns = buildTree(BREEDERS.slice(TARGET.from, TARGET.to));
  $("#tree").html(rowsHtml(columns, columns.length, 1));

  var select = $("#target-select");
  TARGETS.forEach(function(target) {
    select.append($("<option>").val(target.id).text(target.label));
  });
  select.val(TARGET.id).on("change", function() {
    try {
      localStorage.setItem(TARGET_KEY, this.value);
    } catch (e) {}
    location.reload();
  });
});
