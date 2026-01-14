import AdminDashboardController from "../controllers/AdminDashboardController.js";
import AppointmentController from "../controllers/AppointmentController.js";
import AuthController from "../controllers/AuthController.js";
import DoctorDashboardController from "../controllers/DoctorDashboardController.js";
import ServiceController from "../controllers/ServiceController.js";
import SettingController from "../controllers/SettingController.js";
import StaffDashboardController from "../controllers/StaffDashboardController.js";
import UserController from "../controllers/UserController.js";

import Auth from "../models/Auth.js";
import Storage from "../models/Storage.js";
import StaffDashboardView from "../views/StaffDashboardView.js";

const page = document.body.dataset.page;
const session = Storage.load("Session");

const keys = [
    "Users",
    "Services",
    "Prescriptions",
    "MedicalNotes",
    "HospitalSetting",
    "DoctorServices",
    "Appointments",
    "AppointmentRequests"
];

// Check if any key is "missing" (empty array)
if (keys.some(key => Storage.load(key).length === 0)) {
    // Clear all keys
    keys.forEach(key => Storage.clear(key));

    // Seed storage
    Storage.seed();

    setTimeout(() => {
        window.location.reload();
    }, 500)
}

function redirect() {
    const dashboards = {
        doctor: "/src/Dashboards/Doctor/index.html",
        admin: "/src/Dashboards/Admin/index.html",
        staff: "/src/Dashboards/Staff/index.html",
    };

    const url = dashboards[session.role];
    if (url) window.location.href = url;
}

// Protect all pages except login
if (!Auth.isAuthenticated() && page !== "Auth") {
    window.location.href = "/src/auth/login.html";
}

// Redirect logged in user from login page to role dashboard
if (page === "Auth" && Auth.isAuthenticated() && session) {
    redirect();
}

if (page === "Auth" && !Auth.isAuthenticated()) {
    new AuthController();
}

if (page === "Dashboard-Admin") {
    if (session.role !== "admin") {
        redirect();
    }
    new UserController();
    new AdminDashboardController();
    new ServiceController();
    new SettingController();
}

if (page === "Dashboard-Doctor") {
    if (session.role !== "doctor") {
        redirect();
    }
    new UserController();
    new DoctorDashboardController();
    new AppointmentController();
}

if (page === "Dashboard-Staff") {
    if (session.role !== "staff") {
        redirect();
    }
    new UserController();
    new StaffDashboardController();
    new AppointmentController();
}
