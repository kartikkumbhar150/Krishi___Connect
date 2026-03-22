import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown,
  faArrowTrendUp,
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

const surfaceCard = 'rounded-3xl border border-white/60 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur';

const predictionPeriods = [
  { id: 'current-season', name: 'Current Season' },
  { id: 'next-season', name: 'Next Season' },
  { id: 'annual', name: 'Annual Forecast' }
];

const formatValue = (value, suffix = '') => `${value}${suffix}`;

const OverviewCard = ({ icon, label, value, caption, accent }) => (
  <div className={`rounded-3xl bg-gradient-to-br ${accent} p-5 ring-1 ring-white/60 shadow-lg`}>
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">{label}</p>
        <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-900">{value}</h3>
        <p className="mt-2 text-sm text-slate-600">{caption}</p>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-lg text-slate-900 shadow-inner">
        <FontAwesomeIcon icon={icon} />
      </div>
    </div>
  </div>
);

const SectionHeading = ({ eyebrow, title, description, action }) => (
  <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-600">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>}
    </div>
    {action}
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

  const currentField = useMemo(() => fields.find((f) => f.id === selectedField), [fields, selectedField]);
  const latestCrop = useMemo(() => (fieldCrops.length ? fieldCrops[0] : null), [fieldCrops]);
  const latestSavedPrediction = useMemo(
    () => savedPredictions.find((prediction) => prediction.field_id === selectedField),
    [savedPredictions, selectedField]
  );

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
  const expectedHarvest = ((prediction?.predictedYield || 0) * (currentField?.area || 0)).toFixed(1);
  const trendPercent = Math.abs((((prediction?.predictedYield || 0) - (prediction?.currentYield || 0)) / (prediction?.currentYield || 1)) * 100).toFixed(1);

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

  const getTrendIcon = (trend) => (trend === 'up' ? faArrowUp : trend === 'down' ? faArrowDown : faEquals);
  const getTrendColor = (trend) => (trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-slate-600');
  const getRiskColor = (impact) => (impact === 'High' ? 'bg-red-50 text-red-700 ring-red-100' : 'bg-amber-50 text-amber-700 ring-amber-100');
  const getFactorColor = (score) => (score >= 90 ? 'bg-emerald-500' : score >= 80 ? 'bg-sky-500' : score >= 70 ? 'bg-amber-500' : 'bg-rose-500');

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.12),_transparent_28%),linear-gradient(180deg,_#eff6ff_0%,_#f8fafc_42%,_#ffffff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-gradient-to-br from-slate-950 via-sky-900 to-blue-700 p-6 text-white shadow-[0_30px_100px_rgba(2,6,23,0.35)] sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.24),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(125,211,252,0.2),_transparent_35%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.25fr_0.95fr] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-100">
                <FontAwesomeIcon icon={faChartLine} />
                Premium prediction dashboard
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
                Turn saved farm data into a dashboard farmers actually love using.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-sky-50/90 sm:text-base">
                Review yield outlooks, market value, harvest timing, and risk signals in a much more polished UI while saving predictions back to the backend.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-sky-50 backdrop-blur">
                  <div className="font-semibold">Selected field</div>
                  <div className="text-sky-100/80">{currentField?.name || 'Choose a field'}</div>
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-sky-50 backdrop-blur">
                  <div className="font-semibold">Prediction mode</div>
                  <div className="text-sky-100/80">{predictionPeriods.find((period) => period.id === predictionPeriod)?.name}</div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <OverviewCard icon={faWheatAwn} label="Predicted yield" value={formatValue(prediction?.predictedYield || 0, ' t/ha')} caption="forecast generated from saved field and crop records" accent="from-cyan-500/20 to-sky-500/5" />
              <OverviewCard icon={faCalendarCheck} label="Harvest ETA" value={prediction?.harvestDate ? new Date(prediction.harvestDate).toLocaleDateString() : '—'} caption={`${prediction?.daysToHarvest || 0} days remaining`} accent="from-indigo-500/20 to-blue-500/5" />
              <OverviewCard icon={faFloppyDisk} label="Saved forecasts" value={savedPredictions.length} caption="predictions already persisted in the database" accent="from-emerald-500/20 to-teal-500/5" />
            </div>
          </div>
        </section>

        {fieldsLoading ? (
          <div className={`${surfaceCard} flex items-center justify-center gap-3 px-6 py-16 text-slate-600`}>
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-sky-600" />
            <span className="text-lg font-medium">Loading fields...</span>
          </div>
        ) : error && !fields.length ? (
          <div className={`${surfaceCard} p-10 text-center`}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl" />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-slate-900">We couldn&apos;t load your prediction workspace</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">{error}</p>
          </div>
        ) : !fields.length ? (
          <div className={`${surfaceCard} p-10 text-center`}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <FontAwesomeIcon icon={faWheatAwn} className="text-2xl" />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-slate-900">No fields available yet</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">Create a field first so the prediction page has real field and crop records to analyze.</p>
            <a href="/create-field" className="mt-6 inline-flex rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:-translate-y-0.5 hover:bg-sky-700">
              Create your first field
            </a>
          </div>
        ) : (
          <>
            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className={`${surfaceCard} p-6 sm:p-8`}>
                <SectionHeading
                  eyebrow="Overview"
                  title="Prediction control center"
                  description="Switch fields, choose prediction windows, and review the most important forecast numbers in a layout that feels much more premium."
                  action={
                    <div className="flex flex-wrap gap-3">
                      <select value={selectedField} onChange={(e) => setSelectedField(e.target.value)} className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-900 shadow-sm outline-none transition focus:border-sky-300">
                        {fields.map((field) => <option key={field.id} value={field.id}>{field.name} - {field.crop}</option>)}
                      </select>
                      <select value={predictionPeriod} onChange={(e) => setPredictionPeriod(e.target.value)} className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-900 shadow-sm outline-none transition focus:border-indigo-300">
                        {predictionPeriods.map((period) => <option key={period.id} value={period.id}>{period.name}</option>)}
                      </select>
                    </div>
                  }
                />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <OverviewCard icon={faLeaf} label="Field" value={currentField?.name || '—'} caption={`${currentField?.area || 0} hectares monitored`} accent="from-sky-500/18 to-cyan-500/5" />
                  <OverviewCard icon={faWheatAwn} label="Crop" value={prediction?.cropName || '—'} caption={latestCrop?.sowing_date ? `Planted ${new Date(latestCrop.sowing_date).toLocaleDateString()}` : 'Waiting for lifecycle data'} accent="from-emerald-500/18 to-teal-500/5" />
                  <OverviewCard icon={faCalendarCheck} label="Harvest" value={prediction?.harvestDate ? new Date(prediction.harvestDate).toLocaleDateString() : '—'} caption={`${prediction?.daysToHarvest || 0} days remaining`} accent="from-violet-500/18 to-indigo-500/5" />
                  <OverviewCard icon={faChartLine} label="Confidence" value={formatValue(prediction?.confidence || 0, '%')} caption="model confidence score" accent="from-amber-500/18 to-orange-500/5" />
                </div>
              </div>

              <div className={`${surfaceCard} p-6 sm:p-8`}>
                <SectionHeading
                  eyebrow="Action"
                  title="Save this forecast"
                  description="Persist the forecast in the database and make the prediction page feel like a polished decision tool instead of a rough prototype."
                  action={
                    <button
                      onClick={handleSavePrediction}
                      disabled={saving || !latestCrop}
                      className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FontAwesomeIcon icon={saving ? faSpinner : faFloppyDisk} className={saving ? 'animate-spin' : ''} />
                      {saving ? 'Saving...' : 'Save prediction'}
                    </button>
                  }
                />

                <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white shadow-xl">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-200">Current forecast</p>
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                      <div className="text-5xl font-black tracking-tight">{prediction?.predictedYield || 0}</div>
                      <div className="mt-1 text-sm text-sky-100/80">tons per hectare</div>
                    </div>
                    <div className={`inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ${getTrendColor(prediction?.trend)} ring-1 ring-white/10`}>
                      <FontAwesomeIcon icon={getTrendIcon(prediction?.trend)} />
                      {trendPercent}%
                    </div>
                  </div>
                  <div className="mt-6 h-3 rounded-full bg-white/10">
                    <div className="h-3 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400" style={{ width: `${((prediction?.predictedYield || 0) / (prediction?.maxYield || 1)) * 100}%` }} />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-sky-100/75">
                    <span>Range: {prediction?.minYield} - {prediction?.maxYield} t/ha</span>
                    <span>Expected harvest: {expectedHarvest} tons</span>
                  </div>
                </div>

                {successMessage && <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{successMessage}</div>}
                {error && <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className={`${surfaceCard} p-6 sm:p-8`}>
                <SectionHeading
                  eyebrow="Forecast"
                  title="Yield and revenue outlook"
                  description="Core forecast and revenue views, reworked with richer hierarchy and a cleaner information layout."
                />

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-3xl bg-gradient-to-br from-sky-50 to-white p-6 ring-1 ring-sky-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-slate-900">Yield forecast</h3>
                      <div className={`flex items-center gap-2 text-sm font-semibold ${getTrendColor(prediction?.trend)}`}>
                        <FontAwesomeIcon icon={getTrendIcon(prediction?.trend)} />
                        {trendPercent}%
                      </div>
                    </div>
                    <div className="mt-6 text-4xl font-black tracking-tight text-slate-900">{prediction?.predictedYield} t/ha</div>
                    <p className="mt-2 text-sm text-slate-500">Current season average: {prediction?.currentYield} t/ha</p>
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-slate-200"><span className="text-slate-500">Expected total harvest</span><span className="font-bold text-slate-900">{expectedHarvest} tons</span></div>
                      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-slate-200"><span className="text-slate-500">Prediction range</span><span className="font-bold text-slate-900">{prediction?.minYield} - {prediction?.maxYield} t/ha</span></div>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-white p-6 ring-1 ring-emerald-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-slate-900">Market analysis</h3>
                      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                        Strong outlook
                      </div>
                    </div>
                    <div className="mt-6 text-4xl font-black tracking-tight text-slate-900">₹{prediction?.price}</div>
                    <p className="mt-2 text-sm text-slate-500">Expected price at harvest per quintal</p>
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-slate-200"><span className="text-slate-500">Expected revenue</span><span className="font-bold text-emerald-700">₹{calculateRevenue(prediction?.predictedYield, prediction?.price).toLocaleString('en-IN')}</span></div>
                      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-slate-200"><span className="text-slate-500">Saved predictions</span><span className="font-bold text-slate-900">{savedPredictions.length}</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${surfaceCard} p-6 sm:p-8`}>
                <SectionHeading
                  eyebrow="Signals"
                  title="Factors affecting yield"
                  description="Operational signals presented as cleaner progress cards so the page feels more intentional and analytical."
                />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  {Object.entries(prediction?.factors || {}).map(([factor, score]) => (
                    <div key={factor} className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">{factor.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <div className="mt-2 text-3xl font-black text-slate-900">{score}%</div>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-white ring-1 ring-slate-200" />
                      </div>
                      <div className="mt-4 h-3 rounded-full bg-white ring-1 ring-slate-200">
                        <div className={`h-3 rounded-full ${getFactorColor(score)}`} style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className={`${surfaceCard} p-6 sm:p-8`}>
                <SectionHeading eyebrow="Risk" title="Risk assessment" description="The most important risk signals, redesigned into a more attractive alert stack." />
                <div className="space-y-4">
                  {(prediction?.risks || []).map((risk, index) => (
                    <div key={index} className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">{risk.risk}</h3>
                            <p className="mt-1 text-sm text-slate-500">Probability: {risk.probability}%</p>
                          </div>
                        </div>
                        <span className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] ring-1 ${getRiskColor(risk.impact)}`}>
                          {risk.impact} impact
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className={`${surfaceCard} p-6 sm:p-8`}>
                  <SectionHeading eyebrow="Guidance" title="AI recommendations" description="Actionable steps arranged in a cleaner recommendation feed." />
                  <div className="space-y-3">
                    {(prediction?.recommendations || []).map((recommendation, index) => (
                      <div key={index} className="flex gap-4 rounded-3xl bg-gradient-to-br from-blue-50 to-white p-4 ring-1 ring-blue-100">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                          <FontAwesomeIcon icon={faCheckCircle} />
                        </div>
                        <div className="flex-1 text-sm leading-6 text-slate-700">{recommendation}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`${surfaceCard} overflow-hidden`}>
                  <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500 px-6 py-6 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-50">History</p>
                    <h3 className="mt-3 text-3xl font-black tracking-tight">Performance snapshot</h3>
                    <p className="mt-2 text-sm text-emerald-50/90">A brighter summary of baseline yield, current forecast, and saved forecast volume.</p>
                  </div>
                  <div className="grid gap-4 p-6 md:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-4 text-center ring-1 ring-slate-200">
                      <FontAwesomeIcon icon={faHistory} className="text-2xl text-slate-400" />
                      <div className="mt-3 text-2xl font-black text-slate-900">{prediction?.currentYield}</div>
                      <div className="mt-1 text-sm text-slate-500">Baseline t/ha</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 text-center ring-1 ring-slate-200">
                      <FontAwesomeIcon icon={faChartLine} className="text-2xl text-sky-500" />
                      <div className="mt-3 text-2xl font-black text-slate-900">{prediction?.predictedYield}</div>
                      <div className="mt-1 text-sm text-slate-500">Forecast t/ha</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 text-center ring-1 ring-slate-200">
                      <FontAwesomeIcon icon={faRefresh} className="text-2xl text-emerald-500" />
                      <div className="mt-3 text-2xl font-black text-slate-900">{savedPredictions.length}</div>
                      <div className="mt-1 text-sm text-slate-500">Saved predictions</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default YieldPrediction;
