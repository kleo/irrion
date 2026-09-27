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

(function() {
  var progress = loadProgress();
  var checkboxes = Array.prototype.slice.call(document.querySelectorAll("input[type=checkbox][id^=checkbox-]"));
  var balls = checkboxes.filter(function(checkbox) {
    return checkbox.classList.contains("toggle-ball");
  });
  var resetButton = document.getElementById("progress-reset");
  var resetTimer = null;

  function updateCount() {
    document.getElementById("progress-count").textContent = balls.filter(function(ball) {
      return ball.checked;
    }).length;
  }

  checkboxes.forEach(function(checkbox) {
    checkbox.checked = progress[checkbox.id] === true;
    checkbox.addEventListener("change", function() {
      if (this.checked) {
        progress[this.id] = true;
      } else {
        delete progress[this.id];
      }
      saveProgress(progress);
      updateCount();
    });
  });
  document.getElementById("progress-total").textContent = balls.length;
  updateCount();

  function cancelReset() {
    clearTimeout(resetTimer);
    resetTimer = null;
    resetButton.classList.remove("confirming");
    resetButton.textContent = "Reset";
  }

  resetButton.addEventListener("click", function() {
    if (resetTimer === null) {
      resetButton.classList.add("confirming");
      resetButton.textContent = "Sure?";
      resetTimer = setTimeout(cancelReset, 3000);
      return;
    }
    cancelReset();
    progress = {};
    saveProgress(progress);
    checkboxes.forEach(function(checkbox) {
      checkbox.checked = false;
    });
    updateCount();
  });
})();
