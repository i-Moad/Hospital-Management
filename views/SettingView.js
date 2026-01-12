export default class SettingView {
  constructor() {
    this.saveHospitalBtn = document.getElementById("saveHospitalBtn");
  }

  getSettingErrorElements() {
    return {
      hospitalName: document.getElementById("errorNomHopital"),
      address: document.getElementById("errorAddresse"),
      phone: document.getElementById("errorTelephone"),
      email: document.getElementById("errorEmail")
    };
  }

  clearSettingErrors() {
    const errors = this.getSettingErrorElements();
    Object.values(errors).forEach(el => el.textContent = "");
  }

  showError(el, message) {
    if (el) el.textContent = message;
  }

  renderValue(setting) {
    document.getElementById("NomHopital").value = setting.hospitalName;
    document.getElementById("adresse").value = setting.address;
    document.getElementById("Téléphone").value = setting.phone;
    document.getElementById("email").value = setting.email;
  }

  setupEvents(controller) {
    if (this.saveHospitalBtn) this.saveHospitalBtn.addEventListener("click", (e) => {e.preventDefault(); controller.update(this.getInputData())});
  }

  getInputData() {
    return {
      hospitalName: document.getElementById("NomHopital").value,
      address: document.getElementById("adresse").value,
      phone: document.getElementById("Téléphone").value,
      email: document.getElementById("email").value
    }
  }
}
