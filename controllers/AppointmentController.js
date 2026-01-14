import AppointmentModel from "../models/Appointment.js";
import User from "../models/User.js";
import AppointmentView from "../views/AppointmentView.js";
import Storage from "../models/Storage.js";
import { openModal, closeModal } from "../src/utils/modal.js";
import Appointment from "../models/Appointment.js";

export default class AppointmentController {
  constructor() {
    this.view = new AppointmentView();
    this.data = [];
    this.page = 1;
    this.perPage = 10;
    this.session = Storage.load("Session");

    this.view.setupEvents(this);
    this.applyFilters();
  }

   applyFilters() {
    const date = this.view.filterDate ? this.view.filterDate.value : null;
    const status = this.view.filterStatus ? this.view.filterStatus.value : null;

    this.data = AppointmentModel.getAll().filter(a => {
      const d = a.appointmentDateTime.split("T")[0];
      return (
        (!date || d === date) &&
        (!status || a.status === status)
      );
    });

    this.page = 1;
    this.render();
  }

  render() {
    this.view.renderTable(this.data, this.page, this.perPage);
    this.view.renderPagination(this.data, this.page, this.perPage);

      this.view.onConfirm = (id) => this.confirm(id);
      this.view.onCancel = (id) => this.cancelD(id);

    this.loadDoctorAppointments();
  }

    loadDoctorAppointments() {
        const doctorId = this.session.userId;

        const appointments = Appointment.getAppointmentsByDoctorID(doctorId);

        this.view.renderAppointmentsList(appointments);
    }

    confirm(appointmentId) {
        Appointment.confirm(appointmentId);
        this.loadDoctorAppointments();
    }

    cancelD(appointmentId) {
        console.log("we'er fking here")
        Appointment.cancel(appointmentId);
        this.loadDoctorAppointments();
    }


  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.render();
    }
  }

  nextPage() {
    const max = Math.ceil(this.data.length / this.perPage);
    if (this.page < max) {
      this.page++;
      this.render();
    }
  }

  changePerPage(e) {
    this.perPage = +e.target.value;
    this.page = 1;
    this.render();
  }

  openAddModal() {
    const users = User.getAllUsers();
    const patients = users.filter(user => user.role === "patient");
    const doctors = users.filter(user => user.role === "doctor");

    patients.forEach(patient => {
      const option = document.createElement("option");
      option.value = patient.userId;
      option.textContent = `${patient.firstName} ${patient.lastName}`;

      this.view.addAppointmentP.appendChild(option);
    });

    doctors.forEach(doct => {
      const option = document.createElement("option");
      option.value = doct.userId;
      option.textContent = `${doct.firstName} ${doct.lastName}`;

      this.view.addAppointmentD.appendChild(option);
    });

    openModal("addAppointmentModal");
  }
  
  validate(appointmentData) {
    const errors = this.view.getAddAppointmentErrorElements();
    this.view.clearAllAddAppointmentErrors();

    let isValid = true;

    // ===== Patient =====
    if (!appointmentData.patientId) {
      this.view.showError(errors.patient, "Le patient est requis.");
      isValid = false;
    }

    // ===== Doctor =====
    if (!appointmentData.doctorId) {
      this.view.showError(errors.doctor, "Le médecin est requis.");
      isValid = false;
    }

    // ===== Date =====
    if (!appointmentData.date) {
      this.view.showError(errors.date, "La date est requise.");
      isValid = false;
    }

    // ===== Time =====
    if (!appointmentData.time) {
      this.view.showError(errors.time, "L'heure est requise.");
      isValid = false;
    }

    // ===== Date must be in the future =====
    if (appointmentData.date && appointmentData.time) {
      const appointmentDateTime = new Date(
        `${appointmentData.date}T${appointmentData.time}:00`
      );

      if (appointmentDateTime < new Date()) {
        this.view.showError(errors.date, "La date doit être dans le futur.");
        this.view.showError(errors.time, "L'heure doit être valide.");
        isValid = false;
      }
    }

    return isValid;
  }

  validateEdit(appointmentData) {
    const errors = this.view.getEditAppointmentErrorElements();
    this.view.clearEditAddAppointmentErrors();

    let isValid = true;

    // ===== Date must be in the future =====
    if (appointmentData.date && appointmentData.time) {
      const appointmentDateTime = new Date(
        `${appointmentData.date}T${appointmentData.time}:00`
      );

      if (appointmentDateTime < new Date()) {
        this.view.showError(errors.date, "La date doit être dans le futur.");
        this.view.showError(errors.time, "L'heure doit être valide.");
        isValid = false;
      }
    }

    return isValid;
  }

  create(e) {
    e.preventDefault();

    const appointmentData = {
      patientId: addAppointmentPatient.value,
      doctorId: addAppointmentDoctor.value,
      date: addAppointmentDate.value,
      time: addAppointmentTime.value
    };

    if (!this.validate(appointmentData)) return;

    AppointmentModel.create({
      appointmentId: Date.now(),
      patientId: appointmentData.patientId,
      doctorId: appointmentData.doctorId,
      appointmentDateTime: `${appointmentData.date}T${appointmentData.time}:00`,
      status: "pending",
      createdAt: new Date().toISOString()
    });

    this.view.closeAddModal();
    this.applyFilters();
  }

  openView(id) {
    const appointment = AppointmentModel.getById(id);
    if (!appointment) return;

    this.view.fillViewModal(appointment);
  }

  update(e) {
    e.preventDefault();

    const id = viewAppointmentId.value;

    const appointmentData = {
      patientId: viewAppointmentId.value,
      doctorId: viewAppointmentDoctor.value,
      date: viewAppointmentDate.value,
      time: viewAppointmentTime.value,
      status: viewAppointmentStatus.value
    };

    if (!this.validateEdit(appointmentData)) return;

    AppointmentModel.update(id, {
      patientId: appointmentData.patientId,
      doctorId: appointmentData.doctorId,
      appointmentDateTime: `${appointmentData.date}T${appointmentData.time}:00`,
      status: appointmentData.status
    });

    this.view.closeViewModal();
    this.applyFilters();
  }

  cancel() {
    const id = viewAppointmentId.value;
    AppointmentModel.update(id, { status: "cancelled" });

    this.view.closeViewModal();
    this.applyFilters();
  }
}
