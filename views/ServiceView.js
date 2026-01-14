import { openModal, closeModal } from "../src/utils/modal.js";

export default class ServiceView {
  constructor() {
    this.tbody = document.getElementById("servicesTableBody");

    // Pagination
    this.startItem = document.getElementById("servicesStartItem");
    this.endItem = document.getElementById("servicesEndItem");
    this.totalItems = document.getElementById("servicesTotalItems");

    this.prevBtn = document.getElementById("prevServicesPage");
    this.nextBtn = document.getElementById("nextServicesPage");
    this.paginationNumbers = document.getElementById(
      "servicesPaginationNumbers"
    );
    this.servicesPerPage = document.getElementById("servicesPerPage");

    // Buttons
    this.addServiceBtn = document.getElementById("addServiceBtn");
    this.submitAddService = document.getElementById("submitAddService");
    this.submitEditService = document.getElementById("submitEditService");
    this.submitASD = document.getElementById("submitAssignServiceDoctor");
    this.cancelEditServiceBtn = document.getElementById("cancelEditServiceBtn");
    this.cancelAddServiceBtn = document.getElementById("cancelAddServiceBtn");
    this.closeAddServiceModal = document.getElementById("closeAddServiceModal");

    // Confirm buttons
    this.confirmDeleteBtn = document.getElementById("confirmDeleteServiceBtn");
    this.confirmAssignBtn = document.getElementById("confirmAssignServiceBtn");

    this.closeViewModalBtn = document.getElementById("closeViewServiceModal");
    this.closeViewModalBtn2 = document.getElementById("closeViewServiceModal2");
    this.closeEditModalBtn = document.getElementById("closeEditServiceModal");
    this.closeDeleteModalBtn = document.getElementById(
      "cancelDeleteServiceBtn"
    );
    this.closeAssignModalBtn = document.getElementById("cancelAssignDoctorBtn");
  }

  getAddServiceErrorElements() {
    return {
      serviceName: document.getElementById("errorAddServiceName"),
      description: document.getElementById("errorAddServiceDescription"),
    };
  }

  getEditServiceErrorElements() {
    return {
      serviceName: document.getElementById("errorEditServiceName"),
      isEnabled: document.getElementById("errorEditStatus"),
      description: document.getElementById("errorEditDescription"),
    };
  }

  clearAllAddServiceErrors() {
    const errors = this.getAddServiceErrorElements();
    Object.values(errors).forEach((el) => (el.textContent = ""));
  }

  clearAllEditServiceErrors() {
    const errors = this.getEditServiceErrorElements();
    Object.values(errors).forEach((el) => (el.textContent = ""));
  }

  showError(el, message) {
    if (el) el.textContent = message;
  }

