export default class Storage {
  static #save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static load(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  static addItem(key, item) {
    // item should be an object
    if (!item || typeof item !== "object") return false;

    const data = this.load(key);
    data.push(item);
    this.#save(key, data);
    return true;
  }

  static updateItem(key, idField, idValue, updates = {}) {
    // idField = the id column, idValue = the value of id | exemple: (serviceId, 5)
    // updates is an object

    
    const data = this.load(key);
    const index = data.findIndex(item => item[idField] == idValue);
    
    if (index === -1) return false;
    
    data[index] = {
      ...data[index],
      ...updates
    };
    
    this.#save(key, data);
    return true
  }

  static removeItem(key, idField, idValue) {
    const data = this.load(key);
    const initialLength = data.length;
    const filteredData = data.filter(item => item[idField] != idValue);

    // check if the item is removed or not
    if (filteredData.length === initialLength) {
      return false;
    }

    this.#save(key, filteredData);
    return true;
  }

  static clear(key) {
    localStorage.removeItem(key);
    return localStorage.getItem(key) === null; // true if removed, false if it still exists
  }

  static seed() {
    fetch("../../../data/users.json")
        .then((res) => res.json())
        .then((users) => {
            users.forEach((user) => {
                Storage.addItem("Users", user);
            });
        })
        .catch((err) => console.error(err));
    
    fetch("../../../data/appointment_requests.json")
        .then((res) => res.json())
        .then((apptreqs) => {
            apptreqs.forEach((apptreq) => {
                Storage.addItem("AppointmentRequests", apptreq);
            });
        })
        .catch((err) => console.error(err));
    
    fetch("../../../data/appointments.json")
        .then((res) => res.json())
        .then((appts) => {
            appts.forEach((appt) => {
                Storage.addItem("Appointments", appt);
            });
        })
        .catch((err) => console.error(err));
    
    fetch("../../../data/doctor_services.json")
        .then((res) => res.json())
        .then((docsers) => {
            docsers.forEach((docser) => {
                Storage.addItem("DoctorServices", docser);
            });
        })
        .catch((err) => console.error(err));
    
    fetch("../../../data/hospital_setting.json")
        .then((res) => res.json())
        .then((hos) => {
            Storage.addItem("HospitalSetting", hos);
        })
        .catch((err) => console.error(err));
    
    fetch("../../../data/medical_notes.json")
        .then((res) => res.json())
        .then((mednotes) => {
            mednotes.forEach((mednote) => {
                Storage.addItem("MedicalNotes", mednote);
            });
        })
        .catch((err) => console.error(err));
    
    fetch("../../../data/prescriptions.json")
        .then((res) => res.json())
        .then((prescs) => {
            prescs.forEach((presc) => {
                Storage.addItem("Prescriptions", presc);
            });
        })
        .catch((err) => console.error(err));
    
    fetch("../../../data/services.json")
        .then((res) => res.json())
        .then((servs) => {
            servs.forEach((serv) => {
                Storage.addItem("Services", serv);
            });
        })
        .catch((err) => console.error(err));
  }
}