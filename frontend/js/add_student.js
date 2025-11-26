document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addStudentForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value.trim();
        const middleName = document.getElementById('middleName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const age = document.getElementById('age').value;

        // Validation
        if (!firstName || !lastName || !age) {
            showError('Please fill in all required fields');
            return;
        }

        if (age < 1 || age > 100) {
            showError('Age must be between 1 and 100');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/add_student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fname: firstName,
                    mname: middleName || '',
                    lname: lastName,
                    age: parseInt(age)
                })
            });

            const data = await response.json();

            if (response.ok) {
                showSuccess(`Student "${firstName} ${lastName}" added successfully!`);
                form.reset();
                
                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    window.location.href = '/frontend/index.html';
                }, 2000);
            } else {
                showError(data.error || 'Failed to add student');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('An error occurred while adding the student');
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
