// Initialize Firestore
const db = firebase.firestore();

// Add Member Function
const addMemberForm = document.getElementById('addMemberForm');
if (addMemberForm) {
    addMemberForm.addEventListener('submit', e => {
        e.preventDefault();
        
        const memberData = {
            name: addMemberForm['memberName'].value,
            email: addMemberForm['memberEmail'].value,
            phone: addMemberForm['memberPhone'].value,
            dob: addMemberForm['memberDob'].value,
            gender: addMemberForm['memberGender'].value,
            plan: addMemberForm['memberPlan'].value,
            joinDate: addMemberForm['memberJoinDate'].value,
            address: addMemberForm['memberAddress'].value,
            status: 'active',
            createdAt: new Date()
        };
        
        db.collection('members').add(memberData)
            .then(docRef => {
                console.log('Member added with ID:', docRef.id);
                alert('Member added successfully!');
                addMemberForm.reset();
                document.getElementById('addMemberModal').style.display = 'none';
                // Refresh members table
                if (window.location.pathname.includes('members.html')) {
                    loadMembers();
                }
            })
            .catch(err => {
                console.error('Error adding member:', err);
                alert(err.message);
            });
    });
}

// Load Members Function
function loadMembers() {
    const membersTable = document.getElementById('membersTable');
    if (membersTable) {
        const tbody = membersTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        db.collection('members').orderBy('createdAt', 'desc').get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const member = doc.data();
                    const row = document.createElement('tr');
                    
                    // Calculate expiry date based on plan
                    let expiryDate = 'N/A';
                    if (member.joinDate && member.plan) {
                        const joinDate = new Date(member.joinDate);
                        let months = 0;
                        
                        if (member.plan.includes('3')) months = 3;
                        else if (member.plan.includes('6')) months = 6;
                        else if (member.plan.includes('12')) months = 12;
                        
                        joinDate.setMonth(joinDate.getMonth() + months);
                        expiryDate = joinDate.toLocaleDateString();
                    }
                    
                    row.innerHTML = `
                        <td>FC-${doc.id.substring(0, 6)}</td>
                        <td>${member.name || 'N/A'}</td>
                        <td>${member.phone || 'N/A'}</td>
                        <td>${member.email || 'N/A'}</td>
                        <td>${member.plan || 'N/A'}</td>
                        <td>${member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'}</td>
                        <td>${expiryDate}</td>
                        <td><span class="status-badge ${member.status || 'active'}">${member.status || 'active'}</span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="action-btn view-member" data-id="${doc.id}"><i class="fas fa-eye"></i></button>
                                <button class="action-btn edit-member" data-id="${doc.id}"><i class="fas fa-edit"></i></button>
                                <button class="action-btn delete-member" data-id="${doc.id}"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    `;
                    
                    tbody.appendChild(row);
                });
                
                // Add event listeners to action buttons
                document.querySelectorAll('.view-member').forEach(btn => {
                    btn.addEventListener('click', () => viewMember(btn.getAttribute('data-id')));
                });
                
                document.querySelectorAll('.edit-member').forEach(btn => {
                    btn.addEventListener('click', () => editMember(btn.getAttribute('data-id')));
                });
                
                document.querySelectorAll('.delete-member').forEach(btn => {
                    btn.addEventListener('click', () => deleteMember(btn.getAttribute('data-id')));
                });
            })
            .catch(err => {
                console.error('Error loading members:', err);
            });
    }
}

// View Member Function
function viewMember(memberId) {
    db.collection('members').doc(memberId).get()
        .then(doc => {
            if (doc.exists) {
                const member = doc.data();
                const modal = document.getElementById('memberDetailsModal');
                
                // Calculate age from DOB if available
                let age = 'N/A';
                if (member.dob) {
                    const dob = new Date(member.dob);
                    const diff = Date.now() - dob.getTime();
                    const ageDate = new Date(diff);
                    age = Math.abs(ageDate.getUTCFullYear() - 1970);
                }
                
                // Calculate expiry date
                let expiryDate = 'N/A';
                if (member.joinDate && member.plan) {
                    const joinDate = new Date(member.joinDate);
                    let months = 0;
                    
                    if (member.plan.includes('3')) months = 3;
                    else if (member.plan.includes('6')) months = 6;
                    else if (member.plan.includes('12')) months = 12;
                    
                    joinDate.setMonth(joinDate.getMonth() + months);
                    expiryDate = joinDate.toLocaleDateString();
                }
                
                // Update modal with member data
                document.getElementById('memberDetailName').textContent = member.name || 'N/A';
                document.getElementById('memberDetailId').textContent = `ID: FC-${doc.id.substring(0, 6)}`;
                document.getElementById('detailEmail').textContent = member.email || 'N/A';
                document.getElementById('detailPhone').textContent = member.phone || 'N/A';
                document.getElementById('detailGender').textContent = member.gender ? member.gender.charAt(0).toUpperCase() + member.gender.slice(1) : 'N/A';
                document.getElementById('detailAge').textContent = age;
                document.getElementById('detailJoinDate').textContent = member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A';
                document.getElementById('detailMembership').textContent = member.plan || 'N/A';
                document.getElementById('detailAddress').textContent = member.address || 'N/A';
                
                // Update status badge
                const statusBadge = document.querySelector('#memberDetailStatus .status-badge');
                statusBadge.className = 'status-badge ' + (member.status || 'active');
                statusBadge.textContent = member.status || 'active';
                
                // Update expiry date
                document.querySelector('#memberDetailStatus .expiry-date').textContent = `Expires: ${expiryDate}`;
                
                // Show modal
                modal.style.display = 'block';
            } else {
                alert('Member not found!');
            }
        })
        .catch(err => {
            console.error('Error viewing member:', err);
            alert(err.message);
        });
}

