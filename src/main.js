import AdminDashboardController from "../controllers/AdminDashboardController.js";
import AuthController from "../controllers/AuthController.js";
import UserController from "../controllers/UserController.js";

import Auth from "../models/Auth.js";
import Storage from "../models/Storage.js";

const page = document.body.dataset.page;
const session = Storage.load("Session");

// Storage.seed();

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
}

if (page === "Dashboard-Doctor") {
    if (session.role !== "doctor") {
        redirect();
    }
    new UserController();
}
