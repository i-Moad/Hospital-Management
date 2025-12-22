import AuthController from "../controllers/AuthController.js";
import Storage from "../models/Storage.js";

Storage.clear("Users");
Storage.addItem("Users", { email: "test@test.com", password: "123456" });

const page = document.body.dataset.page;
if (page === "Auth") {
    new AuthController();
}
