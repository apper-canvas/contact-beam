import contactsData from "@/services/mockData/contacts.json";

// Local storage key
const CONTACTS_STORAGE_KEY = "contact_hub_contacts";

// Initialize localStorage with mock data if empty
const initializeContacts = () => {
  const existingContacts = localStorage.getItem(CONTACTS_STORAGE_KEY);
  if (!existingContacts) {
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contactsData));
    return contactsData;
  }
  return JSON.parse(existingContacts);
};

// Get all contacts from localStorage
export const getAllContacts = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const contacts = initializeContacts();
    return [...contacts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    throw new Error("Failed to load contacts");
  }
};

// Get contact by ID
export const getContactById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    const contacts = initializeContacts();
    const contact = contacts.find(contact => contact.id === id);
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  } catch (error) {
    throw new Error("Failed to load contact");
  }
};

// Create new contact
export const createContact = async (contactData) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  try {
    const contacts = initializeContacts();
    const newContact = {
      id: Date.now().toString(),
      ...contactData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedContacts = [...contacts, newContact];
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updatedContacts));
    
    return { ...newContact };
  } catch (error) {
    throw new Error("Failed to create contact");
  }
};

// Update existing contact
export const updateContact = async (id, contactData) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  try {
    const contacts = initializeContacts();
    const contactIndex = contacts.findIndex(contact => contact.id === id);
    
    if (contactIndex === -1) {
      throw new Error("Contact not found");
    }
    
    const updatedContact = {
      ...contacts[contactIndex],
      ...contactData,
      updatedAt: new Date().toISOString()
    };
    
    const updatedContacts = [...contacts];
    updatedContacts[contactIndex] = updatedContact;
    
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updatedContacts));
    
    return { ...updatedContact };
  } catch (error) {
    throw new Error("Failed to update contact");
  }
};

// Delete contact
export const deleteContact = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const contacts = initializeContacts();
    const contactExists = contacts.find(contact => contact.id === id);
    
    if (!contactExists) {
      throw new Error("Contact not found");
    }
    
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updatedContacts));
    
    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete contact");
  }
};

// Search contacts
export const searchContacts = async (query) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    const contacts = initializeContacts();
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
      return [...contacts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    const filteredContacts = contacts.filter(contact => {
      return (
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm) ||
        contact.company.toLowerCase().includes(searchTerm) ||
        contact.position.toLowerCase().includes(searchTerm) ||
        contact.notes.toLowerCase().includes(searchTerm) ||
        contact.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    });
    
    return filteredContacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    throw new Error("Failed to search contacts");
  }
};