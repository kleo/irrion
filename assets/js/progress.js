var PROGRESS_KEY = "irrion-progress";

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {}
}

$(document).ready(function() {
  var progress = loadProgress();
  var checkboxes = $("input[type=checkbox][id^=checkbox-]");
  var balls = checkboxes.filter(".toggle-ball");
  var resetButton = $("#progress-reset");
  var resetTimer = null;

  function updateCount() {
    $("#progress-count").text(balls.filter(":checked").length);
  }

  checkboxes.each(function() {
    this.checked = progress[this.id] === true;
  });
  $("#progress-total").text(balls.length);
  updateCount();

  checkboxes.on("change", function() {
    if (this.checked) {
      progress[this.id] = true;
    } else {
      delete progress[this.id];
    }
    saveProgress(progress);
    updateCount();
  });

  function cancelReset() {
    clearTimeout(resetTimer);
    resetTimer = null;
    resetButton.removeClass("confirming").text("Reset");
  }

  resetButton.on("click", function() {
    if (resetTimer === null) {
      resetButton.addClass("confirming").text("Sure?");
      resetTimer = setTimeout(cancelReset, 3000);
      return;
    }
    cancelReset();
    progress = {};
    saveProgress(progress);
    checkboxes.prop("checked", false);
    updateCount();
  });
});
