import SettingView from "../views/SettingView.js";
import HospitalSetting from "../models/HospitalSetting.js";

export default class SettingController {
  constructor() {
    this.view = new SettingView();

    this.view.setupEvents(this);
    this.render();
  }

  render() {
    const setting = HospitalSetting.getSetting();

    this.view.renderValue(setting[0]);
  }

  validate(settingData) {
    const errors = this.view.getSettingErrorElements();
    this.view.clearSettingErrors();

    const isValidEmail = str => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
    const isValidPhone = str => /^\+?\d{6,15}$/.test(str.replace(/\s+/g, ''));

    let isValid = true;

    // Name
    if (!settingData.hospitalName || settingData.hospitalName.trim() === "") {
        this.view.showError(errors.hospitalName, "Le nom est requis.");
        isValid = false;
    }

    // Adress
    if (!settingData.address || settingData.address.trim() === "") {
        this.view.showError(errors.address, "L'adresse est requise.");
        isValid = false;
    }

    // Email
    if (!settingData.email) {
        this.view.showError(errors.email, "L'email est requis.");
        isValid = false;
    } else if (!isValidEmail(settingData.email)) {
        this.view.showError(errors.email, "Email invalide.");
        isValid = false;
    }

    // Phone
    if (!settingData.phone) {
        this.view.showError(errors.phone, "Le numéro de téléphone est requis.");
        isValid = false;
    } else if (!isValidPhone(settingData.phone)) {
        this.view.showError(errors.phone, "Numéro de téléphone invalide.");
        isValid = false;
    }

    return isValid;
  }

  update(settingData) {
    if (!this.validate(settingData)) return;

    HospitalSetting.updateSetting(settingData);

    window.location.reload();
  }
}