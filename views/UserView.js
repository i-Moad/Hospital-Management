import { openModal, closeModal } from "../src/utils/modal.js";

export default class UserView {
  constructor() {
    // User menu
    this.menuUsername = document.getElementById("dropdownUserName");
    this.menuEmail = document.getElementById("dropdownUserEmail");
    this.menuLogout = document.getElementById("logout");
    this.avatarUsername = document.getElementById("userFullName");
    this.avatarRole = document.getElementById("userRole");
    this.avatarContainer = document.getElementById("avatar");

    // Users table
    this.tbody = document.getElementById("usersTableBody");
    this.ptbody = document.getElementById("patientsTableBody");
    this.paginationNumbers = document.getElementById("usersPaginationNumbers");
    this.startItem = document.getElementById("usersStartItem");
    this.endItem = document.getElementById("usersEndItem");
    this.totalItems = document.getElementById("usersTotalItems");

    // Add User
    this.addUserData = document.getElementById("addUser");

    // Edit User
    this.editUser = document.getElementById("editUser");
    this.addEditEmergencyContactBtn = document.getElementById(
      "addEditEmergencyContactBtn"
    );
    this.editEmergencyContactsContainer = document.getElementById(
      "editEmergencyContactsContainer"
    );
    this.editStaffBtn = document.getElementById("saveProfileBtn");

    // Filters
    this.filterRole = document.getElementById("filterRole");
    this.filterStatus = document.getElementById("filterStatus");
    this.searchUsers = document.getElementById("searchUsers");

    // Pagination controls
    this.prevBtn = document.getElementById("prevUsersPage");
    this.nextBtn = document.getElementById("nextUsersPage");
    this.usersPerPageSelect = document.getElementById("usersPerPage");

    // Forms & buttons
    this.addUserBtn = document.getElementById("addUserBtn");
    this.addUserForm = document.getElementById("addUserForm");
    this.editUserForm = document.getElementById("editUserForm");
    this.confirmDeleteBtn = document.getElementById("confirmDeleteUserBtn");

    // Modal close/cancel
    this.closeAddModal = document.getElementById("closeAddUserModal");
    this.cancelAddBtn = document.getElementById("cancelAddUserBtn");
    this.closeEditModal = document.getElementById("closeEditUserModal");
    this.cancelEditBtn = document.getElementById("cancelEditUserBtn");
    this.closeViewModal1 = document.getElementById("closeViewUserModal");
    this.closeViewModal2 = document.getElementById("closeViewUserModal2");
    this.cancelDeleteBtn = document.getElementById("cancelDeleteUserBtn");
    this.editFromViewBtn = document.getElementById("editFromViewUserBtn");
    this.closeAddPatientModal = document.getElementById("closeAddPatientModal");
  }

  getAllEditStaffElements() {
    return {
      email: document.getElementById("errorEditStaffEmail"),
      phone: document.getElementById("errorEditStaffPhone"),
      address: document.getElementById("errorEditStaffAddress"),
    };
  }

  clearAllEditStaffErrors() {
    const errors = this.getAllEditStaffElements();
    Object.values(errors).forEach((el) => (el.textContent = ""));
  }

  showStaffError(el, message) {
    if (el) el.textContent = message;
  }

  showError(element, message) {
    element.innerHTML = `<div class="text-red-600">${message}</div>`;
  }

  getUserErrorElements() {
    return {
      firstName: document.getElementById("errorAddFirstName"),
      lastName: document.getElementById("errorAddLastName"),
      CIN: document.getElementById("errorAddCIN"),
      email: document.getElementById("errorAddEmail"),
      phone: document.getElementById("errorAddPhone"),
      password: document.getElementById("errorAddPassword"),
      confirmPassword: document.getElementById("errorAddConfirmPassword"),
      address: document.getElementById("errorAddAddress"),
    };
  }

  getEditUserErrorElements() {
    return {
      firstName: document.getElementById("errorEditFirstName"),
      lastName: document.getElementById("errorEditLastName"),
      CIN: document.getElementById("errorEditCIN"),
      email: document.getElementById("errorEditEmail"),
      phone: document.getElementById("errorEditPhone"),
      address: document.getElementById("errorEditAddress"),
    };
  }

