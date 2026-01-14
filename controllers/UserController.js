import User from "../models/User.js";
import UserView from "../views/UserView.js";
import Auth from "../models/Auth.js";
import Storage from "../models/Storage.js";
import { openModal, closeModal } from "../src/utils/modal.js";
import Appointment from "../models/Appointment.js";

export default class UserController {
  constructor() {
    this.view = new UserView();
    this.usersData = User.getAllUsers();
    this.filteredUsersData = [...this.usersData];
    this.currentUsersPage = 1;
    this.usersPerPage = 10;
    this.currentEditingUserId = null;
    this.session = Storage.load("Session");

    // Initialize
    this.view.renderCurrUserInfo(this.session);
    this.view.renderAvatar(this.session);
    this.view.setupEvents(this);

    this.renderUsers();
  }

  renderUsers() {
    if (this.session.role === "admin") {
      this.view.renderUsersTable(this.filteredUsersData, this.currentUsersPage, this.usersPerPage);
    }
    if (this.session.role === "staff") {
        this.view.renderPatientTable([...User.getAllUsers("patient")], this.currentUsersPage, this.usersPerPage);
        this.view.renderCurrentStaffInfo(User.getUserByCIN(this.session.CIN));
    }
      if (this.session.role === "doctor") {
          this.view.renderDoctorPatientTable(Appointment.getUsersByDoctorID(this.session.userId), this.currentUsersPage, this.usersPerPage);
          this.view.renderCurrentStaffInfo(User.getUserByCIN(this.session.CIN));
    }
    this.view.renderPagination(this.filteredUsersData, this.currentUsersPage, this.usersPerPage);
  }

  applyFilters() {
    const roleFilter = this.view.filterRole?.value;
    const statusFilter = this.view.filterStatus?.value;
    const searchTerm = this.view.searchUsers?.value.toLowerCase();

    this.filteredUsersData = this.usersData.filter(user => {
      const matchesRole = !roleFilter || user.role === roleFilter;
      const matchesStatus = !statusFilter || user.status === statusFilter;
      const matchesSearch =
        !searchTerm ||
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.CIN.toLowerCase().includes(searchTerm);
      return matchesRole && matchesStatus && matchesSearch;
    });

    this.currentUsersPage = 1;
    this.renderUsers();
  }

  handleLogout(e) {
    e.preventDefault();
    Auth.logout();
    window.location.href = "/src/auth/login.html";
  }

