var STAT_ORDER = ["hp", "atk", "def", "spatk", "spdef", "spd", "nat"];

var IV_STATS = ["hp", "atk", "def", "spatk", "spdef", "spd"];

var STAT_NAMES = {
  hp: "HP",
  atk: "Attack",
  def: "Defense",
  spatk: "Sp. Atk",
  spdef: "Sp. Def",
  spd: "Speed",
  nat: "Natured"
};

var BREEDER_SLOTS = [
  0, 1, 0, 2, 1, 2, 1, 3,
  1, 2, 1, 3, 2, 3, 2, 4,
  1, 2, 1, 3, 2, 3, 2, 4,
  1, 2, 1, 3, 1, 2, 1, "nat"
];

var DEFAULT_SLOT_STATS = ["hp", "atk", "def", "spdef", "spd"];
var SLOT_STATS_KEY = "irrion-stats";

function loadSlotStats() {
  try {
    var stats = JSON.parse(localStorage.getItem(SLOT_STATS_KEY));
    var valid = Array.isArray(stats) && stats.length === DEFAULT_SLOT_STATS.length && stats.every(function(stat, i) {
      return IV_STATS.indexOf(stat) !== -1 && stats.indexOf(stat) === i;
    });
    if (valid) {
      return stats;
    }
  } catch (e) {}
  return DEFAULT_SLOT_STATS.slice();
}

function saveSlotStats(stats) {
  try {
    localStorage.setItem(SLOT_STATS_KEY, JSON.stringify(stats));
  } catch (e) {}
}

function breederStats(slotStats) {
  return BREEDER_SLOTS.map(function(slot) {
    return slot === "nat" ? "nat" : slotStats[slot];
  });
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

function toggleHtml(col, n, kind, index) {
  var id = "checkbox-" + col + "-" + (3 * (n - 1) + index);
  return '<input id="' + id + '" class="toggle-' + kind + '" type="checkbox"><label for="' + id + '"></label>';
}

function bandsHtml(stats) {
  return stats.map(function(stat) {
    return '<div class="band ' + stat + '">' + STAT_NAMES[stat] + "</div>";
  }).join("");
}

function nodeHtml(col, n, stats) {
  var ivs = stats.filter(function(stat) { return stat !== "nat"; }).length;
  var row = (2 * n - 1) * Math.pow(2, col - 1);

  return '<div id="minimize-col-' + col + "-" + n + '" class="node node-col-' + col + '" style="grid-column: ' + col + "; grid-row: " + row + '">' +
    toggleHtml(col, n, "male", 1) +
    toggleHtml(col, n, "female", 2) +
    '<div class="panel">' + bandsHtml(stats) + "</div>" +
    toggleHtml(col, n, "ball", 3) +
    '<div class="iv">' + ivs + "x31</div>" +
    (col > 1 ? '<input class="minimize-button" onclick="minimize(' + col + ", " + n + ')" type="image" src="assets/img/min.png">' : "") +
    "</div>";
}

var SLOT_STATS = loadSlotStats();
var TREE_COLUMNS = buildTree(breederStats(SLOT_STATS));

function renderBands() {
  TREE_COLUMNS = buildTree(breederStats(SLOT_STATS));
  TREE_COLUMNS.forEach(function(boxes, i) {
    boxes.forEach(function(stats, j) {
      document.querySelector("#minimize-col-" + (i + 1) + "-" + (j + 1) + " .panel").innerHTML = bandsHtml(stats);
    });
  });
}

function renderStatPicker() {
  var container = document.getElementById("stat-slots");
  var slots = DEFAULT_SLOT_STATS.map(function(stat, slot) {
    return {
      slot: slot,
      breeders: BREEDER_SLOTS.filter(function(s) { return s === slot; }).length
    };
  }).sort(function(a, b) {
    return b.breeders - a.breeders || a.slot - b.slot;
  });

  var selects = slots.map(function(info) {
    var label = document.createElement("label");
    var select = document.createElement("select");

    label.className = "stat-slot";
    label.appendChild(document.createTextNode(info.breeders + "x "));
    IV_STATS.forEach(function(stat) {
      var option = document.createElement("option");
      option.value = stat;
      option.textContent = STAT_NAMES[stat];
      select.appendChild(option);
    });
    select.value = SLOT_STATS[info.slot];
    label.appendChild(select);
    container.appendChild(label);

    select.addEventListener("change", function() {
      var previous = SLOT_STATS[info.slot];
      var other = SLOT_STATS.indexOf(this.value);

      SLOT_STATS[info.slot] = this.value;
      if (other !== -1 && other !== info.slot) {
        SLOT_STATS[other] = previous;
      }
      applySlotStats();
    });

    return { slot: info.slot, select: select };
  });

  function applySlotStats() {
    saveSlotStats(SLOT_STATS);
    selects.forEach(function(entry) {
      entry.select.value = SLOT_STATS[entry.slot];
    });
    renderBands();
  }

  document.getElementById("stats-reset").addEventListener("click", function() {
    SLOT_STATS = DEFAULT_SLOT_STATS.slice();
    applySlotStats();
  });
}

(function() {
  var tree = document.getElementById("tree");
  var html = "";

  TREE_COLUMNS.forEach(function(boxes, i) {
    boxes.forEach(function(stats, j) {
      html += nodeHtml(i + 1, j + 1, stats);
    });
  });
  tree.innerHTML = html;
  renderStatPicker();
})();
