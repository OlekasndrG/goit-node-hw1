const fs = require("fs").promises;
const { nanoid } = require("nanoid");


const path = require("path");

const contactsPath = path.join(__dirname, "./db/contacts.json");


async function listContacts() {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const allContacts = await listContacts();
  const contact = allContacts.find((contact) => contact.id === contactId);

  return contact || null;
}

async function removeContact(contactId) {
  const allContacts = await listContacts();
  const contactToRemove = allContacts.find(
    (contact) => contact.id === contactId
  );
  if (!contactToRemove) return allContacts;
  const contacts = [...allContacts].filter(
    (contact) => contact.id !== contactId
  );

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  console.table(contacts);
  return contactToRemove;
}
async function updateContactByID(contactId, data) {
  const allContacts = await listContacts();
  const index = allContacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) return null;

  allContacts[index] = { contactId, ...data };

  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return allContacts[index];
}

async function addContact(name, email, phone) {
  const allContacts = await listContacts();

  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  const itemToCheck = allContacts.find(
    (contact) => contact.name === newContact.name
  );
  if (itemToCheck) return;
  allContacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  console.table(allContacts);
  return newContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
