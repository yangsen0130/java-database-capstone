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
const searchBar = document.getElementById("searchBar");
if(searchBar) searchBar.addEventListener("input", filterDoctorsOnChange);

const filterTime = document.getElementById("filterTime");
if(filterTime) filterTime.addEventListener("change", filterDoctorsOnChange);

const filterSpecialty = document.getElementById("filterSpecialty");
if(filterSpecialty) filterSpecialty.addEventListener("change", filterDoctorsOnChange);

async function filterDoctorsOnChange() {
    const name = document.getElementById("searchBar").value.trim() || null;
    const time = document.getElementById("filterTime").value || null;
    const specialty = document.getElementById("filterSpecialty").value || null;
    
    const contentDiv = document.getElementById("content");

    try {
        const doctors = await filterDoctors(name, time, specialty);
        contentDiv.innerHTML = "";
        
        // 这里的逻辑适配我们之前修正过的 doctorServices.js 返回结构
        if (doctors && doctors.doctors && doctors.doctors.length > 0) {
            renderDoctorCards(doctors.doctors);
        } else if (Array.isArray(doctors) && doctors.length > 0) {
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

// Patient Login Handler - CRITICAL FIX HERE
window.loginPatient = async function () {
    // 使用 identifier 来匹配后端 DTO
    const identifier = document.getElementById("email").value; 
    const password = document.getElementById("password").value;
    
    // 注意：后端 Login DTO 字段名为 identifier
    const data = { identifier, password }; 

    try {
        const response = await patientLogin(data);
        if (response.ok) {
            const result = await response.json();
            
            // 1. 保存 Token
            localStorage.setItem("token", result.token);
            
            // 2. 关键修复：必须保存用户角色，否则 Header 和预约功能无法识别身份
            localStorage.setItem("userRole", "loggedPatient"); 

            // 3. 跳转到登录后的仪表盘
            window.location.href = "loggedPatientDashboard.html";
        } else {
            alert("Invalid Login Credentials");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed due to network error.");
    }
};