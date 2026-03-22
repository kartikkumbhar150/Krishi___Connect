import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faWheatAwn,
  faChartLine,
  faArrowUp,
  faArrowDown,
  faEquals,
  faLeaf,
  faExclamationTriangle,
  faCheckCircle,
  faRefresh,
  faHistory,
  faSpinner,
  faFloppyDisk
} from '@fortawesome/free-solid-svg-icons';
import {
  createYieldPrediction,
  getCropsByField,
  getUserFields,
  getUserYieldPredictions,
  normalizeField
} from '../services/dataService';

const YieldPrediction = () => {
  const [selectedField, setSelectedField] = useState('');
  const [predictionPeriod, setPredictionPeriod] = useState('current-season');
  const [fields, setFields] = useState([]);
  const [fieldCrops, setFieldCrops] = useState([]);
  const [savedPredictions, setSavedPredictions] = useState([]);
  const [fieldsLoading, setFieldsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchFields();
    fetchSavedPredictions();
  }, []);

  useEffect(() => {
    if (selectedField) {
      fetchFieldCrops(selectedField);
    }
  }, [selectedField]);

  const fetchFields = async () => {
    setFieldsLoading(true);
    setError('');
    try {
      const response = await getUserFields();
      if (response.success && Array.isArray(response.data)) {
        const mapped = response.data.map(normalizeField);
        setFields(mapped);
        if (mapped.length > 0) {
          setSelectedField((current) => current || mapped[0].id);
        }
      } else {
        setFields([]);
      }
    } catch (err) {
      setError(`Unable to load fields. ${err.message}`);
      setFields([]);
    } finally {
      setFieldsLoading(false);
    }
  };

  const fetchFieldCrops = async (fieldId) => {
    try {
      const response = await getCropsByField(fieldId);
      setFieldCrops(response.success && Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setFieldCrops([]);
      setError(`Unable to load crops for the selected field. ${err.message}`);
    }
  };

  const fetchSavedPredictions = async () => {
    try {
      const response = await getUserYieldPredictions();
      setSavedPredictions(response.success && Array.isArray(response.data) ? response.data : []);
    } catch {
      setSavedPredictions([]);
    }
  };

  const predictionPeriods = [
    { id: 'current-season', name: 'Current Season' },
    { id: 'next-season', name: 'Next Season' },
    { id: 'annual', name: 'Annual Forecast' }
  ];

  const currentField = useMemo(() => fields.find((f) => f.id === selectedField), [fields, selectedField]);
  const latestCrop = useMemo(() => (fieldCrops.length ? fieldCrops[0] : null), [fieldCrops]);
  const latestSavedPrediction = useMemo(() => savedPredictions.find((prediction) => prediction.field_id === selectedField), [savedPredictions, selectedField]);

  const generatedPrediction = useMemo(() => {
    if (!currentField) return null;
    const cropName = latestCrop?.crop_name || currentField.crop || 'Wheat';
    const cropFactors = {
      Wheat: { baseYield: 4.2, yieldVariation: 0.8, harvestMonths: 7, price: 2350 },
      Rice: { baseYield: 5.8, yieldVariation: 0.7, harvestMonths: 4, price: 2100 },
      Maize: { baseYield: 5.0, yieldVariation: 0.6, harvestMonths: 4, price: 1900 },
      Cotton: { baseYield: 2.7, yieldVariation: 0.4, harvestMonths: 6, price: 6800 },
      Tomato: { baseYield: 28, yieldVariation: 5, harvestMonths: 3, price: 22 }
    };
    const cropInfo = cropFactors[cropName] || cropFactors.Wheat;
    const plantedDate = new Date(latestCrop?.sowing_date || currentField.created_at || Date.now());
    const harvestDate = new Date(plantedDate);
    harvestDate.setMonth(harvestDate.getMonth() + cropInfo.harvestMonths);
    const predictedYield = Number((cropInfo.baseYield + cropInfo.yieldVariation / 2).toFixed(2));
    const currentYield = Number(cropInfo.baseYield.toFixed(2));
    return {
      cropName,
      currentYield,
      predictedYield,
      minYield: Number((cropInfo.baseYield - cropInfo.yieldVariation * 0.3).toFixed(2)),
      maxYield: Number((cropInfo.baseYield + cropInfo.yieldVariation * 1.2).toFixed(2)),
      confidence: 88,
      harvestDate: harvestDate.toISOString().split('T')[0],
      daysToHarvest: Math.max(0, Math.ceil((harvestDate - new Date()) / 86400000)),
      trend: predictedYield >= currentYield ? 'up' : 'down',
      price: cropInfo.price,
      risks: [
        { risk: 'Weather volatility', impact: 'Medium', probability: 30 },
        { risk: 'Nutrient imbalance', impact: 'Medium', probability: 20 }
      ],
      recommendations: [
        'Track irrigation records regularly to improve prediction accuracy.',
        'Keep fertilizer events updated in the lifecycle record.',
        'Review field soil parameters before the next growth stage.'
      ],
      factors: { weather: 84, soil: 87, irrigation: 82, cropHealth: 85, historicalPerformance: 80 }
    };
  }, [currentField, latestCrop]);

  const prediction = latestSavedPrediction?.predictions
    ? {
        cropName: latestSavedPrediction.prediction_parameters?.crop_name,
        currentYield: latestSavedPrediction.predictions.expected_yield_per_hectare,
        predictedYield: latestSavedPrediction.predictions.expected_yield_per_hectare,
        minYield: Math.max(0, latestSavedPrediction.predictions.expected_yield_per_hectare - 0.4),
        maxYield: latestSavedPrediction.predictions.expected_yield_per_hectare + 0.6,
        confidence: latestSavedPrediction.predictions.confidence_score,
        harvestDate: latestSavedPrediction.predictions.harvest_date_prediction || generatedPrediction?.harvestDate,
        daysToHarvest: generatedPrediction?.daysToHarvest || 0,
        trend: 'up',
        price: generatedPrediction?.price || 2350,
        risks: (latestSavedPrediction.predictions.risk_factors || []).map((risk) => ({ risk, impact: 'Medium', probability: 25 })),
        recommendations: latestSavedPrediction.predictions.recommendations || [],
        factors: generatedPrediction?.factors || {}
      }
    : generatedPrediction;

  const calculateRevenue = (yieldAmount, price) => Number(yieldAmount || 0) * Number(currentField?.area || 0) * Number(price || 0) * 10;

  const handleSavePrediction = async () => {
    if (!currentField || !latestCrop || !generatedPrediction) {
      setError('Create a crop lifecycle record first so a yield prediction can be saved.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccessMessage('');
    try {
      const response = await createYieldPrediction({
        field_id: currentField.id,
        crop_lifecycle_id: latestCrop._id,
        crop_name: generatedPrediction.cropName,
        field_area: currentField.area,
        sowing_date: latestCrop.sowing_date,
        current_stage: latestCrop.current_stage,
        irrigation_total: latestCrop.irrigation?.total_water_used || 0,
        nitrogen: latestCrop.sowing_parameters?.nitrogen || 25,
        phosphorus: latestCrop.sowing_parameters?.phosphorus || 15,
        potassium: latestCrop.sowing_parameters?.potassium || 20,
        ph: latestCrop.sowing_parameters?.ph || 6.5,
        predicted_harvest_date: generatedPrediction.harvestDate
      });
      if (!response.success) throw new Error(response.error || 'Failed to save prediction');
      setSuccessMessage('Yield prediction saved successfully in the database.');
      await fetchSavedPredictions();
    } catch (err) {
      setError(`Failed to save yield prediction. ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const getTrendIcon = (trend) => trend === 'up' ? faArrowUp : trend === 'down' ? faArrowDown : faEquals;
  const getTrendColor = (trend) => trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  const getRiskColor = (impact) => impact === 'High' ? 'text-red-600 bg-red-50' : 'text-yellow-600 bg-yellow-50';
  const getFactorColor = (score) => score >= 90 ? 'bg-green-500' : score >= 80 ? 'bg-blue-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Yield Prediction</h1>
            <p className="text-gray-600 mt-1">Generate predictions from saved field and crop data, then persist them through the Flask API.</p>
          </div>
          <div className="flex items-center space-x-3">
            <select value={selectedField} onChange={(e) => setSelectedField(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {fields.map((field) => <option key={field.id} value={field.id}>{field.name} - {field.crop}</option>)}
            </select>
            <select value={predictionPeriod} onChange={(e) => setPredictionPeriod(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {predictionPeriods.map((period) => <option key={period.id} value={period.id}>{period.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {fieldsLoading ? (
          <div className="flex items-center justify-center py-12"><FontAwesomeIcon icon={faSpinner} className="text-2xl text-blue-600 animate-spin mr-3" /><span className="text-lg text-gray-600">Loading fields...</span></div>
        ) : error && !fields.length ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"><FontAwesomeIcon icon={faExclamationTriangle} className="text-3xl text-red-600 mb-3" /><p className="text-red-700">{error}</p></div>
        ) : !fields.length ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300"><FontAwesomeIcon icon={faWheatAwn} className="text-4xl text-gray-400 mb-3" /><h3 className="text-xl font-semibold text-gray-700">No fields available</h3><p className="text-gray-600 mb-4">Create a field first to view yield predictions.</p><a href="/create-field" className="inline-block bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">Create your first field</a></div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Field Overview</h2>
                <button onClick={handleSavePrediction} disabled={saving || !latestCrop} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                  <FontAwesomeIcon icon={saving ? faSpinner : faFloppyDisk} className={saving ? 'animate-spin' : ''} />
                  {saving ? 'Saving...' : 'Save Prediction'}
                </button>
              </div>
              {successMessage && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">{successMessage}</div>}
              {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4"><div className="flex items-center mb-2"><FontAwesomeIcon icon={faLeaf} className="text-blue-600 mr-2" /><span className="font-medium text-gray-900">Field</span></div><p className="text-xl font-bold text-gray-900">{currentField?.name}</p><p className="text-sm text-gray-600">{currentField?.area} hectares</p></div>
                <div className="bg-green-50 rounded-lg p-4"><div className="flex items-center mb-2"><FontAwesomeIcon icon={faWheatAwn} className="text-green-600 mr-2" /><span className="font-medium text-gray-900">Crop</span></div><p className="text-xl font-bold text-gray-900">{prediction?.cropName}</p><p className="text-sm text-gray-600">Planted: {latestCrop?.sowing_date ? new Date(latestCrop.sowing_date).toLocaleDateString() : 'Not specified'}</p></div>
                <div className="bg-purple-50 rounded-lg p-4"><div className="flex items-center mb-2"><FontAwesomeIcon icon={faCalendarCheck} className="text-purple-600 mr-2" /><span className="font-medium text-gray-900">Harvest Date</span></div><p className="text-xl font-bold text-gray-900">{prediction?.harvestDate ? new Date(prediction.harvestDate).toLocaleDateString() : '—'}</p><p className="text-sm text-gray-600">{prediction?.daysToHarvest || 0} days remaining</p></div>
                <div className="bg-orange-50 rounded-lg p-4"><div className="flex items-center mb-2"><FontAwesomeIcon icon={faChartLine} className="text-orange-600 mr-2" /><span className="font-medium text-gray-900">Confidence</span></div><p className="text-xl font-bold text-gray-900">{prediction?.confidence || 0}%</p><p className="text-sm text-gray-600">Prediction accuracy</p></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Yield Forecast</h2>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2"><span className="text-sm text-gray-600">Predicted Yield</span><div className="flex items-center"><FontAwesomeIcon icon={getTrendIcon(prediction?.trend)} className={`mr-2 ${getTrendColor(prediction?.trend)}`} /><span className={`font-medium ${getTrendColor(prediction?.trend)}`}>{Math.abs((((prediction?.predictedYield || 0) - (prediction?.currentYield || 0)) / (prediction?.currentYield || 1) * 100)).toFixed(1)}%</span></div></div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{prediction?.predictedYield} tons/hectare</div>
                  <div className="text-sm text-gray-600 mb-4">Range: {prediction?.minYield} - {prediction?.maxYield} tons/hectare</div>
                  <div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-blue-500 h-3 rounded-full transition-all duration-300" style={{ width: `${((prediction?.predictedYield || 0) / (prediction?.maxYield || 1)) * 100}%` }}></div></div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="text-sm text-gray-600">Current Season Average</span><span className="font-medium text-gray-900">{prediction?.currentYield} tons/hectare</span></div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg"><span className="text-sm text-gray-600">Expected Total Harvest</span><span className="font-medium text-gray-900">{((prediction?.predictedYield || 0) * (currentField?.area || 0)).toFixed(1)} tons</span></div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Market Analysis</h2>
                <div className="mb-6"><div className="flex items-center justify-between mb-2"><span className="text-sm text-gray-600">Predicted Price at Harvest</span><div className="flex items-center"><FontAwesomeIcon icon={getTrendIcon('up')} className="mr-2 text-green-600" /><span className="font-medium text-green-600">+6.0%</span></div></div><div className="text-3xl font-bold text-gray-900 mb-1">₹{prediction?.price}/quintal</div><div className="text-sm text-gray-600 mb-4">Saved prediction can be refreshed at any time.</div></div>
                <div className="space-y-3"><div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="text-sm text-gray-600">Expected Revenue</span><span className="font-medium text-green-600">₹{calculateRevenue(prediction?.predictedYield, prediction?.price).toLocaleString('en-IN')}</span></div><div className="flex justify-between items-center p-3 bg-green-50 rounded-lg"><span className="text-sm text-gray-600">Saved Predictions</span><span className="font-medium text-green-700">{savedPredictions.length}</span></div></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Factors Affecting Yield</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">{Object.entries(prediction?.factors || {}).map(([factor, score]) => <div key={factor} className="text-center"><div className="mb-2"><div className="text-sm font-medium text-gray-900 capitalize mb-2">{factor.replace(/([A-Z])/g, ' $1').trim()}</div><div className="text-2xl font-bold text-gray-900">{score}%</div></div><div className="w-full bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full transition-all duration-300 ${getFactorColor(score)}`} style={{ width: `${score}%` }}></div></div></div>)}</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h2>
              <div className="space-y-3">{(prediction?.risks || []).map((risk, index) => <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"><div className="flex items-center"><FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 mr-3" /><div><div className="font-medium text-gray-900">{risk.risk}</div><div className="text-sm text-gray-600">Probability: {risk.probability}%</div></div></div><span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(risk.impact)}`}>{risk.impact} Impact</span></div>)}</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h2>
              <div className="space-y-3">{(prediction?.recommendations || []).map((recommendation, index) => <div key={index} className="flex items-start p-4 bg-blue-50 border border-blue-200 rounded-lg"><FontAwesomeIcon icon={faCheckCircle} className="text-blue-600 mt-1 mr-3" /><div className="text-blue-800">{recommendation}</div></div>)}</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Historical Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="text-center p-4 bg-gray-50 rounded-lg"><FontAwesomeIcon icon={faHistory} className="text-gray-500 text-2xl mb-2" /><div className="text-xl font-bold text-gray-900">{prediction?.currentYield} tons/ha</div><div className="text-sm text-gray-600">Most recent baseline</div></div><div className="text-center p-4 bg-gray-50 rounded-lg"><FontAwesomeIcon icon={faChartLine} className="text-blue-500 text-2xl mb-2" /><div className="text-xl font-bold text-gray-900">{prediction?.predictedYield} tons/ha</div><div className="text-sm text-gray-600">Current saved forecast</div></div><div className="text-center p-4 bg-green-50 rounded-lg"><FontAwesomeIcon icon={faRefresh} className="text-green-500 text-2xl mb-2" /><div className="text-xl font-bold text-green-600">{savedPredictions.length}</div><div className="text-sm text-gray-600">Predictions in database</div></div></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default YieldPrediction;
