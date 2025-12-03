document.addEventListener("DOMContentLoaded", function () {
  const addButton = document.getElementById("add-student-btn");
  const studentRowsContainer = document.getElementById(
    "student-rows-container"
  );
  const sectionNameInput = document.getElementById("section-name");
  const subjectNameInput = document.getElementById("subject-name");
  const submitContainer = document.getElementById("submit-container");
  const submitButton = document.getElementById("submit-btn");

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

  // Function to check if all required fields are filled
  function checkAllFieldsFilled() {
    // Check section and subject fields
    if (!sectionNameInput.value.trim() || !subjectNameInput.value.trim()) {
      return false;
    }

    // Check all student rows
    const studentRows = document.querySelectorAll('.student-row');
    let allRowsValid = true;

    studentRows.forEach(row => {
      const lastName = row.querySelector('.last-name').value.trim();
      const firstName = row.querySelector('.first-name').value.trim();
      const birthdate = row.querySelector('.birthdate-input').value;
      
      // All these fields are required
      if (!lastName || !firstName || !birthdate) {
        allRowsValid = false;
      }
    });

    return allRowsValid && studentRows.length > 0;
  }

  // Function to update submit button visibility
  function updateSubmitButton() {
    const allFilled = checkAllFieldsFilled();
    
    if (allFilled) {
      submitContainer.classList.add('visible');
    } else {
      submitContainer.classList.remove('visible');
    }
  }

  // Function to setup birthdate-age connection and validation
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
      
      // Add event listeners for birthdate changes
      const updateAgeAndValidate = function() {
        ageInput.value = calculateAge(this.value);
        updateSubmitButton();
      };
      
      birthdateInput.addEventListener('change', updateAgeAndValidate);
      birthdateInput.addEventListener('input', updateAgeAndValidate);
      
      // Add validation for empty birthdate
      birthdateInput.addEventListener('blur', function() {
        updateSubmitButton();
      });
    }
    
    // Setup validation for other inputs in this row
    const inputs = row.querySelectorAll('input:not(.age-input)');
    inputs.forEach(input => {
      input.addEventListener('input', updateSubmitButton);
      input.addEventListener('blur', updateSubmitButton);
      input.addEventListener('change', updateSubmitButton);
    });
  }

  // Add event listeners for section and subject inputs
  sectionNameInput.addEventListener('input', updateSubmitButton);
  subjectNameInput.addEventListener('input', updateSubmitButton);
  sectionNameInput.addEventListener('blur', updateSubmitButton);
  subjectNameInput.addEventListener('blur', updateSubmitButton);

  // Initialize for default row
  const defaultRow = document.querySelector(".student-row.default-row");
  setupBirthdateAgeConnection(defaultRow);

  // Add event listeners to default row inputs
  const defaultInputs = defaultRow.querySelectorAll('input:not(.age-input)');
  defaultInputs.forEach(input => {
    input.addEventListener('input', updateSubmitButton);
    input.addEventListener('blur', updateSubmitButton);
  });

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
      updateSubmitButton(); // Update submit button when row is removed
    });

    // Add new row to container
    studentRowsContainer.appendChild(newRow);

    // Setup birthdate-age connection for new row
    setupBirthdateAgeConnection(newRow);

    // Update submit button visibility
    updateSubmitButton();

    // Focus on first input of new row
    newRow.querySelector("input").focus();
  });

  // Add click event to close buttons for any existing non-default rows
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("close-btn")) {
      e.target.closest(".student-row").remove();
      updateSubmitButton();
    }
  });

  // Submit button functionality
  submitButton.addEventListener("click", function() {
    if (!checkAllFieldsFilled()) {
      alert("Please fill in all required fields before submitting.");
      return;
    }

    // Gather section data
    const sectionData = {
      sectionName: sectionNameInput.value.trim(),
      subjectName: subjectNameInput.value.trim(),
      students: []
    };

    // Gather student data
    const studentRows = document.querySelectorAll('.student-row');
    studentRows.forEach((row, index) => {
      const student = {
        id: index + 1,
        lastName: row.querySelector('.last-name').value.trim(),
        firstName: row.querySelector('.first-name').value.trim(),
        middleName: row.querySelector('.middle-name').value.trim() || null,
        birthdate: row.querySelector('.birthdate-input').value,
        age: parseInt(row.querySelector('.age-input').value)
      };
      sectionData.students.push(student);
    });

    // In a real application, you would send this data to a server
    // For now, we'll just show it in console and alert
    console.log("Section Data to Submit:", sectionData);
    
    // Show success message
    alert(`Section "${sectionData.sectionName}" created successfully with ${sectionData.students.length} student(s)!`);
    
    // Optionally redirect or clear form
    // window.location.href = "index.html"; // Redirect to dashboard
  });

  // Initial check for submit button visibility
  updateSubmitButton();
});