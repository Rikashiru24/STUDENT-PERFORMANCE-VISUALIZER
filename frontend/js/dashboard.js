// Grade Distribution Chart (Bar Chart)
const gradeCtx = document.getElementById('gradeChart').getContext('2d');
const gradeChart = new Chart(gradeCtx, {
    type: 'bar',
    data: {
        labels: ['A (90-100)', 'B (80-89)', 'C (70-79)', 'D (60-69)', 'F (Below 60)'],
        datasets: [{
            label: 'Number of Students',
            data: [45, 78, 52, 18, 7],
            backgroundColor: [
                '#4CAF50',  // Green for A
                '#8BC34A',  // Light Green for B
                '#FFC107',  // Amber for C
                '#FF9800',  // Orange for D
                '#F44336'   // Red for F
            ],
            borderColor: [
                '#45a049',
                '#7cb342',
                '#fbc02d',
                '#e68900',
                '#da190b'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Students'
                }
            }
        }
    }
});
// Performance Trend Chart (Line Chart)
const performanceCtx = document.getElementById('performanceChart').getContext('2d');
const performanceChart = new Chart(performanceCtx, {
    type: 'line',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Class Average',
                data: [78, 80, 82, 85, 87, 88],
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                tension: 0.3,
                fill: true,
                borderWidth: 2
            },
            {
                label: 'Attendance Rate',
                data: [88, 89, 91, 92, 93, 92],
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.3,
                fill: true,
                borderWidth: 2
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                min: 0,
                max: 100
            }
        }
    }
});


