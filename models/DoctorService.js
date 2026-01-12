import Storage from "./Storage.js";
import User from "./User.js";

export default class DoctorService {
  static DOCTOR_SERVICES_KEY = "DoctorServices";

  static assignDoctor(serviceId, doctorId) {
    const assignment = {
        doctorServiceId: crypto.randomUUID(),
        doctorId,
        serviceId
    };

    Storage.addItem(this.DOCTOR_SERVICES_KEY, assignment);

    return assignment;
  }

  static getDoctorsByService(serviceId) {
    const allAssignments = Storage.load(this.DOCTOR_SERVICES_KEY) || [];

    // Filter assignments for this service
    const assigned = allAssignments.filter(a => a.serviceId == serviceId);

    // Map to doctor objects { id, name }
    return assigned.map(a => {
      const doctor = User.getUserById(a.doctorId); // fetch doctor object
      if (doctor) {
        return { id: doctor.userId, name: `${doctor.firstName} ${doctor.lastName}` };
      }
      return null; // skip if doctor not found
    }).filter(Boolean); // remove nulls
  }

  static deleteByServiceId(serviceId) {
    const success = Storage.removeItem(
      this.DOCTOR_SERVICES_KEY,
      "serviceId",
      serviceId
    );

    if (!success) {
      throw new Error("Service not found");
    }

    return true
  }
}
