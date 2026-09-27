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

  checkboxes.each(function() {
    this.checked = progress[this.id] === true;
  });

  checkboxes.on("change", function() {
    if (this.checked) {
      progress[this.id] = true;
    } else {
      delete progress[this.id];
    }
    saveProgress(progress);
  });
});
