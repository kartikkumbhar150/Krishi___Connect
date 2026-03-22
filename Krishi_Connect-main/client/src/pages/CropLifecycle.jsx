import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowTrendUp,
  faCalendarAlt,
  faCheckCircle,
  faClockRotateLeft,
  faDroplet,
  faExclamationTriangle,
  faLeaf,
  faSeedling,
  faSpinner,
  faWheatAwn,
  faPlus
} from '@fortawesome/free-solid-svg-icons';

import {
  createCropLifecycle,
  getCropsByField,
  getUserFields,
  normalizeField
} from '../services/dataService';

const surfaceCard =
  'rounded-3xl border border-white/60 bg-white/90 shadow-lg backdrop-blur';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString() : '—';

const CropLifecycle = () => {
  const [selectedField, setSelectedField] = useState('');
  const [fields, setFields] = useState([]);
  const [crops, setCrops] = useState([]);
  const [fieldsLoading, setFieldsLoading] = useState(true);
  const [cropLoading, setCropLoading] = useState(false);

  const [cropName, setCropName] = useState('');
  const [sowingDate, setSowingDate] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFields();
  }, []);

  useEffect(() => {
    if (selectedField) fetchCrops(selectedField);
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

  const fetchCrops = async (id) => {
    try {
      setCropLoading(true);
      const res = await getCropsByField(id);
      setCrops(res.data || []);
    } catch {
      setCrops([]);
    } finally {
      setCropLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!cropName || !sowingDate) {
      setError('Fill all fields');
      return;
    }

    try {
      setSaving(true);
      await createCropLifecycle({
        field_id: selectedField,
        crop_name: cropName,
        sowing_date: sowingDate
      });

      setSuccess('Saved successfully');
      setCropName('');
      setSowingDate('');
      setShowForm(false);
      fetchCrops(selectedField);
    } catch {
      setError('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const currentField = useMemo(
    () => fields.find((f) => f.id === selectedField),
    [fields, selectedField]
  );

  const latestCrop = crops[0];

  if (fieldsLoading) {
    return (
      <div className="flex justify-center p-10">
        <FontAwesomeIcon icon={faSpinner} spin />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Crop Lifecycle</h1>

      {/* Select Field */}
      <select
        value={selectedField}
        onChange={(e) => setSelectedField(e.target.value)}
        className="border p-2 rounded"
      >
        {fields.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>

      {/* Field Info */}
      <div className="grid grid-cols-3 gap-4">
        <div className={surfaceCard + " p-4"}>
          <FontAwesomeIcon icon={faLeaf} />
          <p>{currentField?.name}</p>
        </div>

        <div className={surfaceCard + " p-4"}>
          <FontAwesomeIcon icon={faSeedling} />
          <p>{currentField?.crop}</p>
        </div>

        <div className={surfaceCard + " p-4"}>
          <FontAwesomeIcon icon={faWheatAwn} />
          <p>{currentField?.area} ha</p>
        </div>
      </div>

      {/* Add Crop */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        <FontAwesomeIcon icon={faPlus} /> Add Crop
      </button>

      {showForm && (
        <div className={surfaceCard + " p-4 space-y-4"}>
          <input
            placeholder="Crop Name"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            className="border p-2 w-full"
          />

          <input
            type="date"
            value={sowingDate}
            onChange={(e) => setSowingDate(e.target.value)}
            className="border p-2 w-full"
          />

          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      {/* Crop List */}
      <div className="space-y-4">
        {cropLoading ? (
          <FontAwesomeIcon icon={faSpinner} spin />
        ) : !crops.length ? (
          <p>No crops yet</p>
        ) : (
          crops.map((c) => (
            <div key={c._id} className={surfaceCard + " p-4"}>
              <h3 className="font-bold">{c.crop_name}</h3>
              <p>Sown: {formatDate(c.sowing_date)}</p>
              <p>Harvest: {formatDate(c.expected_harvest_date)}</p>
            </div>
          ))
        )}
      </div>

      {/* Latest */}
      {latestCrop && (
        <div className={surfaceCard + " p-4"}>
          <h2 className="font-bold">Latest Crop</h2>
          <p>{latestCrop.crop_name}</p>
        </div>
      )}
    </div>
  );
};

export default CropLifecycle;