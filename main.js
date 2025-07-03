// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Theme Switcher
    const themeSwitch = document.getElementById('checkbox');
    const themeSwitchMobile = document.getElementById('checkbox-mobile');
    const darkModeStyle = document.getElementById('dark-mode-style');
    
    function toggleDarkMode(isDark) {
        if (isDark) {
            document.body.classList.add('dark-mode');
            darkModeStyle.disabled = false;
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            darkModeStyle.disabled = true;
            localStorage.setItem('theme', 'light');
        }
    }
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        toggleDarkMode(true);
        if (themeSwitch) themeSwitch.checked = true;
        if (themeSwitchMobile) themeSwitchMobile.checked = true;
    }
    
    // Theme switch event listeners
    if (themeSwitch) {
        themeSwitch.addEventListener('change', function() {
            toggleDarkMode(this.checked);
            if (themeSwitchMobile) {
                themeSwitchMobile.checked = this.checked;
            }
        });
    }
    
    if (themeSwitchMobile) {
        themeSwitchMobile.addEventListener('change', function() {
            toggleDarkMode(this.checked);
            if (themeSwitch) {
                themeSwitch.checked = this.checked;
            }
        });
    }
    
    // Show/Hide Password
    const showPasswordBtns = document.querySelectorAll('.show-password');
    showPasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Modal Handling
    const modals = document.querySelectorAll('.modal');
    const modalOpenBtns = document.querySelectorAll('[data-modal]');
    const modalCloseBtns = document.querySelectorAll('.close-modal, .close-modal-btn');
    
    // Open modal
    modalOpenBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            const tabContainer = this.closest('.member-tabs');
            
            // Remove active class from all buttons and content
            tabContainer.querySelectorAll('.tab-btn').forEach(tb => {
                tb.classList.remove('active');
            });
            tabContainer.querySelectorAll('.tab-content').forEach(tc => {
                tc.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Checkin Method Switching
    const methodCards = document.querySelectorAll('.method-card');
    methodCards.forEach(card => {
        card.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            
            // Remove active class from all method cards
            methodCards.forEach(mc => {
                mc.classList.remove('active');
            });
            
            // Hide all method content
            document.querySelectorAll('.checkin-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // Add active class to clicked card and show corresponding content
            this.classList.add('active');
            document.getElementById(`${method}Method`).style.display = 'block';
        });
    });
    
    // Date Range Filter
    const dateRangeBtns = document.querySelectorAll('[data-days]');
    dateRangeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            dateRangeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // Here you would filter data based on the selected days
        });
    });
    
    // Set today's date as default for date inputs
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = today;
        }
    });
    
    // Today button for attendance
    const todayBtn = document.getElementById('todayBtn');
    if (todayBtn) {
        todayBtn.addEventListener('click', function() {
            document.getElementById('attendanceDate').value = today;
        });
    }
    
    // Initialize DataTables if they exist
    if ($.fn.DataTable) {
        $('.display').DataTable({
            responsive: true,
            dom: '<"top"lf>rt<"bottom"ip>',
            language: {
                search: "_INPUT_",
                searchPlaceholder: "Search...",
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Form validation and submission would be handled here
            alert('Form submitted successfully!');
        });
    });
});