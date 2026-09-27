// https://stackoverflow.com/a/48494583/10025507
// https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp

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
  var opacity = firstChild.style.opacity === "0" ? "1" : "0";

  for (var i = 0; i < elements.length; i++) {
    elements[i].style.opacity = opacity;
  }
}
