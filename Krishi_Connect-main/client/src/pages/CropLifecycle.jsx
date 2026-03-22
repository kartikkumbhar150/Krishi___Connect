import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSeedling,
  faLeaf,
  faWheatAwn,
  faCheckCircle,
  faCalendarAlt,
  faDroplet,
  faPlus,
  faSpinner,
  faExclamationTriangle,
  faClockRotateLeft
} from '@fortawesome/free-solid-svg-icons';
import { createCropLifecycle, getCropsByField, getUserFields, normalizeField } from '../services/dataService';

const CropLifecycle = () => {
  const [selectedField, setSelectedField] = useState('');
  const [showPredictionForm, setShowPredictionForm] = useState(false);
  const [cropName, setCropName] = useState('');
  const [sowingDate, setSowingDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState([]);
  const [crops, setCrops] = useState([]);
  const [fieldsLoading, setFieldsLoading] = useState(true);
  const [cropLoading, setCropLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchFields();
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
        const mappedFields = response.data.map(normalizeField);
        setFields(mappedFields);
        if (mappedFields.length > 0) {
          setSelectedField((current) => current || mappedFields[0].id);
        }
      } else {
        setFields([]);
        setError('Failed to load fields from database.');
      }
    } catch (err) {
      setFields([]);
      setError(`Unable to connect to server. ${err.message}`);
    } finally {
      setFieldsLoading(false);
    }
  };

  const fetchFieldCrops = async (fieldId) => {
    setCropLoading(true);
    setError('');
    try {
      const response = await getCropsByField(fieldId);
      setCrops(response.success && Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setCrops([]);
      setError(`Unable to load crop lifecycle data. ${err.message}`);
    } finally {
      setCropLoading(false);
    }
  };

  const handleCreateCrop = async () => {
    if (!selectedField || !cropName.trim() || !sowingDate) {
      setError('Please select a field and enter both crop name and sowing date.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await createCropLifecycle({
        field_id: selectedField,
        crop_name: cropName.trim(),
        sowing_date: sowingDate
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to create crop lifecycle.');
      }

      await fetchFieldCrops(selectedField);
      setSuccessMessage('Crop lifecycle saved successfully. The prediction is now stored in the database.');
      setCropName('');
      setSowingDate('');
      setShowPredictionForm(false);
    } catch (err) {
      setError(`Error saving crop lifecycle: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedFieldData = useMemo(
    () => fields.find((field) => field.id === selectedField),
    [fields, selectedField]
  );

  const latestCrop = useMemo(() => (crops.length > 0 ? crops[0] : null), [crops]);
  const latestTimeline = latestCrop?.growth_stages || [];
  const activeStage = latestTimeline.find((stage) => !stage.end_date) || latestTimeline[0] || null;

  const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '—');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Crop Lifecycle Tracking</h1>
            <p className="text-gray-600 mt-1">Create lifecycle records from the Flask API and store them in MongoDB.</p>
          </div>
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {fields.map((field) => (
              <option key={field.id} value={field.id}>{field.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {fieldsLoading ? (
          <div className="flex items-center justify-center py-12">
            <FontAwesomeIcon icon={faSpinner} className="text-2xl text-green-600 animate-spin mr-3" />
            <span className="text-lg text-gray-600">Loading fields...</span>
          </div>
        ) : error && !fields.length ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-3xl text-red-600 mb-3" />
            <p className="text-red-700">{error}</p>
          </div>
        ) : !fields.length ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <FontAwesomeIcon icon={faSeedling} className="text-4xl text-gray-400 mb-3" />
            <h3 className="text-xl font-semibold text-gray-700">No fields available</h3>
            <p className="text-gray-600 mb-4">Create a field first so crop lifecycle records can be attached to it.</p>
            <a href="/create-field" className="inline-block bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">Create your first field</a>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Field Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center mb-2"><FontAwesomeIcon icon={faLeaf} className="text-green-700 mr-2" /><span className="font-medium text-gray-900">Field Name</span></div>
                  <p className="text-xl font-bold text-gray-900">{selectedFieldData?.name || '—'}</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <div className="flex items-center mb-2"><FontAwesomeIcon icon={faSeedling} className="text-emerald-700 mr-2" /><span className="font-medium text-gray-900">Current Crop</span></div>
                  <p className="text-xl font-bold text-gray-900">{selectedFieldData?.crop || 'Not specified'}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="flex items-center mb-2"><FontAwesomeIcon icon={faWheatAwn} className="text-amber-700 mr-2" /><span className="font-medium text-gray-900">Field Area</span></div>
                  <p className="text-xl font-bold text-gray-900">{selectedFieldData?.area || 0} hectares</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                <h2 className="text-lg font-semibold text-gray-900">Crop Lifecycle Prediction</h2>
                <button onClick={() => setShowPredictionForm((v) => !v)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center">
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add New Crop
                </button>
              </div>

              {showPredictionForm && (
                <div className="border-t pt-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Crop Name</label>
                      <input value={cropName} onChange={(e) => setCropName(e.target.value)} placeholder="Enter crop name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sowing Date</label>
                      <input type="date" value={sowingDate} onChange={(e) => setSowingDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6 space-x-3">
                    <button onClick={() => setShowPredictionForm(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button onClick={handleCreateCrop} disabled={isLoading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                      {isLoading ? 'Saving...' : 'Predict & Save'}
                    </button>
                  </div>
                </div>
              )}

              {successMessage && <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">{successMessage}</div>}
              {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <h2 className="text-lg font-semibold text-gray-900">Saved Lifecycle Records</h2>
                {cropLoading && <FontAwesomeIcon icon={faSpinner} className="text-green-600 animate-spin" />}
              </div>

              {!crops.length ? (
                <p className="text-gray-600">No crop lifecycle records have been saved for this field yet.</p>
              ) : (
                <div className="space-y-4">
                  {crops.map((crop) => (
                    <div key={crop._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start gap-4 flex-wrap">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{crop.crop_name}</h3>
                          <p className="text-sm text-gray-600">Sown on {formatDate(crop.sowing_date)}</p>
                          <p className="text-sm text-gray-600">Expected harvest: {formatDate(crop.expected_harvest_date)}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">{crop.current_stage || 'seeded'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {latestCrop && (
              <>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Latest Prediction Summary</h2>
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div><p className="text-sm text-gray-600">Crop</p><p className="text-lg font-bold text-gray-900">{latestCrop.crop_name}</p></div>
                      <div><p className="text-sm text-gray-600">Harvest Date</p><p className="text-lg font-bold text-gray-900">{formatDate(latestCrop.expected_harvest_date)}</p></div>
                      <div><p className="text-sm text-gray-600">Total Irrigation</p><p className="text-lg font-bold text-gray-900">{latestCrop.irrigation?.total_water_used || 0}</p></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Growth Timeline</h4>
                      <div className="space-y-3">
                        {latestTimeline.length ? latestTimeline.map((stage, index) => (
                          <div key={`${stage.Stage || stage.stage_name}-${index}`} className="bg-white border rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-900">{stage.Stage || stage.stage_name}</p>
                                <p className="text-sm text-gray-600">{formatDate(stage.Start || stage.start_date)} to {formatDate(stage.End || stage.end_date)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{stage.Duration_Days || stage.duration_days || '—'} days</p>
                                <p className="text-xs text-green-700">{stage.Irrigation_Need || stage.kc_value || 'Saved'}</p>
                              </div>
                            </div>
                          </div>
                        )) : <p className="text-gray-600">No growth stages available.</p>}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Weekly Irrigation Schedule</h4>
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {latestCrop.irrigation?.schedule?.length ? latestCrop.irrigation.schedule.map((week, index) => (
                          <div key={index} className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{formatDate(week.Week_Start || week.date)}</p>
                                <p className="text-xs text-gray-600">{week.Stage || week.method || 'Irrigation'}</p>
                              </div>
                              <p className="text-sm font-medium text-cyan-700">{week.Irrigation_Need || `${week.amount_mm || 0} mm`}</p>
                            </div>
                          </div>
                        )) : <p className="text-gray-600">No irrigation schedule saved yet.</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {activeStage && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Stage</h2>
                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                            <FontAwesomeIcon icon={faSeedling} className="text-white text-lg" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{activeStage.Stage || activeStage.stage_name}</h3>
                            <p className="text-gray-600">Current saved lifecycle step from the backend.</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Started</div>
                          <div className="text-lg font-bold text-green-700">{formatDate(activeStage.Start || activeStage.start_date)}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Stage Metrics</h4>
                          <ul className="space-y-1 text-sm text-gray-700">
                            <li><FontAwesomeIcon icon={faCalendarAlt} className="text-green-500 mr-2 text-xs" />Duration: {activeStage.Duration_Days || activeStage.duration_days || '—'} days</li>
                            <li><FontAwesomeIcon icon={faDroplet} className="text-blue-500 mr-2 text-xs" />Irrigation: {activeStage.Irrigation_Need || 'Saved in record'}</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Recommended Actions</h4>
                          <ul className="space-y-1 text-sm text-gray-700">
                            <li><FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2 text-xs" />Review saved lifecycle timeline.</li>
                            <li><FontAwesomeIcon icon={faClockRotateLeft} className="text-blue-500 mr-2 text-xs" />Add irrigation and fertilizer events from the crop API as work progresses.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CropLifecycle;
