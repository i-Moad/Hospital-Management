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
    const index = data.findIndex(item => item[idField] === idValue);

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
    const filteredData = data.filter(item => item[idField] !== idValue);

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
}