  getEmergencyContactErrors() {
    return document.querySelectorAll("#emergencyContactsContainer > div");
  }

  getEditEmergencyContactErrors() {
    return document.querySelectorAll("#editEmergencyContactsContainer > div");
  }

  clearAllErrors() {
    document
      .querySelectorAll(
        "p[id^='error'], .error-firstName, .error-lastName, .error-phone, .error-relationship"
      )
      .forEach((p) => (p.innerHTML = ""));
  }

  clearAllEditErrors() {
    document
      .querySelectorAll(
        "p[id^='error'], .error-edit-firstName, .error-edit-lastName, .error-edit-phone, .error-edit-relationship"
      )
      .forEach((p) => (p.innerHTML = ""));
  }

  // --- Render methods ---
  renderCurrUserInfo(session) {
    if (!session) return;
    const fullName = `${session.lastName} ${session.firstName}`;
    if (this.menuUsername) this.menuUsername.textContent = fullName;
    if (this.avatarUsername) this.avatarUsername.textContent = fullName;
    if (this.menuEmail) this.menuEmail.textContent = session.email;
    if (this.avatarRole) {
      if (session.role === "admin") {
        this.avatarRole.textContent =
          localStorage.getItem("lang") === "ar"
            ? "مسؤول"
            : localStorage.getItem("lang") === "en"
            ? "Administrator"
            : "Administrateur";
      } else if (session.role === "doctor") {
        this.avatarRole.textContent =
          localStorage.getItem("lang") === "ar"
            ? "طبيب"
            : localStorage.getItem("lang") === "en"
            ? "Doctor"
            : "Médecin";
      } else if (session.role === "staff") {
        this.avatarRole.textContent =
          localStorage.getItem("lang") === "ar"
            ? "موظف"
            : localStorage.getItem("lang") === "en"
            ? "Staff"
            : "Personnel";
      } else {
        this.avatarRole.textContent = session.role; // fallback
      }
    }
  }

  renderAvatar(session) {
    if (!session || !this.avatarContainer) return;
    this.avatarContainer.innerHTML = "";
    const img = document.createElement("img");
    img.id = "userAvatar";
    img.className = "w-full h-full object-cover";
    img.src = `https://ui-avatars.com/api/?name=${session.lastName}+${session.firstName}&background=155dfc&color=fff&bold=true&size=128`;
    img.alt = "User Avatar";
    this.avatarContainer.appendChild(img);
  }

