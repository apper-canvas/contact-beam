import tagsData from "@/services/mockData/tags.json";

// Get all available tags
export const getAllTags = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  try {
    return [...tagsData];
  } catch (error) {
    throw new Error("Failed to load tags");
  }
};

// Get tag color by label
export const getTagColor = (tagLabel) => {
  const tag = tagsData.find(tag => tag.label === tagLabel);
  return tag ? tag.color : "#64748b"; // Default to secondary color
};