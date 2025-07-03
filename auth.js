// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Auth State Listener
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        console.log('User logged in:', user.email);
        // Redirect to dashboard or update UI
        if (!window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        // User is signed out
        console.log('User not logged in');
        // Redirect to login page if not already there
        if (!window.location.pathname.includes('login.html') && 
            !window.location.pathname.includes('registration.html') && 
            !window.location.pathname.includes('index.html')) {
            window.location.href = 'login.html';
        }
    }
});

// Login Function
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        
        const email = loginForm['email'].value;
        const password = loginForm['password'].value;
        
        auth.signInWithEmailAndPassword(email, password)
            .then(cred => {
                console.log('Login successful:', cred.user);
                // Reset form
                loginForm.reset();
            })
            .catch(err => {
                console.error('Login error:', err);
                alert(err.message);
            });
    });
}

// Registration Function
const registrationForm = document.getElementById('registrationForm');
if (registrationForm) {
    registrationForm.addEventListener('submit', e => {
        e.preventDefault();
        
        const email = registrationForm['email'].value;
        const password = registrationForm['password'].value;
        const fullName = registrationForm['fullName'].value;
        const phone = registrationForm['phone'].value;
        const membership = registrationForm['membership'].value;
        
        // Create user
        auth.createUserWithEmailAndPassword(email, password)
            .then(cred => {
                // Add user data to Firestore
                return db.collection('users').doc(cred.user.uid).set({
                    fullName,
                    email,
                    phone,
                    membership,
                    joinDate: new Date(),
                    status: 'active'
                });
            })
            .then(() => {
                console.log('Registration successful');
                alert('Registration successful! You can now login.');
                window.location.href = 'login.html';
            })
            .catch(err => {
                console.error('Registration error:', err);
                alert(err.message);
            });
    });
}

// Logout Function
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', e => {
        e.preventDefault();
        auth.signOut()
            .then(() => {
                console.log('User signed out');
                window.location.href = 'index.html';
            })
            .catch(err => {
                console.error('Logout error:', err);
            });
    });
}