  validate(userData) {
    const errors = this.view.getUserErrorElements();
    this.view.clearAllErrors();

    const hasNumber = str => /\d/.test(str);
    const isValidEmail = str => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
    const isValidPhone = str => /^\+?\d{6,15}$/.test(str.replace(/\s+/g, ''));

    let isValid = true;

    // ===== User Fields =====
    // First Name
    if (!userData.firstName) {
        this.view.showError(errors.firstName, "Le prénom est requis.");
        isValid = false;
    } else if (hasNumber(userData.firstName)) {
        this.view.showError(errors.firstName, "Le prénom ne doit pas contenir de chiffres.");
        isValid = false;
    }

    // Last Name
    if (!userData.lastName) {
        this.view.showError(errors.lastName, "Le nom est requis.");
        isValid = false;
    } else if (hasNumber(userData.lastName)) {
        this.view.showError(errors.lastName, "Le nom ne doit pas contenir de chiffres.");
        isValid = false;
    }

    // CIN
    if (!userData.CIN) {
        this.view.showError(errors.CIN, "Le CIN est requis.");
        isValid = false;
    }

    // Email
    if (!userData.email) {
        this.view.showError(errors.email, "L'email est requis.");
        isValid = false;
    } else if (!isValidEmail(userData.email)) {
        this.view.showError(errors.email, "Email invalide.");
        isValid = false;
    }

    // Phone
    if (!userData.phoneNumber) {
        this.view.showError(errors.phone, "Le numéro de téléphone est requis.");
        isValid = false;
    } else if (!isValidPhone(userData.phoneNumber)) {
        this.view.showError(errors.phone, "Numéro de téléphone invalide.");
        isValid = false;
    }

    // Password (if not patient)
    if (userData.role !== "patient" || !userData.role) {
        if (!userData.password) {
            this.view.showError(errors.password, "Le mot de passe est requis.");
            isValid = false;
        }
        if (!userData.confirmPassword) {
            this.view.showError(errors.confirmPassword, "Veuillez confirmer le mot de passe.");
            isValid = false;
        } else if (userData.password && userData.password !== userData.confirmPassword) {
            this.view.showError(errors.confirmPassword, "Les mots de passe ne correspondent pas.");
            isValid = false;
        }
    }

    if (!userData.address) {
        this.view.showError(errors.address, "L'addresse est requis.");
        isValid = false;
    }

    // ===== Emergency Contacts =====
    const contactBlocks = this.view.getEmergencyContactErrors();

    contactBlocks.forEach((block, i) => {
        const c = userData.emergencyContacts[i];

        const firstNameEl = block.querySelector(".error-firstName");
        const lastNameEl = block.querySelector(".error-lastName");
        const phoneEl = block.querySelector(".error-phone");
        const relationshipEl = block.querySelector(".error-relationship");

        // First Name
        if (!c.firstName) {
            this.view.showError(firstNameEl, "Le prénom est requis.");
            isValid = false;
        } else if (hasNumber(c.firstName)) {
            this.view.showError(firstNameEl, "Le prénom ne doit pas contenir de chiffres.");
            isValid = false;
        }

        // Last Name
        if (!c.lastName) {
            this.view.showError(lastNameEl, "Le nom est requis.");
            isValid = false;
        } else if (hasNumber(c.lastName)) {
            this.view.showError(lastNameEl, "Le nom ne doit pas contenir de chiffres.");
            isValid = false;
        }

        // Phone
        if (!c.phoneNumber) {
            this.view.showError(phoneEl, "Le numéro de téléphone est requis.");
            isValid = false;
        } else if (!isValidPhone(c.phoneNumber)) {
            this.view.showError(phoneEl, "Numéro de téléphone invalide.");
            isValid = false;
        }

        // Relationship
        if (!c.relationship) {
            this.view.showError(relationshipEl, "La relation est requise.");
            isValid = false;
        }
    });

    return isValid;
  }

  validateEdit(userData) {
      const errors = this.view.getEditUserErrorElements();
      this.view.clearAllEditErrors();

      const hasNumber = str => /\d/.test(str);
      const isValidEmail = str => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
      const isValidPhone = str => /^\+?\d{6,15}$/.test(str.replace(/\s+/g, ''));

      let isValid = true;

      // ===== User Fields =====
      if (!userData.firstName) {
          this.view.showError(errors.firstName, "Le prénom est requis.");
          isValid = false;
      } else if (hasNumber(userData.firstName)) {
          this.view.showError(errors.firstName, "Le prénom ne doit pas contenir de chiffres.");
          isValid = false;
      }

      if (!userData.lastName) {
          this.view.showError(errors.lastName, "Le nom est requis.");
          isValid = false;
      } else if (hasNumber(userData.lastName)) {
          this.view.showError(errors.lastName, "Le nom ne doit pas contenir de chiffres.");
          isValid = false;
      }

      if (!userData.CIN) {
          this.view.showError(errors.CIN, "Le CIN est requis.");
          isValid = false;
      }

      if (!userData.email) {
          this.view.showError(errors.email, "L'email est requis.");
          isValid = false;
      } else if (!isValidEmail(userData.email)) {
          this.view.showError(errors.email, "Email invalide.");
          isValid = false;
      }

      if (!userData.phoneNumber) {
          this.view.showError(errors.phone, "Le numéro de téléphone est requis.");
          isValid = false;
      } else if (!isValidPhone(userData.phoneNumber)) {
          this.view.showError(errors.phone, "Numéro de téléphone invalide.");
          isValid = false;
      }

      if (!userData.address) {
          this.view.showError(errors.address, "L'adresse est requise.");
          isValid = false;
      }

      // ===== Emergency Contacts =====
      const contactBlocks = this.view.getEditEmergencyContactErrors();
      contactBlocks.forEach((block, i) => {
          const c = userData.emergencyContacts[i];

          const firstNameEl = block.querySelector(".error-edit-firstName");
          const lastNameEl = block.querySelector(".error-edit-lastName");
          const phoneEl = block.querySelector(".error-edit-phone");
          const relationshipEl = block.querySelector(".error-edit-relationship");

          if (!c.firstName) {
              this.view.showError(firstNameEl, "Le prénom est requis.");
              isValid = false;
          } else if (hasNumber(c.firstName)) {
              this.view.showError(firstNameEl, "Le prénom ne doit pas contenir de chiffres.");
              isValid = false;
          }

          if (!c.lastName) {
              this.view.showError(lastNameEl, "Le nom est requis.");
              isValid = false;
          } else if (hasNumber(c.lastName)) {
              this.view.showError(lastNameEl, "Le nom ne doit pas contenir de chiffres.");
              isValid = false;
          }

          if (!c.phoneNumber) {
              this.view.showError(phoneEl, "Le numéro de téléphone est requis.");
              isValid = false;
          } else if (!isValidPhone(c.phoneNumber)) {
              this.view.showError(phoneEl, "Numéro de téléphone invalide.");
              isValid = false;
          }

          if (!c.relationship) {
              this.view.showError(relationshipEl, "La relation est requise.");
              isValid = false;
          }
      });

      return isValid;
  }

