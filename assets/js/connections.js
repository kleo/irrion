// https://github.com/musclesoft/jquery-connections/wiki/API

$(document).ready(function() {
    var firstColumnSize = 32;

    for (var col = 2; col <= 6; col++) {
        var boxes = firstColumnSize >> (col - 1);

        for (var n = 1; n <= boxes; n++) {
            var from = $('#minimize-col-' + col + '-' + n);
            var lineClass = 'line-col-' + col + '-' + n;

            from.connections({ class: lineClass, to: '#minimize-col-' + (col - 1) + '-' + (2 * n - 1) });
            from.connections({ class: lineClass, to: '#minimize-col-' + (col - 1) + '-' + (2 * n) });
        }
    }
});
