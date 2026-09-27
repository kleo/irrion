// https://github.com/musclesoft/jquery-connections/wiki/API

$(document).ready(function() {
    for (var col = 2; $('#minimize-col-' + col + '-1').length; col++) {
        for (var n = 1; $('#minimize-col-' + col + '-' + n).length; n++) {
            var from = $('#minimize-col-' + col + '-' + n);
            var lineClass = 'line-col-' + col + '-' + n;

            from.connections({ class: lineClass, to: '#minimize-col-' + (col - 1) + '-' + (2 * n - 1) });
            from.connections({ class: lineClass, to: '#minimize-col-' + (col - 1) + '-' + (2 * n) });
        }
    }
});
