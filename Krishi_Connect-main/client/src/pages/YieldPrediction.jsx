import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown,
  faArrowUp,
  faCalendarCheck,
  faChartLine,
  faCheckCircle,
  faEquals,
  faExclamationTriangle,
  faFloppyDisk,
  faHistory,
  faLeaf,
  faRefresh,
  faSpinner,
  faWheatAwn
} from '@fortawesome/free-solid-svg-icons';

import {
  createYieldPrediction,
  getCropsByField,
  getUserFields,
  getUserYieldPredictions,
  normalizeField
} from '../services/dataService';

const surfaceCard =
  'rounded-3xl border border-white/60 bg-white/90 shadow-lg backdrop-blur';

const predictionPeriods = [
  { id: 'current-season', name: 'Current Season' },
  { id: 'next-season', name: 'Next Season' },
  { id: 'annual', name: 'Annual Forecast' }
];

const OverviewCard = ({ icon, label, value, caption }) => (
  <div className="rounded-2xl bg-white p-4 shadow">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <h3 className="text-xl font-bold">{value}</h3>
        <p className="text-sm text-gray-500">{caption}</p>
      </div>
      <FontAwesomeIcon icon={icon} />
    </div>
  </div>
);

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
    if (selectedField) fetchFieldCrops(selectedField);
  }, [selectedField]);

  const fetchFields = async () => {
    try {
      const res = await getUserFields();
      const mapped = res.data.map(normalizeField);
      setFields(mapped);
      if (mapped.length) setSelectedField(mapped[0].id);
    } catch {
      setError('Failed to load fields');
    } finally {
      setFieldsLoading(false);
    }
  };

  const fetchFieldCrops = async (id) => {
    try {
      const res = await getCropsByField(id);
      setFieldCrops(res.data || []);
    } catch {
      setFieldCrops([]);
    }
  };

  const fetchSavedPredictions = async () => {
    try {
      const res = await getUserYieldPredictions();
      setSavedPredictions(res.data || []);
    } catch {
      setSavedPredictions([]);
    }
  };

  const currentField = useMemo(
    () => fields.find((f) => f.id === selectedField),
    [fields, selectedField]
  );

  const latestCrop = useMemo(
    () => fieldCrops[0] || null,
    [fieldCrops]
  );

  const prediction = useMemo(() => {
    if (!currentField) return null;

    const base = 4.5;

    return {
      cropName: latestCrop?.crop_name || 'Wheat',
      currentYield: base,
      predictedYield: base + 0.5,
      minYield: base - 0.3,
      maxYield: base + 1,
      confidence: 85,
      harvestDate: '2026-06-01',
      daysToHarvest: 45,
      trend: 'up',
      price: 2300,
      factors: {
        weather: 80,
        soil: 85,
        irrigation: 78
      },
      risks: [
        { risk: 'Weather', impact: 'Medium', probability: 30 }
      ],
      recommendations: ['Improve irrigation tracking']
    };
  }, [currentField, latestCrop]);

  const handleSave = async () => {
    if (!currentField || !latestCrop) return;

    setSaving(true);
    try {
      await createYieldPrediction({
        field_id: currentField.id
      });
      setSuccessMessage('Saved!');
      fetchSavedPredictions();
    } catch {
      setError('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const getTrendIcon = (t) =>
    t === 'up' ? faArrowUp : t === 'down' ? faArrowDown : faEquals;

  const getTrendColor = (t) =>
    t === 'up' ? 'text-green-600' : 'text-red-600';

  if (fieldsLoading) {
    return (
      <div className="flex justify-center p-10">
        <FontAwesomeIcon icon={faSpinner} spin />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Yield Prediction</h1>

      {/* Controls */}
      <div className="flex gap-4">
        <select
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
        >
          {fields.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        <select
          value={predictionPeriod}
          onChange={(e) => setPredictionPeriod(e.target.value)}
        >
          {predictionPeriods.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-3 gap-4">
        <OverviewCard
          icon={faLeaf}
          label="Field"
          value={currentField?.name}
          caption={`${currentField?.area} ha`}
        />
        <OverviewCard
          icon={faWheatAwn}
          label="Crop"
          value={prediction?.cropName}
          caption="Active crop"
        />
        <OverviewCard
          icon={faChartLine}
          label="Yield"
          value={`${prediction?.predictedYield} t/ha`}
          caption="Prediction"
        />
      </div>

      {/* Prediction */}
      <div className={surfaceCard + ' p-6'}>
        <h2 className="font-bold mb-4">Forecast</h2>
        <div className="flex justify-between">
          <span>{prediction?.predictedYield} t/ha</span>
          <span className={getTrendColor(prediction?.trend)}>
            <FontAwesomeIcon icon={getTrendIcon(prediction?.trend)} /> Up
          </span>
        </div>
        <p>Range: {prediction?.minYield} - {prediction?.maxYield}</p>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {saving ? 'Saving...' : 'Save Prediction'}
      </button>

      {successMessage && <p className="text-green-600">{successMessage}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default YieldPrediction;