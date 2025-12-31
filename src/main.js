import AdminDashboardController from "../controllers/AdminDashboardController.js";
import AuthController from "../controllers/AuthController.js";
import UserController from "../controllers/UserController.js";

import Auth from "../models/Auth.js";
import Storage from "../models/Storage.js";

const page = document.body.dataset.page;
const session = Storage.load("Session");

// Storage.addItem("Users", {
//     CIN: "BK158964",
//     firstName: "Mustapha",
//     lastName: "Ezzit",
//     email: "test@test.com",
//     password: "123456",
//     role: "admin"
// })

// Protect all pages except login
if (!Auth.isAuthenticated() && page !== "Auth") {
    window.location.href = "/src/auth/login.html";
}

// Redirect logged in user from login page to role dashboard
if (page === "Auth" && Auth.isAuthenticated() && session) {
    const dashboards = {
        doctor: "/src/Dashboards/Doctor/index.html",
        admin: "/src/Dashboards/Admin/index.html",
        staff: "/src/Dashboards/Staff/index.html",
    };

    const url = dashboards[session.role];
    if (url) window.location.href = url;
}

if (page === "Auth" && !Auth.isAuthenticated()) {
    new AuthController();
}

if (page === "Dashboard-Admin") {
    new UserController();
    new AdminDashboardController();
}

if (page === "Dashboard-Doctor") {
    new UserController();
}
