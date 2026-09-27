// https://stackoverflow.com/a/48494583/10025507
// https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp

var MINIMIZED_KEY = "irrion-minimized";

function minimize(col, n) {
  var elements = [];

  (function collect(col, n) {
    var lines = document.getElementsByClassName("line-col-" + col + "-" + n);
    elements.push(lines[0], lines[1]);

    for (var child = 2 * n - 1; child <= 2 * n; child++) {
      elements.push(document.getElementById("minimize-col-" + (col - 1) + "-" + child));
      if (col - 1 > 1) {
        collect(col - 1, child);
      }
    }
  })(col, n);

  var firstChild = document.getElementById("minimize-col-" + (col - 1) + "-" + (2 * n - 1));
  var hide = !firstChild.classList.contains("minimized");

  elements.forEach(function(element) {
    element.classList.toggle("minimized", hide);
  });
  saveMinimized();
}

function eachMinimizable(fn) {
  document.querySelectorAll("[id^=minimize-col-]").forEach(function(box) {
    fn(box.id, box);

    var lineClass = box.id.replace("minimize-", "line-");
    Array.prototype.forEach.call(document.getElementsByClassName(lineClass), function(line, i) {
      fn(lineClass + "/" + i, line);
    });
  });
}

function saveMinimized() {
  var keys = [];
  eachMinimizable(function(key, element) {
    if (element.classList.contains("minimized")) {
      keys.push(key);
    }
  });

  try {
    localStorage.setItem(MINIMIZED_KEY, JSON.stringify(keys));
  } catch (e) {}
}

(function() {
  var keys;
  try {
    keys = JSON.parse(localStorage.getItem(MINIMIZED_KEY)) || [];
  } catch (e) {
    keys = [];
  }

  eachMinimizable(function(key, element) {
    element.classList.toggle("minimized", keys.indexOf(key) !== -1);
  });
})();
