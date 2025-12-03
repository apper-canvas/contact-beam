import mockDeals from '../mockData/deals.json';
import { toast } from 'react-toastify';

// Deal stages configuration
export const DEAL_STAGES = {
  LEAD: { id: 'lead', name: 'Lead', order: 1 },
  QUALIFIED: { id: 'qualified', name: 'Qualified', order: 2 },
  PROPOSAL: { id: 'proposal', name: 'Proposal', order: 3 },
  NEGOTIATION: { id: 'negotiation', name: 'Negotiation', order: 4 },
  CLOSED: { id: 'closed', name: 'Closed Won', order: 5 }
};

// Deal age thresholds (in days)
export const AGE_THRESHOLDS = {
  NEW: 7,      // 0-7 days = green
  AGING: 30,   // 8-30 days = yellow
  STALE: 31    // 30+ days = red
};

// Get deal age category
export const getDealAge = (createdDate) => {
  const now = new Date();
  const created = new Date(createdDate);
  const daysDiff = Math.floor((now - created) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= AGE_THRESHOLDS.NEW) return 'new';
  if (daysDiff <= AGE_THRESHOLDS.AGING) return 'aging';
  return 'stale';
};

// Get deal age color class
export const getDealAgeColor = (age) => {
  switch (age) {
    case 'new': return 'deal-age-new';
    case 'aging': return 'deal-age-aging';
    case 'stale': return 'deal-age-stale';
    default: return 'deal-age-new';
  }
};

// Calculate stage analytics
export const calculateStageAnalytics = (deals, stageId) => {
  const stageDeals = deals.filter(deal => deal.stage === stageId);
  const totalDeals = stageDeals.length;
  
  if (totalDeals === 0) {
    return {
      totalDeals: 0,
      avgDealSize: 0,
      conversionRate: 0,
      totalValue: 0
    };
  }
  
  const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
  const avgDealSize = totalValue / totalDeals;
  
  // Calculate conversion rate based on next stage
  const stageOrder = DEAL_STAGES[stageId.toUpperCase()]?.order || 1;
  const nextStageIds = Object.values(DEAL_STAGES)
    .filter(stage => stage.order > stageOrder)
    .map(stage => stage.id);
  
  const convertedDeals = deals.filter(deal => nextStageIds.includes(deal.stage));
  const conversionRate = totalDeals > 0 ? (convertedDeals.length / totalDeals) * 100 : 0;
  
  return {
    totalDeals,
    avgDealSize,
    conversionRate: Math.min(conversionRate, 100), // Cap at 100%
    totalValue
  };
};

// Storage key
const STORAGE_KEY = 'pipeline_deals';

// Get deals from localStorage or use mock data
const getDealsFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Error loading deals from storage:', error);
  }
  return [...mockDeals];
};

// Save deals to localStorage
const saveDealsToStorage = (deals) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
  } catch (error) {
    console.warn('Error saving deals to storage:', error);
  }
};

// Get all deals
export const getAll = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const deals = getDealsFromStorage();
  return deals.map(deal => ({
    ...deal,
    age: getDealAge(deal.createdAt),
    ageColor: getDealAgeColor(getDealAge(deal.createdAt))
  }));
};

// Get deals by stage
export const getDealsByStage = async (stageId) => {
  const allDeals = await getAll();
  return allDeals.filter(deal => deal.stage === stageId);
};

// Get deal by ID
export const getById = async (id) => {
  if (!Number.isInteger(parseInt(id))) {
    throw new Error('Invalid deal ID');
  }
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const deals = getDealsFromStorage();
  const deal = deals.find(deal => deal.Id === parseInt(id));
  
  if (!deal) {
    throw new Error('Deal not found');
  }
  
  return {
    ...deal,
    age: getDealAge(deal.createdAt),
    ageColor: getDealAgeColor(getDealAge(deal.createdAt))
  };
};

// Create new deal
export const create = async (dealData) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const deals = getDealsFromStorage();
  const newId = Math.max(...deals.map(d => d.Id), 0) + 1;
  
  const newDeal = {
    ...dealData,
    Id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stage: dealData.stage || 'lead'
  };
  
  deals.push(newDeal);
  saveDealsToStorage(deals);
  
  toast.success(`Deal "${newDeal.title}" created successfully`);
  
  return {
    ...newDeal,
    age: getDealAge(newDeal.createdAt),
    ageColor: getDealAgeColor(getDealAge(newDeal.createdAt))
  };
};

// Update deal
export const update = async (id, updateData) => {
  if (!Number.isInteger(parseInt(id))) {
    throw new Error('Invalid deal ID');
  }
  
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const deals = getDealsFromStorage();
  const dealIndex = deals.findIndex(deal => deal.Id === parseInt(id));
  
  if (dealIndex === -1) {
    throw new Error('Deal not found');
  }
  
  const updatedDeal = {
    ...deals[dealIndex],
    ...updateData,
    Id: parseInt(id), // Ensure ID is not changed
    updatedAt: new Date().toISOString()
  };
  
  deals[dealIndex] = updatedDeal;
  saveDealsToStorage(deals);
  
  toast.success(`Deal "${updatedDeal.title}" updated successfully`);
  
  return {
    ...updatedDeal,
    age: getDealAge(updatedDeal.createdAt),
    ageColor: getDealAgeColor(getDealAge(updatedDeal.createdAt))
  };
};

// Move deal to different stage
export const moveToStage = async (dealId, newStage) => {
  if (!Number.isInteger(parseInt(dealId))) {
    throw new Error('Invalid deal ID');
  }
  
  if (!Object.values(DEAL_STAGES).find(stage => stage.id === newStage)) {
    throw new Error('Invalid stage');
  }
  
  const deal = await update(dealId, { stage: newStage });
  toast.success(`Deal moved to ${DEAL_STAGES[newStage.toUpperCase()].name}`);
  
  return deal;
};

// Delete deal
export const deleteById = async (id) => {
  if (!Number.isInteger(parseInt(id))) {
    throw new Error('Invalid deal ID');
  }
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const deals = getDealsFromStorage();
  const dealIndex = deals.findIndex(deal => deal.Id === parseInt(id));
  
  if (dealIndex === -1) {
    throw new Error('Deal not found');
  }
  
  const deletedDeal = deals[dealIndex];
  deals.splice(dealIndex, 1);
  saveDealsToStorage(deals);
  
  toast.success(`Deal "${deletedDeal.title}" deleted successfully`);
  
  return { success: true };
};

// Get pipeline analytics
export const getPipelineAnalytics = async () => {
  const deals = await getAll();
  const analytics = {};
  
  Object.values(DEAL_STAGES).forEach(stage => {
    analytics[stage.id] = calculateStageAnalytics(deals, stage.id);
  });
  
  return analytics;
};

export default {
  getAll,
  getDealsByStage,
  getById,
  create,
  update,
  moveToStage,
  delete: deleteById,
  getPipelineAnalytics,
  DEAL_STAGES,
  AGE_THRESHOLDS,
  getDealAge,
  getDealAgeColor
};