import Storage from "./Storage.js";

export default class HospitalSetting {
  static SETTING_KEY = "HospitalSetting";

  static updateSetting(updates) {
    const allowedUpdates = {};

    if ("hospitalName" in updates) allowedUpdates.hospitalName = updates.hospitalName;
    if ("address" in updates) allowedUpdates.address = updates.address;
    if ("phone" in updates) allowedUpdates.phone = updates.phone;
    if ("email" in updates) allowedUpdates.email = updates.email;

    const success = Storage.updateItem(
      this.SETTING_KEY,
      "settingId",
      1,
      allowedUpdates
    );

    if (!success) {
      throw new Error("Setting not found");
    }

    return true;
  }

  static getSetting() {
    return Storage.load(this.SETTING_KEY);
  }
}