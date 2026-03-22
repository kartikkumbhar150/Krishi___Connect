import { parseCSV } from '../utils/dataUtils';
import { API_URLS } from '../config';

const extractErrorMessage = (errorData, response) => {
  if (!errorData) return `HTTP ${response.status}: ${response.statusText}`;
  if (typeof errorData.error === 'string') return errorData.error;
  if (typeof errorData.message === 'string') return errorData.message;
  if (errorData.error?.message) return errorData.error.message;
  return `HTTP ${response.status}: ${response.statusText}`;
};

export const normalizeField = (field) => ({
  id: field?._id || field?.id,
  _id: field?._id || field?.id,
  name: field?.field_name || field?.name || '',
  field_name: field?.field_name || field?.name || '',
  location: field?.location || field?.field_name || 'Unknown',
  crop: field?.current_crop || field?.crop || 'Not specified',
  current_crop: field?.current_crop || field?.crop || 'Not specified',
  area: Number(field?.area || 0),
  soilType: field?.soil_type || field?.soilType || 'Unknown',
  soil_type: field?.soil_type || field?.soilType || 'Unknown',
  status: (field?.status || 'active').toLowerCase(),
  createdAt: field?.created_at || field?.createdAt,
  created_at: field?.created_at || field?.createdAt,
  coordinates: Array.isArray(field?.coordinates) ? field.coordinates : [],
  soil_parameters: field?.soil_parameters || {},
  weather_data: field?.weather_data || {}
});

export const normalizeCrop = (crop) => ({
  id: crop?._id || crop?.id,
  _id: crop?._id || crop?.id,
  field_id: crop?.field_id,
  crop_name: crop?.crop_name || crop?.name || '',
  crop_variety: crop?.crop_variety || '',
  sowing_date: crop?.sowing_date,
  expected_harvest_date: crop?.expected_harvest_date,
  current_stage: crop?.current_stage || 'seeded',
  growth_stages: Array.isArray(crop?.growth_stages) ? crop.growth_stages : [],
  irrigation: crop?.irrigation || { schedule: [], total_water_used: 0, irrigation_method: 'manual' },
  fertilizer: crop?.fertilizer || { schedule: [], total_nitrogen: 0, total_phosphorus: 0, total_potassium: 0 },
  status: crop?.status || 'active',
  created_at: crop?.created_at
});


// This service handles all API calls to the Flask backend

