function renderHeader() {
    const headerDiv = document.getElementById("header");
    
    // 1. Check if on homepage
    if (window.location.pathname.endsWith("/") || window.location.pathname.endsWith("index.html")) {
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
        headerDiv.innerHTML = `
            <header class="header">
                <div class="logo-section">
                    <img src="./assets/images/logo/logo.png" alt="Hospital CRM Logo" class="logo-img">
                    <span class="logo-title">Hospital CMS</span>
                </div>
            </header>`;
        return;
    }

    // 2. Get Role and Token
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    // 3. Check invalid session
    if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
        localStorage.removeItem("userRole");
        alert("Session expired or invalid login. Please log in again.");
        window.location.href = "/";
        return;
    }

    // 4. Build Header Content
    let headerContent = `
        <header class="header">
            <div class="logo-section">
                 <img src="../assets/images/logo/logo.png" alt="Hospital CRM Logo" class="logo-img">
                 <span class="logo-title">Hospital CMS</span>
            </div>
            <nav>`;

    // 5. Inject Role-Specific Buttons
    if (role === "admin") {
        headerContent += `
            <button id="addDocBtn" class="adminBtn" onclick="openModal('addDoctor')">Add Doctor</button>
            <a href="#" onclick="logout()">Logout</a>`;
    } else if (role === "doctor") {
        headerContent += `
            <button class="adminBtn" onclick="selectRole('doctor')">Home</button>
            <a href="#" onclick="logout()">Logout</a>`;
    } else if (role === "patient") {
        headerContent += `
            <button id="patientLogin" class="adminBtn">Login</button>
            <button id="patientSignup" class="adminBtn">Sign Up</button>`;
    } else if (role === "loggedPatient") {
        headerContent += `
            <button id="home" class="adminBtn" onclick="window.location.href='/pages/loggedPatientDashboard.html'">Home</button>
            <button id="patientAppointments" class="adminBtn" onclick="window.location.href='/pages/patientAppointments.html'">Appointments</button>
            <a href="#" onclick="logoutPatient()">Logout</a>`;
    }

    headerContent += `</nav></header>`;

    // 6. Inject HTML
    headerDiv.innerHTML = headerContent;

    // 7. Attach Listeners
    attachHeaderButtonListeners();
}

function attachHeaderButtonListeners() {
    // We can use global functions or attach specific listeners here if IDs exist
    // Note: onclick attributes in HTML string handle most logic above, 
    // but specific listeners for login/signup modals are handled in page-specific scripts usually.
}

function logout() {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    window.location.href = "/";
}

function logoutPatient() {
    localStorage.removeItem("token");
    setRole("patient"); // Revert to unauthenticated patient
    window.location.href = "/pages/patientDashboard.html";
}

// Call renderHeader when the script loads
renderHeader();