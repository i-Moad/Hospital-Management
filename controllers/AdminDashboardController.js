import AdminDashboardView from "../views/AdminDashboardView.js";
import AdminStats from "../models/AdminStats.js";

export default class AdminDashboardController {
  constructor() {
    this.view = new AdminDashboardView();
    this.init();
  }

  init() {
    const counts = AdminStats.getCounts();
    const occupation = AdminStats.getOccupationRate();

    this.view.renderUsersChart(counts);
    this.view.renderOccupationChart(occupation);
  }
}