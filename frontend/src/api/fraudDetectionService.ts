const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Analyzes a CSV file for fraud detection
 * @param file The CSV file to analyze
 * @returns Promise with analysis results
 */
export const analyzeTransactions = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error analyzing transactions');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to analyze transactions:', error);
    throw error;
  }
};

/**
 * Trains a new fraud detection model with a CSV file
 * @param file The training CSV file
 * @returns Promise with training results
 */
export const trainModel = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/train`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error training model');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to train model:', error);
    throw error;
  }
};

/**
 * Get list of available trained models
 * @returns Promise with list of available models
 */
export const getAvailableModels = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/models`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch available models');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to get available models:', error);
    throw error;
  }
};