  validateStaffEdit(staffData) {
    const errors = this.view.getAllEditStaffElements();
      this.view.clearAllEditStaffErrors();

      const isValidEmail = str => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
      const isValidPhone = str => /^\+?\d{6,15}$/.test(str.replace(/\s+/g, ''));

      let isValid = true;

      if (!staffData.email) {
          this.view.showStaffError(errors.email, "L'email est requis.");
          isValid = false;
      } else if (!isValidEmail(staffData.email)) {
          this.view.showStaffError(errors.email, "Email invalide.");
          isValid = false;
      }

      if (!staffData.phoneNumber) {
          this.view.showStaffError(errors.phone, "Le numéro de téléphone est requis.");
          isValid = false;
      } else if (!isValidPhone(staffData.phoneNumber)) {
          this.view.showStaffError(errors.phone, "Numéro de téléphone invalide.");
          isValid = false;
      }

      if (!staffData.address) {
          this.view.showStaffError(errors.address, "L'adresse est requise.");
          isValid = false;
      }

      return isValid;
  }

  addUserData(e, userData) {
      e.preventDefault();

      if(!this.validate(userData)) return;

      const { confirmPassword, ...userWithoutConfirm } = userData;

      User.createUser(userWithoutConfirm);

      closeModal("addUserModal");
  }

  updateUserData(userData) {
      if (!this.currentEditingUserId) return;

      const { userId, ...userWithoutId } = userData;

      if (!this.validateEdit(userWithoutId)) return;

      User.updateUserInfo(this.currentEditingUserId, userWithoutId);

      closeModal("editUserModal");
  }

  updateStaffData(e, staffData) {
    e.preventDefault();

    if (!this.validateStaffEdit(staffData)) return;

    User.updateByCIN(staffData.CIN, staffData);

    window.location.reload();
  }

  deleteUser() {

    User.deleteUser(this.currentEditingUserId);

    closeModal("deleteUserModal");
  }

  // Pagination helpers
  prevPage() {
    if (this.currentUsersPage > 1) {
      this.currentUsersPage--;
      this.renderUsers();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.filteredUsersData.length / this.usersPerPage);
    if (this.currentUsersPage < totalPages) {
      this.currentUsersPage++;
      this.renderUsers();
    }
  }

  changeUsersPerPage(e) {
    this.usersPerPage = parseInt(e.target.value);
    this.currentUsersPage = 1;
    this.renderUsers();
  }

  // Modal actions placeholders
  openViewModal(userId) {
    const user = this.usersData.find(u => u.userId == userId);
    if (!user) return;
    this.currentEditingUserId = userId;
    this.view.renderViewUserModal(user);
  }

  openEditModal(userId) {
    const user = this.usersData.find(u => u.userId == userId);
    if (!user) return;
    this.currentEditingUserId = userId;
    this.view.renderEditUserModal(user);
  }

  openDeleteModal(userId) {
    const user = this.usersData.find(u => u.userId == userId);
    if (!user) return;
    this.currentEditingUserId = userId; // the current selected userId
    this.view.renderDeleteUserModal(user);
  }

  editFromView() {
    if (!this.currentEditingUserId) return;
    this.openEditModal(this.currentEditingUserId);
  }
}