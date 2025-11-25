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

/**
 * Fetches the top performing students from the backend API
 * 
 * This function makes a GET request to the /top_performing_students endpoint
 * and processes the returned data containing the top 5 students by average grade.
 * 
 * Returns:
 *   Promise that resolves to an array of top performing student objects with:
 *   - student_id: Unique identifier for the student
 *   - first_name: Student's first name
 *   - last_name: Student's last name
 *   - average_grade: Student's average grade/GPA
 */
function fetchTopPerformingStudents() {
    return fetch("http://127.0.0.1:5000/top_performing_students")
        .then(response => {
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            return response.json(); // array of students
        })
        .catch(error => {
            console.error('Error fetching top performing students:', error);
            throw error;
        });
}



/**
 * Displays the top performing students in the DOM
 * 
 * This function retrieves the top performing students and populates
 * a specified container element with their information.
 * Shows a shimmer loading effect while fetching data.
 * 
 * Parameters:
 *   containerId (string): The ID of the HTML element where students will be displayed
 */
function displayTopPerformingStudents(containerId = 'top_students_container') {
    const container = document.getElementById(containerId);
    
    // Check if the container element exists
    if (!container) {
        console.warn(`Container with ID "${containerId}" not found in the DOM`);
        return;
    }
    
    // Display shimmer loading effect while fetching data
    const shimmerHTML = `
        <table class="table shimmer-table">
            <tr>
                <th>Name</th>
                <th>Grade</th>
                <th>Status</th>
            </tr>
            <tr>
                <td><div class="shimmer-line"></div></td>
                <td><div class="shimmer-line"></div></td>
                <td><div class="shimmer-line"></div></td>
            </tr>
            <tr>
                <td><div class="shimmer-line"></div></td>
                <td><div class="shimmer-line"></div></td>
                <td><div class="shimmer-line"></div></td>
            </tr>
            <tr>
                <td><div class="shimmer-line"></div></td>
                <td><div class="shimmer-line"></div></td>
                <td><div class="shimmer-line"></div></td>
            </tr>
            <tr>
                <td><div class="shimmer-line"></div></td>
                <td><div class="shimmer-line"></div></td>
                <td><div class="shimmer-line"></div></td>
            </tr>
            <tr>
                <td><div class="shimmer-line"></div></td>
                <td><div class="shimmer-line"></div></td>
                <td><div class="shimmer-line"></div></td>
            </tr>
        </table>
    `;
    
    // Set the shimmer HTML while loading
    container.innerHTML = shimmerHTML;
    
    // Fetch the top performing students data
    fetchTopPerformingStudents()
        .then(students => {
            // Clear any existing content in the container
            container.innerHTML = '';
            
            // Check if students data is empty
            if (students.length === 0) {
                container.innerHTML = '<p>No top performing students found.</p>';
                return;
            }
            
            // Build the HTML table with actual student data
            let html = '<table class="table">';
            html += '<tr><th>Name</th><th>Grade</th><th>Status</th></tr>';
            
            students.forEach((student) => {
                // Determine status based on grade
                let status = '';
                let grade = student.grade;
                
                if (grade >= 90) {
                    status = 'Excellent';
                } else if (grade >= 80) {
                    status = 'Good';
                } else if (grade >= 70) {
                    status = 'Satisfactory';
                } else if (grade >= 60) {
                    status = 'Needs Improvement';
                } else {
                    status = 'Failing';
                }
                
                // Create a table row for each top performing student
                html += `
                    <tr>
                        <td>${student.fname} ${student.mname ? student.mname + ' ' : ''}${student.lname}</td>
                        <td>${grade.toFixed(2)}%</td>
                        <td>${status}</td>
                    </tr>`;
            });
            html += '</table>';
            
            // Insert the HTML table into the container
            container.innerHTML = html;
        })
        .catch(error => {
            // Display error message if the fetch fails
            container.innerHTML = `<p class="error">Unable to load top performing students: ${error.message}</p>`;
        });
}
});