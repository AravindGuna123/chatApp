const Contact = require("../models/contactModels");

const getContacts = async (req, res) => {
  const contactsList = await Contact.find({user_id:req.user.id});
  res.status(200).json(contactsList);
};

const getIndividualContact = async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  res.status(200).json(contact);
};

const updateContact = async (req, res) => {
  const { name, email } = req.body;
  res.status(200).json({ message: `update contact for ${req.params.id}` });
};

const createContact = async (req, res) => {
  const { name, email } = req.body;
  const userId=req.user.id
  const contact = await Contact.create({
    user_id:userId,
    name,
    email,
  });
  res.status(200).json(contact);
};

const deleteContact = async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  res.status(200).json(contact);
};

module.exports = {
  getContacts,
  getIndividualContact,
  updateContact,
  createContact,
  deleteContact,
};
