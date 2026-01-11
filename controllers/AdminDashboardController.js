import AdminDashboardView from "../views/AdminDashboardView.js";
import AdminStats from "../models/AdminStats.js";

export default class AdminDashboardController {
  constructor() {
    this.view = new AdminDashboardView();
    this.init();
  }

  init() {
    const counts = AdminStats.getCounts();

    this.view.renderUsersChart(counts);
    this.view.renderUserRolesChart(counts);
  }
}