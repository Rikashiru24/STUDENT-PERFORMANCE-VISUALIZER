document.addEventListener('DOMContentLoaded', () => {
const totalStudentSpan = document.getElementById('total_number_students');

function fetchTotalStudents() {
    fetch("http://127.0.0.1:5000/total_students")
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }
        return response.json(); // returns JSON
    })
    .then(data => {
        totalStudentSpan.textContent = data.total;
    })
    .catch(error => {
        console.error('Error fetching total students:', error);
        totalStudentSpan.textContent = 'N/A';
    });
}

// Call the function when the page is loads
fetchTotalStudents();
});