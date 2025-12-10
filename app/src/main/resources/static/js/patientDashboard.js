import { createDoctorCard } from './components/doctorCard.js';
import { openModal } from './components/modals.js';
import { getDoctors, filterDoctors } from './services/doctorServices.js';
import { patientLogin, patientSignup } from './services/patientServices.js';

document.addEventListener("DOMContentLoaded", () => {
    loadDoctorCards();
    
    const signupBtn = document.getElementById("patientSignup");
    if (signupBtn) signupBtn.addEventListener("click", () => openModal("patientSignup"));

    const loginBtn = document.getElementById("patientLogin");
    if (loginBtn) loginBtn.addEventListener("click", () => openModal("patientLogin"));
});

async function loadDoctorCards() {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";
    
    try {
        const doctors = await getDoctors();
        renderDoctorCards(doctors);
    } catch (error) {
        console.error("Error loading doctors:", error);
    }
}

// Search and Filter Listeners
document.getElementById("searchBar").addEventListener("input", filterDoctorsOnChange);
document.getElementById("filterTime").addEventListener("change", filterDoctorsOnChange);
document.getElementById("filterSpecialty").addEventListener("change", filterDoctorsOnChange);

async function filterDoctorsOnChange() {
    const name = document.getElementById("searchBar").value.trim() || null;
    const time = document.getElementById("filterTime").value || null;
    const specialty = document.getElementById("filterSpecialty").value || null;
    
    const contentDiv = document.getElementById("content");

    try {
        const doctors = await filterDoctors(name, time, specialty);
        contentDiv.innerHTML = "";
        
        if (doctors && doctors.length > 0) {
            renderDoctorCards(doctors);
        } else {
            contentDiv.innerHTML = "<p>No doctors found with the given filters.</p>";
        }
    } catch (error) {
        console.error("Filter Error:", error);
        contentDiv.innerHTML = "<p>Error filtering doctors.</p>";
    }
}

function renderDoctorCards(doctors) {
    const contentDiv = document.getElementById("content");
    doctors.forEach(doctor => {
        const card = createDoctorCard(doctor);
        contentDiv.appendChild(card);
    });
}

// Patient Signup Handler
window.signupPatient = async function () {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    const data = { name, email, password, phone, address };
    
    const result = await patientSignup(data);
    
    if (result.success) {
        alert("Signup successful! Please login.");
        document.getElementById('modal').style.display = 'none';
        window.location.reload();
    } else {
        alert("Signup failed: " + result.message);
    }
};

// Patient Login Handler
window.loginPatient = async function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const data = { email, password };

    try {
        const response = await patientLogin(data);
        if (response.ok) {
            const result = await response.json();
            localStorage.setItem("token", result.token);
            // Assuming selectRole logic or redirection
            window.location.href = "loggedPatientDashboard.html";
        } else {
            alert("Invalid Login Credentials");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed due to network error.");
    }
};