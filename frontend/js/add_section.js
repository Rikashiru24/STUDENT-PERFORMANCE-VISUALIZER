document.addEventListener("DOMContentLoaded", function () {
  const addButton = document.getElementById("add-student-btn");
  const studentRowsContainer = document.getElementById(
    "student-rows-container"
  );

  addButton.addEventListener("click", function () {
    // Clone the default row
    const defaultRow = document.querySelector(".student-row.default-row");
    const newRow = defaultRow.cloneNode(true);

    // Remove default-row class
    newRow.classList.remove("default-row");

    // Create close button
    const closeButton = document.createElement("button");
    closeButton.className = "close-btn tooltip-container";
    closeButton.innerHTML = "×";

    // Create tooltip for close button
    const tooltip = document.createElement("span");
    tooltip.className = "tooltip tooltip-top";
    tooltip.textContent = "Remove this student";
    closeButton.appendChild(tooltip);

    // Replace empty div with close button
    const lastDiv = newRow.querySelector("div:last-child");
    lastDiv.parentNode.replaceChild(closeButton, lastDiv);

    // Add event listener to close button
    closeButton.addEventListener("click", function () {
      newRow.remove();
    });

    // Add new row to container
    studentRowsContainer.appendChild(newRow);

    // Focus on first input of new row
    newRow.querySelector("input").focus();
  });

  // Add click event to close buttons for any existing non-default rows
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("close-btn")) {
      e.target.closest(".student-row").remove();
    }
  });
});
