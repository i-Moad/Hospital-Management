import Service from "../models/Service.js";
import DoctorService from "../models/DoctorService.js";
import ServiceView from "../views/ServiceView.js";
import { closeModal } from "../src/utils/modal.js";
import User from "../models/User.js";

export default class ServiceController {
  constructor() {
    this.view = new ServiceView();
    this.services = Service.getAllServices();
    this.currentPage = 1;
    this.perPage = 10;
    this.currentServiceId = null;

    this.view.setupEvents(this);
    this.render();
  }

  render() {
    this.view.renderServicesTable(this.services, this.currentPage, this.perPage);
    this.view.renderPagination(this.services, this.currentPage, this.perPage);
  }

  /* ===== MODALS ===== */

  openViewModal(id) {
    const service = Service.getServiceById(id);
    if (!service) return;
    this.currentServiceId = id;
    this.view.renderViewServiceModal(service, DoctorService.getDoctorsByService(id));
  }

  openEditModal(id) {
    const service = Service.getServiceById(id);
    if (!service) return;
    this.currentServiceId = id;
    this.view.renderEditServiceModal(service);
  }

  openDeleteModal(id) {
    const service = Service.getServiceById(id);
    if (!service) return;
    this.currentServiceId = id;
    this.view.renderDeleteServiceModal(service);
  }

  openAssignModal(id) {
    const service = Service.getServiceById(id);
    const doctors = User.getAllUsers("doctor");
    if (!service) return;
    this.currentServiceId = id;
    this.view.renderAssignServiceModal(service, doctors);
  }

  deleteService() {
    Service.deleteService(this.currentServiceId);
    closeModal("deleteServiceModal");
    this.services = Service.getAllServices();
    this.render();
  }

  assignService(doctorId) {
    const err = document.getElementById("errorASD");
    err.textContent = "";
    if (!doctorId) {
      err.textContent = "Choose a doctor!";
      return;
    }
    DoctorService.assignDoctor(this.currentServiceId, doctorId);
    closeModal("assignDoctorModal");
  }

  /* ===== PAGINATION ===== */

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.render();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.services.length / this.perPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.render();
    }
  }

  changeServicesPerPage(e) {
    this.perPage = parseInt(e.target.value);
    this.currentPage = 1;
    this.render();
  }

  goToPage(page) {
    this.currentPage = page;
    this.render();
  }

  /* ===== CRUD ===== */

  validateService(serviceData) {
    const errors = this.view.getAddServiceErrorElements();
    this.view.clearAllAddServiceErrors();

    let isValid = true;

    // ===== Service Name =====
    if (!serviceData.serviceName || serviceData.serviceName.trim() === "") {
        this.view.showError(errors.serviceName, "Le nom du service est requis.");
        isValid = false;
    }

    // ===== Description =====
    if (!serviceData.description || serviceData.description.trim() === "") {
        this.view.showError(errors.description, "La description est requise.");
        isValid = false;
    }

    return isValid;
  }

  validateEditService(serviceData) {
    const errors = this.view.getEditServiceErrorElements();
    this.view.clearAllEditServiceErrors();

    let isValid = true;

    // ===== Service Name =====
    if (!serviceData.serviceName || serviceData.serviceName.trim() === "") {
        this.view.showError(errors.serviceName, "Le nom du service est requis.");
        isValid = false;
    }

    // ===== Description =====
    if (!serviceData.description || serviceData.description.trim() === "") {
        this.view.showError(errors.description, "La description est requise.");
        isValid = false;
    }

    return isValid;
  }

  addService(serviceData) {
    if (!this.validateService(serviceData)) return;

    Service.createService(serviceData);

    closeModal("addServiceModal");
  }

  updateService(serviceData) {
    if (!this.validateEditService(serviceData)) return;
    
    Service.updateServiceInfo(this.currentServiceId, serviceData);

    closeModal("editServiceModal");
  }
}
