import { getAllContacts, searchContacts } from './contactService';
import companyService from './companyService';
import dealService from './dealService';
import taskService from './taskService';

export const contextualGlobalSearch = async (query, context = 'all') => {
  if (!query || query.trim().length === 0) {
    return { contacts: [], companies: [], deals: [], tasks: [] };
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

    // Determine result limits based on context
    const getResultLimits = (entityType) => {
      if (context === entityType) {
        return { primary: 8, secondary: 3 }; // More results for current context
      }
      return { primary: 3, secondary: 5 }; // Fewer for non-context
    };

    const contactLimits = getResultLimits('contacts');
    const companyLimits = getResultLimits('companies');
    const dealLimits = getResultLimits('deals');
    const taskLimits = getResultLimits('tasks');

    return {
      contacts: contacts.slice(0, contactLimits.primary),
      companies: companies.slice(0, companyLimits.primary),
      deals: deals.slice(0, dealLimits.primary),
      tasks: tasks.slice(0, taskLimits.primary)
    };
  } catch (error) {
    console.error('Contextual search error:', error);
    throw new Error('Failed to perform search');
  }
};

// Backward compatibility
export const globalSearch = async (query) => {
  if (!query || query.trim().length === 0) {
    return {
      contacts: [],
      companies: [],
      deals: [],
      tasks: []
    };
  }
return contextualGlobalSearch(query, 'all');
};

export default {
  globalSearch
};