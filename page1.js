// Function to switch between student and admin login forms
function showLoginForm(role) {
    // Update active button
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Show/hide forms
    document.getElementById('studentForm').classList.remove('active');
    document.getElementById('adminForm').classList.remove('active');
    document.getElementById(role + 'Form').classList.add('active');
}

// Handle login form submission
async function handleLogin(event, role) {
    event.preventDefault();
    
    let username, password;
    
    if (role === 'student') {
        username = document.getElementById('studentId').value;
        password = document.getElementById('studentPassword').value;
    } else {
        username = document.getElementById('adminUsername').value;
        password = document.getElementById('adminPassword').value;
    }
    
    if (!username || !password) {
        alert('Please enter both ' + (role === 'student' ? 'student ID' : 'username') + ' and password');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ 
                username, 
                password,
                role 
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store user role in localStorage
            localStorage.setItem('userRole', data.user.role);
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('username', data.user.username);
            
            // Redirect to appropriate page
            window.location.href = 'page1.5.html';
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const roleSelect = document.getElementById('role');
    const studentFields = document.getElementById('studentFields');
    const adminFields = document.getElementById('adminFields');

    // Show/hide fields based on role selection
    roleSelect.addEventListener('change', function() {
        if (this.value === 'student') {
            studentFields.style.display = 'block';
            adminFields.style.display = 'none';
        } else if (this.value === 'admin') {
            studentFields.style.display = 'none';
            adminFields.style.display = 'block';
        }
    });

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const role = document.getElementById('role').value;
        const username = role === 'student' 
            ? document.getElementById('studentId').value 
            : document.getElementById('adminUsername').value;
        const password = role === 'student'
            ? document.getElementById('studentPassword').value
            : document.getElementById('adminPassword').value;

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    username,
                    password,
                    role
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Store user role in localStorage
                localStorage.setItem('userRole', data.user.role);
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('username', data.user.username);
                
                // Redirect to appropriate page
                window.location.href = 'page1.5.html';
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        }
    });
});