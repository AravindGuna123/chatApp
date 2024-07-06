const express = require("express");
const router = express.Router();
const {
  getContacts,
  updateContact,
  getIndividualContact,
  deleteContact,
  createContact,
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateUserToken");

router.use(validateToken)

router.route("/").get(getContacts).post(createContact);

router
  .route("/:id")
  .get(getIndividualContact)
  .put(updateContact)
  .delete(deleteContact);

module.exports = router;
