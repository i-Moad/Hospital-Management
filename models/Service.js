import DoctorService from "./DoctorService.js";
import Storage from "./Storage.js";

export default class Service {
  static SERVICES_KEY = "Services";

  static createService({
    serviceId = crypto.randomUUID(),
    serviceName,
    description,
    isEnabled = true,
    createdAt = new Date().toISOString(),
  }) {
    // Load existing services
    const services = Storage.load(Service.SERVICES_KEY) || [];

    // Check for duplicates
    const exists = services.some(s => s.serviceId === serviceId || s.serviceName === serviceName);
    if (exists) {
      alert("Service already exists");
    }

    // Create a new service object
    const service = {
      serviceId,
      serviceName,
      description,
      isEnabled,
      createdAt
    };

    // Save the service
    Storage.addItem(Service.SERVICES_KEY, service);

    return service;
  }

  static getServiceById(serviceId) {
    const services = Storage.load(Service.SERVICES_KEY) || [];
    return services.find(s => s.serviceId == serviceId) || null;
  }

  static getAllServices() {
    return Storage.load(Service.SERVICES_KEY) || [];
  }

  static updateServiceInfo(serviceId, updates) {
    const allowedUpdates = {};

    if ("serviceName" in updates) allowedUpdates.serviceName = updates.serviceName;
    if ("description" in updates) allowedUpdates.description = updates.description;
    if ("isEnabled" in updates) allowedUpdates.isEnabled = updates.isEnabled;

    const success = Storage.updateItem(
      this.SERVICES_KEY,
      "serviceId",
      serviceId,
      allowedUpdates
    );

    if (!success) {
      throw new Error("Service not found");
    }

    return this.getServiceById(serviceId);
  }

  static deleteService(serviceId) {
    const success = Storage.removeItem(
      this.SERVICES_KEY,
      "serviceId",
      serviceId
    );

    DoctorService.deleteByServiceId(serviceId);

    if (!success) {
      throw new Error("Service not found");
    }

    return true;
  }
}
