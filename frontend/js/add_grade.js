document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addGradeForm');
    const lookupBtn = document.getElementById('lookupBtn');
    const studentIdInput = document.getElementById('studentId');
    const studentNameInput = document.getElementById('studentName');
    const gradeInput = document.getElementById('gradeValue');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Lookup student by ID
    lookupBtn.addEventListener('click', async () => {
        const studentId = studentIdInput.value.trim();

        if (!studentId) {
            showError('Please enter a student ID');
            return;
        }

        if (studentId < 1) {
            showError('Student ID must be a positive number');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/student/${studentId}`);
            const data = await response.json();

            if (response.ok) {
                studentNameInput.value = data.full_name;
                gradeInput.focus();
                successMessage.style.display = 'none';
                errorMessage.style.display = 'none';
            } else {
                showError(data.error || 'Student not found');
                studentNameInput.value = '';
            }
        } catch (error) {
            console.error('Error:', error);
            showError('An error occurred while looking up the student');
            studentNameInput.value = '';
        }
    });

    // Allow Enter key to trigger lookup
    studentIdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            lookupBtn.click();
        }
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const studentId = studentIdInput.value.trim();
        const studentName = studentNameInput.value.trim();
        const grade = gradeInput.value;

        // Validation
        if (!studentId || !studentName || !grade) {
            showError('Please fill in all fields. Look up a student first.');
            return;
        }

        if (grade < 0 || grade > 100) {
            showError('Grade must be between 0 and 100');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/add_grade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    student_id: parseInt(studentId),
                    grade: parseFloat(grade)
                })
            });

            const data = await response.json();

            if (response.ok) {
                showSuccess(`Grade ${grade} added for "${studentName}" successfully!`);
                form.reset();
                
                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                showError(data.error || 'Failed to add grade');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('An error occurred while adding the grade');
        }
    });

    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
    }
});
