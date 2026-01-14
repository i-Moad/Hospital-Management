import { openModal, closeModal } from "../src/utils/modal.js";

export default class AppointmentView {
  constructor() {
    // Table
    this.tbody = document.getElementById("appointmentsTableBody");
    this.paginationNumbers = document.getElementById(
      "appointmentsPaginationNumbers"
    );
    this.startItem = document.getElementById("appointmentsStartItem");
    this.endItem = document.getElementById("appointmentsEndItem");
    this.totalItems = document.getElementById("appointmentsTotalItems");

    // Filters
    this.filterDate = document.getElementById("filterDate");
    this.filterStatus = document.getElementById("filterAppointmentStatus");
    this.filterDoctor = document.getElementById("filterDoctor");

    // Pagination
    this.prevBtn = document.getElementById("prevAppointmentsPage");
    this.nextBtn = document.getElementById("nextAppointmentsPage");
    this.perPageSelect = document.getElementById("appointmentsPerPage");

    // Add
    this.addBtn = document.getElementById("addAppointmentBtn");
    this.addForm = document.getElementById("addAppointmentForm");

    // View/Edit
    this.viewForm = document.getElementById("viewAppointmentForm");
    this.cancelBtn = document.getElementById("cancelAppointmentBtn");

    // Close buttons
    this.closeAdd = document.getElementById("closeAddAppointmentModal");
    this.cancelAdd = document.getElementById("cancelAddAppointmentBtn");
    this.closeView1 = document.getElementById("closeViewAppointmentModal");
    this.closeView2 = document.getElementById("closeViewAppointmentModal2");

    this.addAppointmentP = document.getElementById("addAppointmentPatient");
    this.addAppointmentD = document.getElementById("addAppointmentDoctor");
  }

  getEditAppointmentErrorElements() {
    return {
      date: document.getElementById("errorEditDate"),
      time: document.getElementById("errorEditTime"),
    };
  }

  clearEditAddAppointmentErrors() {
    const errors = this.getEditAppointmentErrorElements();
    Object.values(errors).forEach((el) => (el.textContent = ""));
  }

  getAddAppointmentErrorElements() {
    return {
      patient: document.getElementById("errorAddPatient"),
      doctor: document.getElementById("errorAddDoctor"),
      date: document.getElementById("errorAddDate"),
      time: document.getElementById("errorAddTime"),
    };
  }

  clearAllAddAppointmentErrors() {
    const errors = this.getAddAppointmentErrorElements();
    Object.values(errors).forEach((el) => (el.textContent = ""));
  }

  showError(el, message) {
    if (el) el.textContent = message;
  }

  // ---------------- RENDER ----------------

  renderAppointmentsList(appointments) {
    const tbody = document.getElementById("appointments-list");
    if (tbody) tbody.innerHTML = "";

    const sortedAppointments = [...appointments].sort(
      (a, b) =>
        new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime)
    );

    sortedAppointments.forEach((appointment) => {
      const tr = document.createElement("tr");

      let statusClass = "";
      let statusText = "";

      switch (appointment.status) {
        case "confirmed":
          statusClass = "status-confirmed";
          statusText = "Confirmé";
          break;
        case "pending":
          statusClass = "status-pending";
          statusText = "En_attente";
          break;
        case "cancelled":
          statusClass = "status-cancelled";
          statusText = "Annulé";
          break;
      }

      tr.innerHTML = `
                <td class="px-4 py-3 whitespace-nowrap">
                    ${formatDateTime(appointment.appointmentDateTime)}
                </td>

                <td class="px-4 py-3 whitespace-nowrap">
                    ${appointment.patientName}
                </td>

                <td class="px-4 py-3 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs rounded-full ${statusClass}" data-i18n="${statusText}">
                    </span>
                </td>

                <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex space-x-2">
                        ${
                          appointment.status === "pending"
                            ? `
                            <button
                                data-action="confirm"
                                data-id="${appointment.appointmentId}"
                                class="text-green-600 hover:text-green-800 transition-colors p-1"
                                title="Confirmer">
                                <i data-feather="check" class="w-4 h-4"></i>
                            </button>
                        `
                            : ""
                        }

                        ${
                          appointment.status !== "cancelled"
                            ? `
                            <button
                                data-action="cancel"
                                data-id="${appointment.appointmentId}"
                                class="text-red-600 hover:text-red-800 transition-colors p-1"
                                title="Annuler">
                                <i data-feather="x" class="w-4 h-4"></i>
                            </button>
                        `
                            : ""
                        }
                    </div>
                </td>

            `;

      tbody.appendChild(tr);
    });