  /* ================= TABLE ================= */
  renderServicesTable(services, currentPage, perPage) {
    if (!this.tbody) return;

    const startIndex = (currentPage - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, services.length);
    const paginated = services.slice(startIndex, endIndex);

    if (paginated.length === 0) {
      this.tbody.innerHTML = `
      <tr>
        <td colspan="7" class="px-6 py-12 text-center">
          <div class="flex flex-col items-center justify-center">
            <i data-feather="settings" class="w-12 h-12 text-gray-400 mb-4"></i>
            <span class="text-gray-500 mb-4">Aucun service trouvé</span>
            <button id="addFirstServiceBtn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <i data-feather="plus" class="w-4 h-4 inline mr-2"></i>
              Ajouter votre premier service
            </button>
          </div>
        </td>
      </tr>
    `;
      feather.replace();
      return;
    }

    let html = "";
    paginated.forEach((service) => {
      html += `
      <tr class="service-row" data-service-id="${service.serviceId}">
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            ${generateServiceCode(String(service.serviceId).slice(0, 3))}...
          </span>
        </td>
        <td class="px-6 py-4">
          <div class="font-medium text-gray-900">${service.serviceName}</div>
        </td>
        <td class="px-6 py-4 text-gray-500">
          ${service.description}
        </td>
        <td class="px-6 py-4">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            service.isEnabled
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }">
            ${
              service.isEnabled
                ? localStorage.getItem("lang") === "ar"
                  ? "نعم"
                  : localStorage.getItem("lang") === "en"
                  ? "Yes"
                  : "Oui"
                : localStorage.getItem("lang") === "ar"
                ? "لا"
                : localStorage.getItem("lang") === "en"
                ? "No"
                : "Non"
            }

          
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${service.createdAt.split("T")[0]}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex space-x-2">
            <button class="edit-service-btn p-1 text-blue-600 hover:text-blue-800 transition-colors" title="Modifier" data-service-id="${
              service.serviceId
            }">
              <i data-feather="edit" class="w-4 h-4"></i>
            </button>
            <button class="delete-service-btn p-1 text-red-600 hover:text-red-800 transition-colors" title="Supprimer" data-service-id="${
              service.serviceId
            }">
              <i data-feather="trash" class="w-4 h-4"></i>
            </button>
            <button class="view-service-btn p-1 text-green-600 hover:text-green-800 transition-colors" title="Voir détails" data-service-id="${
              service.serviceId
            }">
              <i data-feather="eye" class="w-4 h-4"></i>
            </button>
            <button class="assign-service-btn p-1 text-purple-600 hover:text-purple-800 transition-colors" title="Assigner" data-service-id="${
              service.serviceId
            }">
              <i data-feather="user-plus" class="w-4 h-4"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
    });

    this.tbody.innerHTML = html;
    this.startItem.textContent = startIndex + 1;
    this.endItem.textContent = endIndex;
    this.totalItems.textContent = services.length;

    feather.replace();
  }

  renderPagination(filteredUsersData, currentPage, usersPerPage) {
    if (!this.paginationNumbers) return;

    const totalPages = Math.ceil(filteredUsersData.length / usersPerPage);
    let html = "";

    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="users-page-btn" data-page="${i}" ${
        i === currentPage ? "disabled" : ""
      }>${i}</button>`;
    }
    this.paginationNumbers.innerHTML = html;

    // Disable/enable Prev/Next buttons
    if (this.prevBtn) this.prevBtn.disabled = currentPage === 1;
    if (this.nextBtn)
      this.nextBtn.disabled = currentPage === totalPages || totalPages === 0;
  }

  /* ================= MODALS ================= */

  renderViewServiceModal(service, assignedDoctors) {
    document.getElementById("hiddenServiceId").value = service.serviceId;
    document.getElementById("viewServiceName").textContent =
      service.serviceName;
    document.getElementById("viewServiceId").textContent = service.serviceId;
let statusText = "";

if (service.isEnabled) {
  if (localStorage.getItem("lang") === "fr") statusText = "Actif";
  else if (localStorage.getItem("lang") === "en") statusText = "Active";
  else if (localStorage.getItem("lang") === "ar") statusText = "نشط"; // "Active" en arabe
} else {
  if (localStorage.getItem("lang") === "fr") statusText = "Inactif";
  else if (localStorage.getItem("lang") === "en") statusText = "Inactive";
  else if (localStorage.getItem("lang") === "ar") statusText = "غير نشط"; // "Inactive" en arabe
}

document.getElementById("viewServiceStatus").textContent = statusText;
    document.getElementById("viewServiceCreatedAt").textContent =
      service.createdAt.split("T")[0];
    document.getElementById("viewServiceDescription").textContent =
      service.description || "-";
    document.getElementById("viewServiceDoctors").textContent =
      assignedDoctors.length;

    // Open the modal
    openModal("viewServiceModal");
  }

  renderEditServiceModal(service) {
    document.getElementById("editServiceId").value = service.serviceId;
    document.getElementById("editServiceName").value = service.serviceName;
    document.getElementById("editServiceStatus").value = service.isEnabled
      ? "1"
      : "0";
    document.getElementById("editServiceDescription").value =
      service.description || "";

    openModal("editServiceModal");
  }

  renderDeleteServiceModal(service) {
    document.getElementById("deleteServiceId").value = service.serviceId;
    document.getElementById("deleteServiceName").textContent =
      service.serviceName;
    document.getElementById("deleteServiceInfo").textContent =
      service.description;
    openModal("deleteServiceModal");
  }

  renderAssignServiceModal(service, doctors) {
    document.getElementById("assignServiceId").value = service.serviceId;
    document.getElementById("assignServiceName").textContent =
      service.serviceName;
    document.getElementById("assignServiceInfo").textContent =
      service.description;

    // Populate doctor select dynamically if needed
    const doctorSelect = document.getElementById("assignDoctorSelect");
    (doctors || []).forEach((doc) => {
      const option = document.createElement("option");
      option.value = doc.userId;
      option.textContent = `${doc.firstName} ${doc.lastName}`;
      doctorSelect.appendChild(option);
    });

    openModal("assignDoctorModal");
  }

  /* ================= EVENTS ================= */

  setupEvents(controller) {
    if (this.addServiceBtn)
      this.addServiceBtn.addEventListener("click", () =>
        openModal("addServiceModal")
      );

    if (this.confirmDeleteBtn)
      this.confirmDeleteBtn.addEventListener("click", () =>
        controller.deleteService()
      );

    if (this.confirmAssignBtn)
      this.confirmAssignBtn.addEventListener("click", () =>
        controller.assignService()
      );

    if (this.closeViewModalBtn)
      this.closeViewModalBtn.addEventListener("click", () =>
        closeModal("viewServiceModal")
      );
    if (this.closeViewModalBtn2)
      this.closeViewModalBtn2.addEventListener("click", () =>
        closeModal("viewServiceModal")
      );
    if (this.closeEditModalBtn)
      this.closeEditModalBtn.addEventListener("click", () =>
        closeModal("editServiceModal")
      );
    if (this.closeDeleteModalBtn)
      this.closeDeleteModalBtn.addEventListener("click", () =>
        closeModal("deleteServiceModal")
      );
    if (this.closeAssignModalBtn)
      this.closeAssignModalBtn.addEventListener("click", () =>
        closeModal("assignDoctorModal")
      );

    if (this.submitAddService)
      this.submitAddService.addEventListener("click", () =>
        controller.addService(this.getServiceAddData())
      );

    if (this.submitEditService)
      this.submitEditService.addEventListener("click", () =>
        controller.updateService(this.getServiceEditData())
      );

    if (this.submitASD)
      this.submitASD.addEventListener("click", () =>
        controller.assignService(
          document.getElementById("assignDoctorSelect").value
        )
      );

    if (this.cancelAddServiceBtn) this.cancelAddServiceBtn.addEventListener("click", () => closeModal("addServiceModal"));
    if (this.closeAddServiceModal) this.closeAddServiceModal.addEventListener("click", () => closeModal("addServiceModal"));

    // TABLE BUTTONS (delegated like UserView)
    document.addEventListener("click", (e) => {
      const viewBtn = e.target.closest(".view-service-btn");
      const editBtn = e.target.closest(".edit-service-btn");
      const deleteBtn = e.target.closest(".delete-service-btn");
      const assignBtn = e.target.closest(".assign-service-btn");

      if (viewBtn) controller.openViewModal(viewBtn.dataset.serviceId);
      if (editBtn) controller.openEditModal(editBtn.dataset.serviceId);
      if (deleteBtn) controller.openDeleteModal(deleteBtn.dataset.serviceId);
      if (assignBtn) controller.openAssignModal(assignBtn.dataset.serviceId);
    });

    if (this.prevBtn)
      this.prevBtn.addEventListener("click", () => controller.prevPage());
    if (this.nextBtn)
      this.nextBtn.addEventListener("click", () => controller.nextPage());
    if (this.servicesPerPage)
      this.servicesPerPage.addEventListener("change", (e) =>
        controller.changeServicesPerPage(e)
      );

    this.paginationNumbers.addEventListener("click", (e) => {
      if (e.target.dataset.page)
        controller.goToPage(Number(e.target.dataset.page));
    });
  }

  /* ================= GET DATA ================= */

  getServiceAddData() {
    return {
      serviceName: document.getElementById("addServiceName").value,
      description: document.getElementById("addServiceDescription").value,
    };
  }

  getServiceEditData() {
    return {
      serviceName: document.getElementById("editServiceName").value,
      isEnabled: parseInt(document.getElementById("editServiceStatus").value),
      description: document.getElementById("editServiceDescription").value,
    };
  }
}
