document.addEventListener("DOMContentLoaded", function () {
  const addButton = document.getElementById("add-student-btn");
  const studentRowsContainer = document.getElementById(
    "student-rows-container"
  );

  // Function to calculate age from birthdate
  function calculateAge(birthdate) {
    if (!birthdate) return "";
    
    const birthDate = new Date(birthdate);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // Function to update age based on birthdate input
  function setupBirthdateAgeConnection(row) {
    const birthdateInput = row.querySelector('.birthdate-input');
    const ageInput = row.querySelector('.age-input');
    
    if (birthdateInput && ageInput) {
      // Set max date to today (can't be born in the future)
      const today = new Date().toISOString().split('T')[0];
      birthdateInput.max = today;
      
      // Set a reasonable min date (e.g., 120 years ago)
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 120);
      birthdateInput.min = minDate.toISOString().split('T')[0];
      
      // Calculate initial age if birthdate already has value
      if (birthdateInput.value) {
        ageInput.value = calculateAge(birthdateInput.value);
      }
      
      // Add event listener for birthdate changes
      birthdateInput.addEventListener('change', function() {
        ageInput.value = calculateAge(this.value);
      });
      
      // Also update on input (for immediate feedback)
      birthdateInput.addEventListener('input', function() {
        ageInput.value = calculateAge(this.value);
      });
    }
  }

  // Initialize for default row
  const defaultRow = document.querySelector(".student-row.default-row");
  setupBirthdateAgeConnection(defaultRow);

  addButton.addEventListener("click", function () {
    // Clone the default row
    const newRow = defaultRow.cloneNode(true);

    // Remove default-row class
    newRow.classList.remove("default-row");

    // Clear input values
    const inputs = newRow.querySelectorAll('input');
    inputs.forEach(input => {
      if (input.type !== 'date') {
        input.value = '';
      } else {
        input.value = ''; // Clear birthdate
      }
      
      // Clear age input
      if (input.classList.contains('age-input')) {
        input.value = '';
      }
    });

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

    // Setup birthdate-age connection for new row
    setupBirthdateAgeConnection(newRow);

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