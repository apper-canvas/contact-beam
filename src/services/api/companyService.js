import companiesData from '../mockData/companies.json';

let companies = [...companiesData];
let nextId = Math.max(...companies.map(c => c.Id)) + 1;

export const companyService = {
  // Get all companies
  getAll: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return companies.map(company => ({ ...company }));
  },

  // Get company by ID
  getById: async (id) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const company = companies.find(c => c.Id === parseInt(id));
    if (!company) {
      throw new Error('Company not found');
    }
    return { ...company };
  },

  // Create new company
  create: async (companyData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const now = new Date().toISOString();
    const newCompany = {
      Id: nextId++,
      ...companyData,
      createdAt: now,
      updatedAt: now
    };
    
    companies.unshift(newCompany);
    return { ...newCompany };
  },

  // Update existing company
  update: async (id, companyData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Company not found');
    }
    
    const updatedCompany = {
      ...companies[index],
      ...companyData,
      Id: companies[index].Id, // Ensure ID doesn't change
      createdAt: companies[index].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString()
    };
    
    companies[index] = updatedCompany;
    return { ...updatedCompany };
  },

  // Delete company
  delete: async (id) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Company not found');
    }
    
    const deletedCompany = companies[index];
    companies.splice(index, 1);
    return { ...deletedCompany };
  }
};