// Edit Member Function
function editMember(memberId) {
    // Similar to viewMember but with editable fields
    // Implementation would be similar to viewMember but with form fields
    console.log('Edit member:', memberId);
}

// Delete Member Function
function deleteMember(memberId) {
    if (confirm('Are you sure you want to delete this member?')) {
        db.collection('members').doc(memberId).delete()
            .then(() => {
                console.log('Member deleted successfully');
                loadMembers(); // Refresh the table
            })
            .catch(err => {
                console.error('Error deleting member:', err);
                alert(err.message);
            });
    }
}

// Load Attendance Function
function loadAttendance() {
    const attendanceTable = document.getElementById('attendanceTable');
    if (attendanceTable) {
        const tbody = attendanceTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        const selectedDate = document.getElementById('attendanceDate').value || today;
        
        db.collection('attendance')
            .where('date', '==', selectedDate)
            .orderBy('timeIn', 'desc')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const attendance = doc.data();
                    
                    // Get member details
                    db.collection('members').doc(attendance.memberId).get()
                        .then(memberDoc => {
                            const member = memberDoc.data();
                            const row = document.createElement('tr');
                            
                            // Calculate duration if timeOut exists
                            let duration = 'N/A';
                            if (attendance.timeOut) {
                                const timeIn = new Date(attendance.timeIn);
                                const timeOut = new Date(attendance.timeOut);
                                const diff = timeOut - timeIn;
                                const hours = Math.floor(diff / (1000 * 60 * 60));
                                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                duration = `${hours}h ${minutes}m`;
                            }
                            
                            row.innerHTML = `
                                <td>FC-${attendance.memberId.substring(0, 6)}</td>
                                <td>${member.name || 'N/A'}</td>
                                <td>${attendance.timeIn ? new Date(attendance.timeIn).toLocaleTimeString() : 'N/A'}</td>
                                <td>${attendance.timeOut ? new Date(attendance.timeOut).toLocaleTimeString() : 'N/A'}</td>
                                <td>${duration}</td>
                                <td><span class="status-badge ${attendance.timeOut ? 'completed' : 'in-progress'}">${attendance.timeOut ? 'Completed' : 'In Progress'}</span></td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="action-btn check-out" data-id="${doc.id}" ${attendance.timeOut ? 'disabled' : ''}><i class="fas fa-sign-out-alt"></i></button>
                                    </div>
                                </td>
                            `;
                            
                            tbody.appendChild(row);
                            
                            // Add event listener to check-out button
                            if (!attendance.timeOut) {
                                row.querySelector('.check-out').addEventListener('click', () => checkOutMember(doc.id));
                            }
                        });
                });
            })
            .catch(err => {
                console.error('Error loading attendance:', err);
            });
    }
}

// Check In Member Function
function checkInMember(memberId) {
    const checkInData = {
        memberId,
        date: new Date().toISOString().split('T')[0],
        timeIn: new Date(),
        createdAt: new Date()
    };
    
    db.collection('attendance').add(checkInData)
        .then(() => {
            console.log('Member checked in successfully');
            loadAttendance(); // Refresh attendance table
            document.getElementById('checkInModal').style.display = 'none';
        })
        .catch(err => {
            console.error('Error checking in member:', err);
            alert(err.message);
        });
}

// Check Out Member Function
function checkOutMember(attendanceId) {
    db.collection('attendance').doc(attendanceId).update({
        timeOut: new Date()
    })
    .then(() => {
        console.log('Member checked out successfully');
        loadAttendance(); // Refresh attendance table
    })
    .catch(err => {
        console.error('Error checking out member:', err);
        alert(err.message);
    });
}

// Load Dashboard Stats
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

// Load data when pages are opened
if (window.location.pathname.includes('members.html')) {
    loadMembers();
}

if (window.location.pathname.includes('attendance.html')) {
    loadAttendance();
    
    // Refresh attendance when date changes
    document.getElementById('attendanceDate').addEventListener('change', loadAttendance);
}

if (window.location.pathname.includes('dashboard.html')) {
    loadDashboardStats();
    initCharts();
    
    // Refresh dashboard data
    document.getElementById('refreshDashboard').addEventListener('click', () => {
        loadDashboardStats();
        initCharts();
    });
}