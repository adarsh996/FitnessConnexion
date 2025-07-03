// Dashboard specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initCharts();
    
    // Load dashboard stats
    loadDashboardStats();
    
    // Refresh button
    document.getElementById('refreshDashboard').addEventListener('click', function() {
        loadDashboardStats();
        initCharts();
    });
    
    // Date range buttons
    document.querySelectorAll('.date-range button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.date-range button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // Here you would filter data based on the selected range
        });
    });
    
    // Period buttons for attendance chart
    document.querySelectorAll('.card-actions button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.card-actions button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // Here you would update the chart based on the selected period
        });
    });
    
    // Renewal period buttons
    document.querySelectorAll('.upcoming-renewals .card-actions button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.upcoming-renewals .card-actions button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // Here you would filter renewals based on the selected days
        });
    });
});

// Initialize charts
function initCharts() {
    // Attendance Trend Chart
    const attendanceCtx = document.getElementById('attendanceChart').getContext('2d');
    const attendanceChart = new Chart(attendanceCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Attendance',
                data: [32, 28, 35, 40, 38, 25, 30],
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                borderColor: 'rgba(255, 107, 107, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Membership Distribution Chart
    const membershipCtx = document.getElementById('membershipChart').getContext('2d');
    const membershipChart = new Chart(membershipCtx, {
        type: 'doughnut',
        data: {
            labels: ['3 Months', '6 Months', '12 Months'],
            datasets: [{
                data: [85, 120, 45],
                backgroundColor: [
                    'rgba(255, 107, 107, 0.8)',
                    'rgba(78, 205, 196, 0.8)',
                    'rgba(255, 190, 118, 0.8)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '70%'
        }
    });
}

// Load dashboard stats
function loadDashboardStats() {
    // Total members count
    db.collection('members').get()
        .then(querySnapshot => {
            document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = querySnapshot.size;
        });
    
    // Active members count (example: count members with status 'active')
    db.collection('members').where('status', '==', 'active').get()
        .then(querySnapshot => {
            const activeCount = querySnapshot.size;
            document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = activeCount;
            
            // Calculate active percentage
            db.collection('members').get()
                .then(allSnapshot => {
                    const percentage = Math.round((activeCount / allSnapshot.size) * 100);
                    document.querySelector('.stat-card:nth-child(2) .stat-percentage').textContent = `${percentage}%`;
                });
        });
    
    // Today's attendance count
    const today = new Date().toISOString().split('T')[0];
    db.collection('attendance').where('date', '==', today).get()
        .then(querySnapshot => {
            document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = querySnapshot.size;
        });
    
    // Monthly revenue (this would depend on your payment tracking system)
    // This is just a placeholder - you'd need to implement actual payment tracking
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = '₹2,45,600';
}