    if (typeof feather !== "undefined") {
      feather.replace();
    }
  }

  renderTable(data, currentPage, perPage) {
    if (!this.tbody) return;

    const start = (currentPage - 1) * perPage;
    const end = Math.min(start + perPage, data.length);
    const slice = data.slice(start, end);

    const lang = localStorage.getItem("lang") || "en";

    
    const noAppointmentsText =
      lang === "fr"
        ? "Aucun rendez-vous trouvé"
        : lang === "ar"
        ? "لم يتم العثور على مواعيد"
        : "No appointments found";

    if (!slice.length) {
      this.tbody.innerHTML = `
        <tr>
          <td colspan="7" class="px-6 py-12 text-center text-gray-500">
            ${noAppointmentsText}
          </td>
        </tr>
      `;
      return;
    }

    this.tbody.innerHTML = slice
      .map((a) => {
        const [date, time] = a.appointmentDateTime.split("T");

        const statusClasses = {
          pending: "bg-yellow-100 text-yellow-800",
          confirmed: "bg-green-100 text-green-800",
          cancelled: "bg-red-100 text-red-800",
          completed: "bg-blue-100 text-blue-800",
        };

        return `
        <tr data-id="${a.appointmentId}" class="hover:bg-gray-50 transition">
          
          <!-- ID -->
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              ${generatePatientCode(String(a.appointmentId).slice(0, 3))}...
            </span>
          </td>

          <!-- Patient -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">
              ${a.patientName}
            </div>
          </td>

          <!-- Doctor -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              ${a.doctorName}
            </div>
          </td>

          <!-- Date & Time -->
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${date} ${time.slice(0, 5)}
          </td>

          <!-- Status -->
<td class="px-6 py-4 whitespace-nowrap">
  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
    ${statusClasses[a.status] || "bg-gray-100 text-gray-800"}">
    ${
      a.status === "pending"
        ? localStorage.getItem("lang") === "ar"
          ? "قيد الانتظار"
          : localStorage.getItem("lang") === "en"
          ? "Pending"
          : "En attente"
        : a.status === "confirmed"
        ? localStorage.getItem("lang") === "ar"
          ? "مؤكد"
          : localStorage.getItem("lang") === "en"
          ? "Confirmed"
          : "Confirmé"
        : a.status === "cancelled"
        ? localStorage.getItem("lang") === "ar"
          ? "ملغى"
          : localStorage.getItem("lang") === "en"
          ? "Cancelled"
          : "Annulé"
        : a.status === "completed"
        ? localStorage.getItem("lang") === "ar"
          ? "مكتمل"
          : localStorage.getItem("lang") === "en"
          ? "Completed"
          : "Terminé"
        : a.status
    }
  </span>
</td>


          <!-- Actions -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center pl-4 space-x-2">
              <button
                class="edit-appointment-btn p-1 text-blue-600 hover:text-blue-800 transition-colors"
                title="Modifier">
                <i data-feather="edit" class="w-4 h-4"></i>
              </button>
            </div>
          </td>

        </tr>
      `;
      })
      .join("");

    this.startItem.textContent = data.length ? start + 1 : 0;
    this.endItem.textContent = end;
    this.totalItems.textContent = data.length;

    feather.replace();
  }

  renderPagination(data, currentPage, perPage) {
    if (!this.paginationNumbers) return;

    const pages = Math.ceil(data.length / perPage);
    let html = "";

    for (let i = 1; i <= pages; i++) {
      html += `<button data-page="${i}" ${
        i === currentPage ? "disabled" : ""
      }>${i}</button>`;
    }

    this.paginationNumbers.innerHTML = html;

    this.prevBtn.disabled = currentPage === 1;
    this.nextBtn.disabled = currentPage === pages || pages === 0;
  }

  // ---------------- MODALS ----------------

  closeAddModal() {
    closeModal("addAppointmentModal");
  }

  openViewModal() {
    openModal("viewAppointmentModal");
  }

  closeViewModal() {
    closeModal("viewAppointmentModal");
  }

  fillViewModal(appointment) {
    document.getElementById("viewAppointmentId").value =
      appointment.appointmentId;
    document.getElementById("viewAppointmentPatient").value =
      appointment.patientName;

    appointment.allDoctors.forEach((doc) => {
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = doc.fullName;

      document.getElementById("viewAppointmentDoctor").appendChild(option);
    });

    document.getElementById("viewAppointmentDoctor").value =
      appointment.doctorId;

    const [date, time] = appointment.appointmentDateTime.split("T");
    document.getElementById("viewAppointmentDate").value = date;
    document.getElementById("viewAppointmentTime").value = time.slice(0, 5);

    // document.getElementById("viewAppointmentReason").value = appointment.reason || "";
    document.getElementById("viewAppointmentStatus").value = appointment.status;

    this.openViewModal();
  }

  // ---------------- EVENTS ----------------

  setupEvents(controller) {
    if (this.filterDate)
      this.filterDate.addEventListener("change", () =>
        controller.applyFilters()
      );
    if (this.filterStatus)
      this.filterStatus.addEventListener("change", () =>
        controller.applyFilters()
      );
    if (this.filterDoctor)
      this.filterDoctor.addEventListener("change", () =>
        controller.applyFilters()
      );

    if (this.prevBtn)
      this.prevBtn.addEventListener("click", () => controller.prevPage());
    if (this.nextBtn)
      this.nextBtn.addEventListener("click", () => controller.nextPage());

    if (this.perPageSelect)
      this.perPageSelect.addEventListener("change", (e) =>
        controller.changePerPage(e)
      );

    if (this.addBtn)
      this.addBtn.addEventListener("click", () => controller.openAddModal());

    if (this.addForm)
      this.addForm.addEventListener("submit", (e) => controller.create(e));

    if (this.viewForm)
      this.viewForm.addEventListener("submit", (e) => controller.update(e));

    if (this.cancelBtn)
      this.cancelBtn.addEventListener("click", () => controller.cancel());

    document.addEventListener("click", (e) => {
      const row = e.target.closest("tr[data-id]");
      if (!row) return;

      if (e.target.closest(".view-appointment-btn"))
        controller.openView(row.dataset.id);

      if (e.target.closest(".edit-appointment-btn"))
        controller.openView(row.dataset.id);
    });

    // Close buttons
    this.closeAdd?.addEventListener("click", () => this.closeAddModal());
    this.cancelAdd?.addEventListener("click", () => this.closeAddModal());
    this.closeView1?.addEventListener("click", () => this.closeViewModal());
    this.closeView2?.addEventListener("click", () => this.closeViewModal());

    const tbody = document.getElementById("appointments-list");

    if (tbody) {
      tbody.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const action = btn.dataset.action;
        const id = parseInt(btn.dataset.id);

        if (!action || !id) return;

        // call the controller methods
        if (action === "confirm") this.onConfirm && this.onConfirm(id);
        if (action === "cancel") this.onCancel && this.onCancel(id);
      });
    }
  }
}
