// Grade Distribution Chart (Bar Chart)
async function initializeGradeChart() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/grade_distribution');
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error);
        }
        
        const gradeCtx = document.getElementById('gradeChart').getContext('2d');
        const gradeChart = new Chart(gradeCtx, {
            type: 'bar',
            data: result.data,
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
    } catch (error) {
        console.error('Error loading grade distribution chart:', error);
        document.getElementById('gradeChart').innerHTML = 
            '<p style="color: red; text-align: center;">Failed to load grade distribution</p>';
    }
}

// Performance Trend Chart (Line Chart)
async function initializePerformanceChart() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/performance_trend');
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error);
        }
        
        const performanceCtx = document.getElementById('performanceChart').getContext('2d');
        const performanceChart = new Chart(performanceCtx, {
            type: 'line',
            data: result.data,
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
    } catch (error) {
        console.error('Error loading performance trend chart:', error);
        document.getElementById('performanceChart').innerHTML = 
            '<p style="color: red; text-align: center;">Failed to load performance trend</p>';
    }
}

// Initialize all charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeGradeChart();
    initializePerformanceChart();
});