// Generic API call function with error handling
const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = extractErrorMessage(errorData, response);
      console.error(`API Error (${response.status}):`, errorMessage);
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${url}:`, error);
    throw error;
  }
};

// ============ SERVER STATUS ============
export const checkServerStatus = async () => {
  try {
    const response = await apiCall(API_URLS.STATUS);
    return response;
  } catch (error) {
    return { 
      status: 'offline', 
      error: error.message,
      mongodb_connected: false,
      ml_models_loaded: false 
    };
  }
};

// ============ FIELD MANAGEMENT ============
export const createField = async (fieldData) => {
  return await apiCall(API_URLS.FIELDS, {
    method: 'POST',
    body: JSON.stringify(fieldData),
  });
};

export const getUserFields = async () => {
  return await apiCall(API_URLS.FIELDS);
};

export const getFieldById = async (fieldId) => {
  return await apiCall(API_URLS.FIELD_BY_ID(fieldId));
};

export const updateField = async (fieldId, updateData) => {
  return await apiCall(API_URLS.FIELD_BY_ID(fieldId), {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
};

export const deleteField = async (fieldId) => {
  return await apiCall(API_URLS.FIELD_BY_ID(fieldId), {
    method: 'DELETE',
  });
};

// ============ CROP LIFECYCLE MANAGEMENT ============
export const createCropLifecycle = async (cropData) => {
  return await apiCall(API_URLS.CROPS, {
    method: 'POST',
    body: JSON.stringify(cropData),
  });
};

export const getUserCrops = async () => {
  return await apiCall(API_URLS.CROPS);
};

export const getCropById = async (cropId) => {
  return await apiCall(API_URLS.CROP_BY_ID(cropId));
};

export const getCropsByField = async (fieldId) => {
  return await apiCall(API_URLS.CROPS_BY_FIELD(fieldId));
};

export const updateCropStage = async (cropId, stageData) => {
  return await apiCall(API_URLS.CROP_STAGE_UPDATE(cropId), {
    method: 'POST',
    body: JSON.stringify(stageData),
  });
};

export const addIrrigationRecord = async (cropId, irrigationData) => {
  return await apiCall(API_URLS.CROP_IRRIGATION(cropId), {
    method: 'POST',
    body: JSON.stringify(irrigationData),
  });
};

export const addFertilizerRecord = async (cropId, fertilizerData) => {
  return await apiCall(API_URLS.CROP_FERTILIZER(cropId), {
    method: 'POST',
    body: JSON.stringify(fertilizerData),
  });
};

// ============ YIELD PREDICTION ============
export const createYieldPrediction = async (predictionData) => {
  return await apiCall(API_URLS.YIELD_PREDICTIONS, {
    method: 'POST',
    body: JSON.stringify(predictionData),
  });
};

export const getUserYieldPredictions = async () => {
  return await apiCall(API_URLS.YIELD_PREDICTIONS);
};

export const getYieldPredictionById = async (predictionId) => {
  return await apiCall(API_URLS.YIELD_PREDICTION_BY_ID(predictionId));
};

export const updateActualYield = async (predictionId, actualData) => {
  return await apiCall(API_URLS.YIELD_ACTUAL_UPDATE(predictionId), {
    method: 'POST',
    body: JSON.stringify(actualData),
  });
};

// ============ USER SESSION ============
export const getUserSession = async () => {
  return await apiCall(API_URLS.SESSION);
};

// ============ ML PREDICTIONS ============
export const predictCropCycle = async (cropType, sowingDate) => {
  return await apiCall(API_URLS.CROP_CYCLE_PREDICTION, {
    method: 'POST',
    body: JSON.stringify({
      crop_type: cropType,
      sowing_date: sowingDate,
    }),
  });
};

export const getCropInfo = async (cropType, plantingDate) => {
  return await apiCall(API_URLS.CROP_INFO, {
    method: 'POST',
    body: JSON.stringify({
      crop_type: cropType,
      planting_date: plantingDate,
    }),
  });
};

export const getGrowthStages = async () => {
  return await apiCall(API_URLS.GROWTH_STAGES);
};

export const getIrrigationSchedule = async () => {
  return await apiCall(API_URLS.IRRIGATION_SCHEDULE);
};

export const getFertilizerSchedule = async () => {
  return await apiCall(API_URLS.FERTILIZER_SCHEDULE);
};

export const getWaterBalance = async () => {
  return await apiCall(API_URLS.WATER_BALANCE);
};

// ============ LEGACY FUNCTIONS (with fallback) ============

// Function to fetch vegetation indices data
export const fetchVegetationIndices = async (indexName) => {
  try {
    const response = await fetch(`/local_csv/${indexName}.csv`);
    const csvData = await response.text();
    return parseCSV(csvData);
  } catch (error) {
    console.error(`Error loading ${indexName} data:`, error);
    return [];
  }
};

// Function to fetch weather forecast data
export const fetchWeatherForecast = async (location) => {
  return {
    location,
    forecast: [
      { date: '2025-08-15', high: 32, low: 24, condition: 'sunny' },
      { date: '2025-08-16', high: 30, low: 23, condition: 'partly_cloudy' },
      { date: '2025-08-17', high: 29, low: 22, condition: 'cloudy' },
      { date: '2025-08-18', high: 31, low: 23, condition: 'sunny' },
      { date: '2025-08-19', high: 33, low: 25, condition: 'sunny' },
    ]
  };
};

// Function to fetch all fields (with Flask backend integration)
export const fetchFields = async () => {
  try {
    const response = await getUserFields();
    
    if (response.success && Array.isArray(response.data)) {
      return response.data.map(field => ({
        id: field._id || field.id,
        name: field.field_name,
        crop: field.current_crop || 'Not specified',
        area: field.area || 0,
        status: field.status || 'Active',
        lastIrrigated: field.last_irrigated || new Date().toISOString().split('T')[0],
        soilMoisture: field.soil_moisture || Math.floor(Math.random() * 20) + 60,
        coordinates: field.coordinates || []
      }));
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.warn('Flask API not available, using fallback field data:', error.message);
    
    return [
      {
        id: 1,
        name: "North Field",
        crop: "Wheat",
        area: 5.2,
        status: "Active",
        lastIrrigated: "2025-09-07",
        soilMoisture: 68,
        coordinates: [
          { lat: 28.6139, lng: 77.2090 },
          { lat: 28.6149, lng: 77.2090 },
          { lat: 28.6149, lng: 77.2110 },
          { lat: 28.6139, lng: 77.2110 }
        ]
      },
      {
        id: 2,
        name: "South Field",
        crop: "Rice",
        area: 3.8,
        status: "Active",
        lastIrrigated: "2025-09-06",
        soilMoisture: 72,
        coordinates: [
          { lat: 28.6120, lng: 77.2090 },
          { lat: 28.6130, lng: 77.2090 },
          { lat: 28.6130, lng: 77.2110 },
          { lat: 28.6120, lng: 77.2110 }
        ]
      }
    ];
  }
};

// Function to fetch a specific field by ID (with Flask backend integration)
export const fetchFieldData = async (fieldId) => {
  try {
    const response = await getFieldById(fieldId);
    
    if (response.success && response.data) {
      const field = response.data;
      const fieldSize = calculateFieldArea(field.coordinates || []);
      
      return {
        id: field._id || field.id,
        name: field.field_name,
        size: fieldSize.toFixed(2),
        location: field.location || 'Unknown',
        crop: field.current_crop || 'Not specified',
        crops: [field.current_crop || 'Not specified'],
        mainCrop: field.current_crop || 'Not specified',
        soilType: field.soil_type || 'Clay Loam',
        plantingDate: field.planting_date || '2025-06-10',
        coordinates: field.coordinates || [],
        ndviHistory: field.ndvi_history || [
          { date: '2025-07-15', value: 0.65 },
          { date: '2025-07-22', value: 0.68 },
          { date: '2025-07-29', value: 0.72 },
          { date: '2025-08-05', value: 0.75 },
          { date: '2025-08-12', value: 0.78 },
        ]
      };
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.warn('Flask API not available for field data:', error.message);
    
    return {
      id: fieldId,
      name: `Field ${fieldId}`,
      size: 20,
      location: 'Unknown',
      crop: 'Wheat',
      crops: ['Wheat'],
      mainCrop: 'Wheat',
      soilType: 'Clay Loam',
      plantingDate: '2025-06-10',
      coordinates: [],
      ndviHistory: [
        { date: '2025-07-15', value: 0.65 },
        { date: '2025-07-22', value: 0.68 },
        { date: '2025-07-29', value: 0.72 },
        { date: '2025-08-05', value: 0.75 },
        { date: '2025-08-12', value: 0.78 },
      ]
    };
  }
};

// Function to update manipal.json (legacy compatibility)
export const updateManipalCoordinates = async (fieldId) => {
  if (!fieldId) {
    return { success: false, message: 'Field ID is required' };
  }
  
  return { 
    success: true, 
    message: 'Feature not implemented in Flask backend',
    offline: true 
  };
};

// Helper function to calculate field area in acres from coordinates
function calculateFieldArea(coordinates) {
  if (!coordinates || coordinates.length < 3) return 0;

  let area = 0;
  for (let i = 0; i < coordinates.length; i++) {
    const j = (i + 1) % coordinates.length;
    area += coordinates[i].lat * coordinates[j].lng;
    area -= coordinates[j].lat * coordinates[i].lng;
  }

  area = Math.abs(area) / 2;
  
  const degreeToMeter = 111319.9;
  const squareMetersToHectares = 0.0001;
  const hectaresToAcres = 2.47105;
  
  return area * Math.pow(degreeToMeter, 2) * squareMetersToHectares * hectaresToAcres;
}