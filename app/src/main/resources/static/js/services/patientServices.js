import { API_BASE_URL } from "../config/config.js";

const PATIENT_API = API_BASE_URL + '/patient';

// Patient Signup
export async function patientSignup(data) {
    try {
        // 修正：后端映射是 POST /patient，去除多余的 /signup
        const response = await fetch(`${PATIENT_API}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        return { success: response.ok, message: result.message };
    } catch (error) {
        console.error("Error signing up:", error);
        return { success: false, message: "Network error occurred." };
    }
}

// Patient Login (此函数路径 /login 正确，保持不变)
export async function patientLogin(data) {
    try {
        const response = await fetch(`${PATIENT_API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}

// Fetch Logged-in Patient Data - 【这里修复了你的报错】
export async function getPatientData(token) {
    try {
        // 修正1：后端映射是 GET /patient/{token}，去除多余的 /details
        const response = await fetch(`${PATIENT_API}/${token}`);
        if (response.ok) {
            const data = await response.json();
            // 修正2：后端返回结构是 { "patient": Object }，前端需要提取里面的 patient
            return data.patient; 
        }
        return null;
    } catch (error) {
        console.error("Error fetching patient details:", error);
        return null;
    }
}

// Fetch Patient Appointments
export async function getPatientAppointments(id, token, user) {
    try {
        // 修正：后端映射是 GET /patient/{id}/{token}
        // 原代码多了 /appointments 和 /user，会导致获取列表失败
        const response = await fetch(`${PATIENT_API}/${id}/${token}`);
        if (response.ok) {
            const data = await response.json();
            return data.appointments || []; 
        }
        return [];
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return [];
    }
}

// Filter Appointments
export async function filterAppointments(condition, name, token) {
    try {
        // 修正：后端映射是 GET /patient/filter/...
        // 原代码多了 /appointments
        const response = await fetch(`${PATIENT_API}/filter/${condition}/${name}/${token}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        return [];
    } catch (error) {
        console.error("Error filtering appointments:", error);
        alert("An unexpected error occurred.");
        return [];
    }
}