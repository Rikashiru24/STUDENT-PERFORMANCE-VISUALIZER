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

// API Grade Average
document.addEventListener('DOMContentLoaded', () => {
  const totalGradeAverage = document.getElementById('gradeAverage');
  const progressBar = document.querySelector('.progress');

  function fetchGradeAverage() {
    fetch("http://127.0.0.1:5000/get_grade_average")
    .then(response => {
        if(!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const average = data.totalAverage;

        //update the text
        totalGradeAverage.textContent = average;
        
        // update the progress bar
        progressBar.style.width = `${average}%`;

            // Optional: Add color based on grade
        updateProgressColor(progressBar, average);
    })
    .catch(error => {
            console.error('Error fetching grade average:', error);
            totalGradeAverage.textContent = 'N/A';
            progressBar.style.width = '0%';
    });
  }
      // Optional: Change color based on grade range
    function updateProgressColor(progressElement, grade) {
        progressElement.classList.remove('excellent', 'good', 'average', 'poor');
        
        if (grade >= 90) {
            progressElement.classList.add('excellent');
        } else if (grade >= 80) {
            progressElement.classList.add('good');
        } else if (grade >= 70) {
            progressElement.classList.add('average');
        } else {
            progressElement.classList.add('poor');
        }
    }
  fetchGradeAverage();
});

// API Attendance Rate



document.addEventListener("DOMContentLoaded", () => {
    fetch("http://127.0.0.1:5000/top_performing_students")
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("top_students_container");

            let html = `
                <table class="table">
                    <tr>
                        <th>Name</th>
                        <th>Grade</th>
                        <th>Status</th>
                    </tr>
            `;

            data.students.forEach(student => {
                const grade = student.grade;
                let status = "";

                if (grade >= 90) status = "Excellent";
                else if (grade >= 80) status = "Very Good";
                else if (grade >= 75) status = "Good";
                else status = "Needs Improvement";

                html += `
                    <tr>
                        <td><div>${student.full_name}</div></td>
                        <td><div>${student.grade}</div></td>
                        <td><div>${status}</div></td>
                    </tr>
                `;
            });

            html += "</table>";
            container.innerHTML = html;
        })
        .catch(err => {
            console.error("Error loading top students:", err);
            document.getElementById("top_students_container").innerHTML =
                "<p style='color:red;'>Failed to load students.</p>";
        });
});