  renderUsersTable(filteredUsersData, currentPage, usersPerPage) {
    if (!this.tbody) return;

    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = Math.min(
      startIndex + usersPerPage,
      filteredUsersData.length
    );
    const paginatedUsers = filteredUsersData.slice(startIndex, endIndex);

    if (paginatedUsers.length === 0) {
      this.tbody.innerHTML = `
        <tr>
          <td colspan="7" class="px-6 py-12 text-center">
            <div class="flex flex-col items-center justify-center">
              <i data-feather="users" class="w-12 h-12 text-gray-400 mb-4"></i>
              <span class="text-gray-500 mb-4" data-i18n="Aucun utilisateur trouvé"></span>
              <button id="addFirstUserBtn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <i data-feather="user-plus" class="w-4 h-4 inline mr-2"></i>
                <span data-i18n="Ajouter votre premier utilisateur"></span>
              </button>
            </div>
          </td>
        </tr>
      `;
      feather.replace();
      return;
    }

    let html = "";
    paginatedUsers.forEach((user) => {
      const fullName = `${user.firstName} ${user.lastName}`;
      const roleInfo = this.getRoleInfo(user.role);
      const statusInfo = this.getStatusInfo(user.status);

      html += `
        <tr class="user-row" data-user-id="${user.userId}">
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              ${generateUserCode(String(user.userId).slice(0, 3))}...
            </span>
          </td>
          <td class="px-6 py-4">
            <div class="font-medium text-gray-900">${fullName}</div>
            <div class="text-sm text-gray-500">${user.CIN}</div>
          </td>
          <td class="px-6 py-4">
            <div class="text-sm text-gray-900">${user.email}</div>
            <div class="text-sm text-gray-500">${user.phoneNumber}</div>
          </td>
<td class="px-6 py-4">
  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    roleInfo.color
  }">
    <i data-feather="${roleInfo.icon}" class="w-3 h-3 mr-1 rtl:ml-1"></i>
    ${
      roleInfo.text === "Administrateur"
        ? localStorage.getItem("lang") === "ar"
          ? "مسؤول"
          : localStorage.getItem("lang") === "en"
          ? "Administrator"
          : "Administrateur"
        : roleInfo.text === "Médecin"
        ? localStorage.getItem("lang") === "ar"
          ? "طبيب"
          : localStorage.getItem("lang") === "en"
          ? "Doctor"
          : "Médecin"
        : roleInfo.text === "Personnel"
        ? localStorage.getItem("lang") === "ar"
          ? "موظف"
          : localStorage.getItem("lang") === "en"
          ? "Staff"
          : "Personnel"
        : roleInfo.text === "Patient"
        ? localStorage.getItem("lang") === "ar"
          ? "مريض"
          : localStorage.getItem("lang") === "en"
          ? "Patient"
          : "Patient"
        : roleInfo.text
    }
  </span>
</td>
<td class="px-6 py-4">
  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    statusInfo.color
  }">
    <i data-feather="${statusInfo.icon}" class="w-3 h-3 mr-1"></i>
    ${
      statusInfo.text.toLowerCase() === "actif"
        ? localStorage.getItem("lang") === "ar"
          ? "نشيط"
          : localStorage.getItem("lang") === "en"
          ? "Active"
          : "Actif"
        : statusInfo.text.toLowerCase() === "inactif"
        ? localStorage.getItem("lang") === "ar"
          ? "غير نشيط"
          : localStorage.getItem("lang") === "en"
          ? "Inactive"
          : "Inactif"
        : statusInfo.text.toLowerCase() === "en attente"
        ? localStorage.getItem("lang") === "ar"
          ? "قيد الانتظار"
          : localStorage.getItem("lang") === "en"
          ? "Pending"
          : "En attente"
        : statusInfo.text.toLowerCase() === "suspendu"
        ? localStorage.getItem("lang") === "ar"
          ? "معلق"
          : localStorage.getItem("lang") === "en"
          ? "Suspended"
          : "Suspendu"
        : statusInfo.text
    }
  </span>
</td>

          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${formatDate(user.createdAt)}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex space-x-2">
              <button class="edit-user-btn p-1 text-blue-600 hover:text-blue-800 transition-colors" title="Modifier" data-user-id="${
                user.userId
              }">
                <i data-feather="edit" class="w-4 h-4"></i>
              </button>
              <button class="delete-user-btn p-1 text-red-600 hover:text-red-800 transition-colors" title="Supprimer" data-user-id="${
                user.userId
              }">
                <i data-feather="trash" class="w-4 h-4"></i>
              </button>
              <button class="view-user-btn p-1 text-green-600 hover:text-green-800 transition-colors" title="Voir détails" data-user-id="${
                user.userId
              }">
                <i data-feather="eye" class="w-4 h-4"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    this.tbody.innerHTML = html;
    this.startItem.textContent = startIndex + 1;
    this.endItem.textContent = endIndex;
    this.totalItems.textContent = filteredUsersData.length;

    feather.replace();
  }

  renderPatientTable(filteredUsersData, currentPage, usersPerPage) {
    if (!this.ptbody) return;

    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = Math.min(
      startIndex + usersPerPage,
      filteredUsersData.length
    );
    const paginatedUsers = filteredUsersData.slice(startIndex, endIndex);

    if (paginatedUsers.length === 0) {
      this.ptbody.innerHTML = `
        <tr>
          <td colspan="7" class="px-6 py-12 text-center">
            <div class="flex flex-col items-center justify-center">
              <i data-feather="users" class="w-12 h-12 text-gray-400 mb-4"></i>
              <span class="text-gray-500 mb-4" data-i18n="Aucun utilisateur trouvé"></span>
              <button id="addFirstUserBtn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <i data-feather="user-plus" class="w-4 h-4 inline mr-2"></i>
                <span data-i18n="Ajouter votre premier utilisateur"></span>
              </button>
            </div>
          </td>
        </tr>
      `;
      feather.replace();
      return;
    }

    let html = "";
    paginatedUsers.forEach((user) => {
      if (user.status === "active") {
        const fullName = `${user.firstName} ${user.lastName}`;

        html += `
          <tr class="user-row" data-user-id="${user.userId}">
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                ${generatePatientCode(String(user.userId).slice(0, 3))}...
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="font-medium text-gray-900">${fullName}</div>
              <div class="text-sm text-gray-500">${user.CIN}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">${user.email}</div>
              <div class="text-sm text-gray-500">${user.phoneNumber}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              ${formatDate(user.createdAt)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex space-x-2">
                <button class="edit-user-btn p-1 text-blue-600 hover:text-blue-800 transition-colors" title="Modifier" data-user-id="${
                  user.userId
                }">
                  <i data-feather="edit" class="w-4 h-4"></i>
                </button>
                <button class="view-user-btn p-1 text-green-600 hover:text-green-800 transition-colors" title="Voir détails" data-user-id="${
                  user.userId
                }">
                  <i data-feather="eye" class="w-4 h-4"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }
    });

    this.ptbody.innerHTML = html;
    this.startItem.textContent = startIndex + 1;
    this.endItem.textContent = endIndex;
    this.totalItems.textContent = filteredUsersData.length;

    feather.replace();
  }

  renderDoctorPatientTable(filteredUsersData, currentPage, usersPerPage) {
        if (!this.ptbody) return;

        const startIndex = (currentPage - 1) * usersPerPage;
        const endIndex = Math.min(startIndex + usersPerPage, filteredUsersData.length);
        const paginatedUsers = filteredUsersData.slice(startIndex, endIndex);

        if (paginatedUsers.length === 0) {
            this.ptbody.innerHTML = `
        <tr>
          <td colspan="7" class="px-6 py-12 text-center">
            <div class="flex flex-col items-center justify-center">
              -
            </div>
          </td>
        </tr>
      `;
            feather.replace();
            return;
        }

        let html = "";
        paginatedUsers.forEach(user => {
            if (user.status === "active") {
                const fullName = `${user.firstName} ${user.lastName}`;

                html += `
          <tr class="user-row" data-user-id="${user.userId}">
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                ${generatePatientCode(String(user.userId).slice(0, 3))}...
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="font-medium text-gray-900">${fullName}</div>
              <div class="text-sm text-gray-500">${user.CIN}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">${user.email}</div>
              <div class="text-sm text-gray-500">${user.phoneNumber}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              ${formatDate(user.createdAt)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex space-x-2">
                <button class="view-user-btn p-1 text-green-600 hover:text-green-800 transition-colors" title="Voir détails" data-user-id="${user.userId}">
                  <i data-feather="eye" class="w-4 h-4"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
            }
        });

        this.ptbody.innerHTML = html;
        this.startItem.textContent = startIndex + 1;
        this.endItem.textContent = endIndex;
        this.totalItems.textContent = filteredUsersData.length;

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

  renderCurrentStaffInfo(userData) {
    document.getElementById("profileFirstName").value = userData.firstName;
    document.getElementById("profileLastName").value = userData.lastName;
    document.getElementById("profileCIN").value = userData.CIN;
    document.getElementById("profileEmail").value = userData.email;
    document.getElementById("profilePhone").value = userData.phoneNumber;
    document.getElementById("profileAddress").value = userData.address;
  }

  getRoleInfo(role) {
    const roles = {
      admin: {
        text: "Administrateur",
        color: "bg-purple-100 text-purple-800",
        icon: "user",
      },
      doctor: {
        text: "Médecin",
        color: "bg-blue-100 text-blue-800",
        icon: "user",
      },
      staff: {
        text: "Personnel",
        color: "bg-green-100 text-green-800",
        icon: "user",
      },
      patient: {
        text: "Patient",
        color: "bg-gray-100 text-gray-800",
        icon: "user",
      },
    };
    return (
      roles[role] || {
        text: role,
        color: "bg-gray-100 text-gray-800",
        icon: "user",
      }
    );
  }

  getStatusInfo(status) {
    const statuses = {
      active: {
        text: "Actif",
        color: "bg-green-100 text-green-800",
        icon: "check-circle",
      },
      inactive: {
        text: "Inactif",
        color: "bg-red-100 text-red-800",
        icon: "x-circle",
      },
      pending: {
        text: "En attente",
        color: "bg-yellow-100 text-yellow-800",
        icon: "clock",
      },
      suspended: {
        text: "Suspendu",
        color: "bg-orange-100 text-orange-800",
        icon: "slash",
      },
    };
    return (
      statuses[status] || {
        text: status,
        color: "bg-gray-100 text-gray-800",
        icon: "alert-circle",
      }
    );
  }

  // --- Setup events with callbacks provided by Controller ---
  setupEvents(controller) {
    if (this.menuLogout)
      this.menuLogout.addEventListener("click", (e) =>
        controller.handleLogout(e)
      );
    if (this.filterRole)
      this.filterRole.addEventListener("change", () =>
        controller.applyFilters()
      );
    if (this.filterStatus)
      this.filterStatus.addEventListener("change", () =>
        controller.applyFilters()
      );
    if (this.searchUsers)
      this.searchUsers.addEventListener("input", () =>
        controller.applyFilters()
      );

    if (this.prevBtn)
      this.prevBtn.addEventListener("click", () => controller.prevPage());
    if (this.nextBtn)
      this.nextBtn.addEventListener("click", () => controller.nextPage());
    if (this.usersPerPageSelect)
      this.usersPerPageSelect.addEventListener("change", (e) =>
        controller.changeUsersPerPage(e)
      );

    if (this.addUserBtn)
      this.addUserBtn.addEventListener("click", () =>
        openModal("addUserModal")
      );
    if (this.addUserData)
      this.addUserData.addEventListener("click", (e) =>
        controller.addUserData(e, this.getUserInputData())
      );
    if (this.editUser)
      this.editUser.addEventListener("click", () =>
        controller.updateUserData(this.getEditUserInputData())
      );
    if (this.confirmDeleteBtn)
      this.confirmDeleteBtn.addEventListener("click", () =>
        controller.deleteUser()
      );
    if (this.editStaffBtn)
      this.editStaffBtn.addEventListener("click", (e) =>
        controller.updateStaffData(e, this.getStaffInputData())
      );

    // if (this.addEditEmergencyContactBtn) this.addEditEmergencyContactBtn.addEventListener("click", () => this.createEmergencyContactBlock());

    if (this.closeAddPatientModal) this.closeAddPatientModal.addEventListener("click", () => closeModal("addUserModal"));

    // Add emergency contact (edit modal)
    const addEditBtn = document.getElementById("addEditEmergencyContactBtn");
    if (addEditBtn) {
      addEditBtn.addEventListener("click", () => {
        const container = this.editEmergencyContactsContainer;
        const count = container.children.length + 1;

        container.insertAdjacentHTML(
          "beforeend",
          this.createEmergencyContactBlock({}, count)
        );

        feather.replace();
      });
    }

    // Remove emergency contact (delegated)
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".remove-emergency-contact");
      if (!btn) return;

      const container = this.editEmergencyContactsContainer;
      btn.closest(".emergency-contact").remove();

      // Renumber titles
      [...container.children].forEach((div, i) => {
        div.querySelector("h3").textContent = `Contact d'urgence ${i + 1}`;
      });
    });

    // Table buttons delegated
    document.addEventListener("click", (e) => {
      if (e.target.closest(".edit-user-btn"))
        controller.openEditModal(
          e.target.closest(".edit-user-btn").dataset.userId
        );
      if (e.target.closest(".delete-user-btn"))
        controller.openDeleteModal(
          e.target.closest(".delete-user-btn").dataset.userId
        );
      if (e.target.closest(".view-user-btn"))
        controller.openViewModal(
          e.target.closest(".view-user-btn").dataset.userId
        );
      if (e.target.id === "addFirstUserBtn") openModal("addUserModal");
    });

    // Modals cancel/close
    if (this.closeAddModal)
      this.closeAddModal.addEventListener("click", () =>
        closeModal("addUserModal")
      );
    if (this.cancelAddBtn)
      this.cancelAddBtn.addEventListener("click", () =>
        closeModal("addUserModal")
      );
    if (this.closeAddPatientModal)
      this.closeAddPatientModal.addEventListener("click", () =>
        closeModal("addUserModal")
      );
    if (this.closeEditModal)
      this.closeEditModal.addEventListener("click", () =>
        closeModal("editUserModal")
      );
    if (this.cancelEditBtn)
      this.cancelEditBtn.addEventListener("click", () =>
        closeModal("editUserModal")
      );
    if (this.closeViewModal1)
      this.closeViewModal1.addEventListener("click", () =>
        closeModal("viewUserModal")
      );
    if (this.closeViewModal2)
      this.closeViewModal2.addEventListener("click", () =>
        closeModal("viewUserModal")
      );
    if (this.cancelDeleteBtn)
      this.cancelDeleteBtn.addEventListener("click", () =>
        closeModal("deleteUserModal")
      );
    if (this.editFromViewBtn)
      this.editFromViewBtn.addEventListener("click", () =>
        controller.editFromView()
      );
  }

  renderViewUserModal(user) {
    document.getElementById(
      "viewUserFullName"
    ).textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById("viewUserCIN").textContent = user.CIN || "-";
    document.getElementById("viewUserId").textContent = user.userId || "-";
    document.getElementById("viewUserEmail").textContent = user.email || "-";
    document.getElementById("viewUserPhone").textContent =
      user.phoneNumber || "-";
    document.getElementById("viewUserAddress").textContent =
      user.address || "-";
    document.getElementById("viewUserCreatedAt").textContent =
      user.createdAt.split("T")[0] || "-";

    const roleInfo = this.getRoleInfo(user.role);
    const statusInfo = this.getStatusInfo(user.status);

    // ROLE
    document.getElementById("viewUserRole").textContent = `
${
  roleInfo.text === "Administrateur"
    ? localStorage.getItem("lang") === "ar"
      ? "مسؤول"
      : localStorage.getItem("lang") === "en"
      ? "Administrator"
      : "Administrateur"
    : roleInfo.text === "Médecin"
    ? localStorage.getItem("lang") === "ar"
      ? "طبيب"
      : localStorage.getItem("lang") === "en"
      ? "Doctor"
      : "Médecin"
    : roleInfo.text === "Personnel"
    ? localStorage.getItem("lang") === "ar"
      ? "موظف"
      : localStorage.getItem("lang") === "en"
      ? "Staff"
      : "Personnel"
    : roleInfo.text === "Patient"
    ? localStorage.getItem("lang") === "ar"
      ? "مريض"
      : localStorage.getItem("lang") === "en"
      ? "Patient"
      : "Patient"
    : roleInfo.text
}`.trim();

    document.getElementById(
      "viewUserRole"
    ).className = `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${roleInfo.color}`;

    // STATUS
    document.getElementById("viewUserStatus").innerHTML = `
<i data-feather="${statusInfo.icon}" class="w-4 h-4 mr-1"></i>
${
  statusInfo.text === "Actif"
    ? localStorage.getItem("lang") === "ar"
      ? "نشط"
      : localStorage.getItem("lang") === "en"
      ? "Active"
      : "Actif"
    : statusInfo.text === "Inactif"
    ? localStorage.getItem("lang") === "ar"
      ? "غير نشط"
      : localStorage.getItem("lang") === "en"
      ? "Inactive"
      : "Inactif"
    : statusInfo.text
}`.trim();

    document.getElementById(
      "viewUserStatus"
    ).className = `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`;

    // Emergency Contacts
    const container = document.getElementById("viewUserEmergencyContacts");
    container.innerHTML = "";

    if (
      Array.isArray(user.emergencyContacts) &&
      user.emergencyContacts.length > 0
    ) {
      user.emergencyContacts.forEach((contact, index) => {
        const div = document.createElement("div");
        div.className = "border rounded-lg p-3 bg-gray-50";

        div.innerHTML = `
          <p class="font-medium text-gray-900">
            ${contact.firstName} ${contact.lastName}
          </p>
          <p class="text-sm text-gray-600">
            📞 ${contact.phoneNumber || "-"}
          </p>
          <p class="text-sm text-gray-600">
            Relationship: ${contact.relationship || "-"}
          </p>
        `;

        container.appendChild(div);
      });
    } else {
      container.innerHTML = `<p class="text-gray-500">No emergency contact</p>`;
    }

    openModal("viewUserModal");
    feather.replace();
  }

  createEmergencyContactBlock(contact = {}, index = 1) {
    return `
  <div class="relative border border-gray-200 rounded-xl p-4 bg-gray-50 emergency-contact">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold text-gray-700">
        ${
          currentLang === "fr"
            ? `Contact d'urgence ${index}`
            : currentLang === "en"
            ? `Emergency Contact ${index}`
            : currentLang === "ar"
            ? `جهة اتصال طارئة ${index}`
            : `Contact ${index}`
        }
      </h3>

      <button type="button"
        class="text-red-500 hover:text-red-700 transition-colors remove-emergency-contact"
        title="${
          currentLang === "fr"
            ? "Supprimer"
            : currentLang === "en"
            ? "Remove"
            : "حذف"
        }">
        <i data-feather="x" class="w-4 h-4"></i>
      </button>
    </div>

    <!-- Inputs -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">
          ${
            currentLang === "fr"
              ? "Prénom"
              : currentLang === "en"
              ? "First Name"
              : "الاسم الأول"
          }
        </label>
        <input type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 edit-ec-firstName"
          placeholder="${
            currentLang === "fr"
              ? "Prénom"
              : currentLang === "en"
              ? "First Name"
              : "الاسم الأول"
          }"
          value="${contact.firstName || ""}">
        <p class="error-edit-firstName"></p>
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">
          ${
            currentLang === "fr"
              ? "Nom"
              : currentLang === "en"
              ? "Last Name"
              : "اسم العائلة"
          }
        </label>
        <input type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 edit-ec-lastName"
          placeholder="${
            currentLang === "fr"
              ? "Nom"
              : currentLang === "en"
              ? "Last Name"
              : "اسم العائلة"
          }"
          value="${contact.lastName || ""}">
        <p class="error-edit-lastName"></p>
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">
          ${
            currentLang === "fr"
              ? "Téléphone"
              : currentLang === "en"
              ? "Phone"
              : "الهاتف"
          }
        </label>
        <input type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 edit-ec-phone"
          placeholder="${
            currentLang === "fr"
              ? "+212 6XX XXX XXX"
              : currentLang === "en"
              ? "+212 6XX XXX XXX"
              : "+212 6XX XXX XXX"
          }"
          value="${contact.phoneNumber || ""}">
        <p class="error-edit-phone"></p>
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">
          ${
            currentLang === "fr"
              ? "Relation"
              : currentLang === "en"
              ? "Relationship"
              : "العلاقة"
          }
        </label>
        <input type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 edit-ec-relationship"
          placeholder="${
            currentLang === "fr"
              ? "Ex: Père, Mère, Frère..."
              : currentLang === "en"
              ? "Ex: Father, Mother, Brother..."
              : "مثال: أب، أم، أخ..."
          }"
          value="${contact.relationship || ""}">
        <p class="error-edit-relationship"></p>
      </div>
    </div>
  </div>
