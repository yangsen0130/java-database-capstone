import { openModal } from './components/modals.js';
import { getDoctors, filterDoctors, saveDoctor } from './services/doctorServices.js';
import { createDoctorCard } from './components/doctorCard.js';

document.getElementById('addDocBtn').addEventListener('click', () => {
    openModal('addDoctor');
});

document.addEventListener("DOMContentLoaded", () => {
    loadDoctorCards();
});

// Load Doctor Cards
async function loadDoctorCards() {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";
    
    const doctors = await getDoctors();
    renderDoctorCards(doctors);
}

// Search and Filter Listeners
document.getElementById("searchBar").addEventListener("input", filterDoctorsOnChange);
document.getElementById("filterTime").addEventListener("change", filterDoctorsOnChange);
document.getElementById("filterSpecialty").addEventListener("change", filterDoctorsOnChange);

async function filterDoctorsOnChange() {
    const name = document.getElementById("searchBar").value.trim() || null;
    const time = document.getElementById("filterTime").value || null;
    const specialty = document.getElementById("filterSpecialty").value || null;

    const doctors = await filterDoctors(name, time, specialty);
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    if (doctors && doctors.length > 0) {
        renderDoctorCards(doctors);
    } else {
        contentDiv.innerHTML = "<p>No doctors found.</p>";
    }
}

function renderDoctorCards(doctors) {
    const contentDiv = document.getElementById("content");
    doctors.forEach(doctor => {
        const card = createDoctorCard(doctor);
        contentDiv.appendChild(card);
    });
}

// Admin Add Doctor Handler
window.adminAddDoctor = async function() {
    const name = document.getElementById('doctorName').value;
    const specialty = document.getElementById('specialization').value;
    const email = document.getElementById('doctorEmail').value;
    const password = document.getElementById('doctorPassword').value;
    const phone = document.getElementById('doctorPhone').value;
    
    // Collect availability checkboxes
    const checkboxes = document.querySelectorAll('input[name="availability"]:checked');
    const availableTimes = Array.from(checkboxes).map(cb => cb.value);

    const token = localStorage.getItem('token');
    if (!token) {
        alert("Session expired. Please login again.");
        return;
    }

    const doctor = { name, specialty, email, password, phone, availableTimes };
    
    const result = await saveDoctor(doctor, token);

    if (result.success) {
        alert("Doctor added successfully!");
        document.getElementById('modal').style.display = "none";
        loadDoctorCards(); // Refresh list
    } else {
        alert("Failed to add doctor: " + result.message);
    }
};