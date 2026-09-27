// https://stackoverflow.com/a/48494583/10025507
// https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp

var MINIMIZED_KEY = storageKey("irrion-minimized");

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
  var hide = !$(firstChild).hasClass("minimized");

  $(elements).toggleClass("minimized", hide);
  saveMinimized();
}

function eachMinimizable(fn) {
  $("[id^=minimize-col-]").each(function() {
    fn(this.id, this);

    var lineClass = this.id.replace("minimize-", "line-");
    $("." + lineClass).each(function(i) {
      fn(lineClass + "/" + i, this);
    });
  });
}

function saveMinimized() {
  var keys = [];
  eachMinimizable(function(key, element) {
    if ($(element).hasClass("minimized")) {
      keys.push(key);
    }
  });

  try {
    localStorage.setItem(MINIMIZED_KEY, JSON.stringify(keys));
  } catch (e) {}
}

$(document).ready(function() {
  var keys;
  try {
    keys = JSON.parse(localStorage.getItem(MINIMIZED_KEY)) || [];
  } catch (e) {
    keys = [];
  }

  eachMinimizable(function(key, element) {
    $(element).toggleClass("minimized", keys.indexOf(key) !== -1);
  });
});