`;
  }

  renderEditUserModal(user) {
    const firstName = document.getElementById("editUserFirstName");
    if (firstName) firstName.value = user.firstName;
    const lastName = document.getElementById("editUserLastName");
    if (lastName) lastName.value = user.lastName;
    const cin = document.getElementById("editUserCIN");
    if (cin) cin.value = user.CIN;
    const email = document.getElementById("editUserEmail");
    if (email) email.value = user.email;
    const phone = document.getElementById("editUserPhone");
    if (phone) phone.value = user.phoneNumber;
    const address = document.getElementById("editUserAddress");
    if (address) address.value = user.address || "";
    const role = document.getElementById("editUserRole");
    if (role) role.value = user.role;
    const status = document.getElementById("editUserStatus");
    if (status) status.value = user.status;
    const id = document.getElementById("editUserId");
    if (id) id.value = user.userId;

    // ===== Emergency Contacts =====
    this.editEmergencyContactsContainer.innerHTML = "";

    const contacts = Array.isArray(user.emergencyContacts)
      ? user.emergencyContacts
      : [];

    if (contacts.length) {
      contacts.forEach((contact, i) => {
        this.editEmergencyContactsContainer.insertAdjacentHTML(
          "beforeend",
          this.createEmergencyContactBlock(contact, i + 1)
        );
      });
    } else {
      this.createEmergencyContactBlock();
    }

    openModal("editUserModal");
  }

  renderDeleteUserModal(user) {
    document.getElementById(
      "deleteUserName"
    ).textContent = `${user.firstName} ${user.lastName}`;
    const roleInfo = this.getRoleInfo(user.role);
    document.getElementById(
      "deleteUserInfo"
    ).textContent = `${roleInfo.text} • ${user.email}`;
    document.getElementById("deleteUserId").value = user.userId;

    openModal("deleteUserModal");
  }

  getStaffInputData() {
    const CIN = document.getElementById("profileCIN").value;
    const email = document.getElementById("profileEmail").value;
    const phoneNumber = document.getElementById("profilePhone").value;
    const address = document.getElementById("profileAddress").value;

    return {
      CIN,
      email,
      phoneNumber,
      address,
    };
  }

  getUserInputData() {
    const CIN = document.getElementById("addUserCIN").value.trim();
    const firstName = document.getElementById("addUserFirstName").value.trim();
    const lastName = document.getElementById("addUserLastName").value.trim();
    const email = document.getElementById("addUserEmail").value.trim();
    const phoneNumber = document.getElementById("addUserPhone").value.trim();
    const role = document.getElementById("addUserRole")?.value || "patient";
    const password = document.getElementById("addUserPassword")?.value || "";
    const confirmPassword =
      document.getElementById("addUserConfirmPassword")?.value || "";
    const address = document.getElementById("addUserAddress").value.trim();

    // ===== Emergency Contacts =====
    const emergencyContacts = [];
    const contactsContainer = document.getElementById(
      "emergencyContactsContainer"
    );

    if (contactsContainer) {
      const contactDivs =
        contactsContainer.querySelectorAll(".emergency-contact");

      contactDivs.forEach((div) => {
        emergencyContacts.push({
          firstName:
            div.querySelector("input:nth-of-type(1)")?.value.trim() || "",
          lastName:
            div.querySelector("input:nth-of-type(2)")?.value.trim() || "",
          phoneNumber:
            div.querySelector("input:nth-of-type(3)")?.value.trim() || "",
          relationship:
            div.querySelector("input:nth-of-type(4)")?.value.trim() || "",
        });
      });
    }

    return {
      CIN,
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      password,
      confirmPassword,
      emergencyContacts,
      address,
    };
  }

  getEditUserInputData() {
    const emergencyContacts = [];
    const contactBlocks = document.querySelectorAll(
      "#editEmergencyContactsContainer .emergency-contact"
    );

    contactBlocks.forEach((block) => {
      emergencyContacts.push({
        firstName: block.querySelector(".edit-ec-firstName").value.trim(),
        lastName: block.querySelector(".edit-ec-lastName").value.trim(),
        phoneNumber: block.querySelector(".edit-ec-phone").value.trim(),
        relationship: block.querySelector(".edit-ec-relationship").value.trim(),
      });
    });

    return {
      userId: document.getElementById("editUserId").value.trim(),
      firstName: document.getElementById("editUserFirstName").value.trim(),
      lastName: document.getElementById("editUserLastName").value.trim(),
      CIN: document.getElementById("editUserCIN").value.trim(),
      phoneNumber: document.getElementById("editUserPhone").value.trim(),
      role: document.getElementById("editUserRole")?.value || "patient",
      status: document.getElementById("editUserStatus")?.value || "active",
      email: document.getElementById("editUserEmail").value.trim(),
      address: document.getElementById("editUserAddress").value.trim(),
      emergencyContacts,
    };
  }
}
