import { getAllAppointments } from './services/appointmentRecordService.js';
import { createPatientRow } from './components/patientRows.js';

const patientTableBody = document.getElementById('patientTableBody');
let selectedDate = new Date().toISOString().split('T')[0]; // Today YYYY-MM-DD
const token = localStorage.getItem('token');
let patientName = "null";

document.addEventListener("DOMContentLoaded", () => {
    // Call renderContent() if defined globally in render.js
    if (typeof renderContent === "function") renderContent();
    loadAppointments();
});

// Search Bar
const searchBar = document.getElementById('searchBar');
if (searchBar) {
    searchBar.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        patientName = val.length > 0 ? val : "null";
        loadAppointments();
    });
}

// Today Button
const todayBtn = document.getElementById('todayButton');
if (todayBtn) {
    todayBtn.addEventListener('click', () => {
        selectedDate = new Date().toISOString().split('T')[0];
        const datePicker = document.getElementById('datePicker');
        if (datePicker) datePicker.value = selectedDate;
        loadAppointments();
    });
}

// Date Picker
const datePicker = document.getElementById('datePicker');
if (datePicker) {
    datePicker.addEventListener('change', (e) => {
        selectedDate = e.target.value;
        loadAppointments();
    });
}

async function loadAppointments() {
    try {
        // 获取后端响应（这是一个包含 appointments 字段的对象）
        const response = await getAllAppointments(selectedDate, patientName, token);
        
        // 修正1：从对象中提取数组
        const appointments = response.appointments; 
        
        patientTableBody.innerHTML = "";

        if (!appointments || appointments.length === 0) {
            patientTableBody.innerHTML = `<tr><td colspan="5">No Appointments found for today.</td></tr>`;
        } else {
            appointments.forEach(app => {
                // 修正2：将 AppointmentDTO 映射为 createPatientRow 所需的结构
                // DTO字段: patientName, patientPhone... -> 组件字段: name, phone...
                const patientData = {
                    id: app.patientId,
                    name: app.patientName,
                    phone: app.patientPhone,
                    email: app.patientEmail
                };

                // 修正3：传入所有必要参数 (patientData, appointmentId, doctorId)
                // 这样生成的“添加处方”和“查看病历”按钮才能有正确的链接
                const row = createPatientRow(patientData, app.id, app.doctorId); 
                patientTableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error("Error loading appointments:", error);
        patientTableBody.innerHTML = `<tr><td colspan="5">Error loading appointments. Try again later.</td></tr>`;
    }
}