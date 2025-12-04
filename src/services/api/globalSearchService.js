import { getAllContacts, searchContacts } from './contactService';
import companyService from './companyService';
import dealService from './dealService';
import taskService from './taskService';

export const globalSearch = async (query) => {
  if (!query || query.trim().length === 0) {
    return {
      contacts: [],
      companies: [],
      deals: [],
      tasks: []
    };
  }

const searchTerm = query.trim();

  try {
    // Search all entities concurrently
    const [contacts, companies, deals, tasks] = await Promise.all([
      searchContacts(searchTerm),
      companyService.searchByName(searchTerm),
      dealService.searchByName(searchTerm),
      taskService.searchTasks(searchTerm)
    ]);

    return {
      contacts: contacts.slice(0, 5), // Limit to 5 results per category
      companies: companies.slice(0, 5),
      deals: deals.slice(0, 5),
      tasks: tasks.slice(0, 5)
    };
  } catch (error) {
    console.error('Global search error:', error);
    throw new Error('Failed to perform search');
  }
};

export default {
  globalSearch
};