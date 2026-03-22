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
  faPlus,
  faSeedling,
  faSpinner,
  faWheatAwn
} from '@fortawesome/free-solid-svg-icons';
import { createCropLifecycle, getCropsByField, getUserFields, normalizeField } from '../services/dataService';

const surfaceCard = 'rounded-3xl border border-white/60 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur';

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '—');

const heroMetricClasses = [
  'from-emerald-500/20 to-green-500/5 text-emerald-950',
  'from-cyan-500/20 to-sky-500/5 text-cyan-950',
  'from-amber-500/20 to-yellow-500/5 text-amber-950'
];

const statCards = [
  { label: 'Managed Fields', icon: faLeaf, getValue: (fieldCount) => fieldCount, note: 'ready for lifecycle planning' },
  { label: 'Saved Crop Cycles', icon: faSeedling, getValue: (_, cropCount) => cropCount, note: 'persisted in the database' },
  { label: 'Active Timeline Steps', icon: faArrowTrendUp, getValue: (_, __, timelineCount) => timelineCount, note: 'from the latest prediction' }
];

const MetricCard = ({ icon, label, value, note, toneIndex = 0 }) => (
  <div className={`rounded-3xl bg-gradient-to-br ${heroMetricClasses[toneIndex % heroMetricClasses.length]} border border-white/60 p-5 shadow-lg`}>
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">{label}</p>
        <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
        <p className="mt-2 text-sm text-gray-600">{note}</p>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-lg shadow-inner">
        <FontAwesomeIcon icon={icon} />
      </div>
    </div>
  </div>
);

const SectionHeading = ({ eyebrow, title, description, action }) => (
  <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-600">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>}
    </div>
    {action}
  </div>
);

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

  const heroStats = statCards.map((card) => ({
    ...card,
    value: card.getValue(fields.length, crops.length, latestTimeline.length)
  }));

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_28%),linear-gradient(180deg,_#f7fee7_0%,_#f8fafc_40%,_#ffffff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 p-6 text-white shadow-[0_30px_100px_rgba(5,46,22,0.32)] sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.25),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(110,231,183,0.22),_transparent_35%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100">
                <FontAwesomeIcon icon={faSeedling} />
                Smart lifecycle workspace
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
                Beautiful crop planning, now connected to your backend.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/90 sm:text-base">
                Create crop lifecycles, visualize growth timelines, and review irrigation activity in a cleaner, more polished farmer dashboard experience.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm text-emerald-50 backdrop-blur">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                    <FontAwesomeIcon icon={faLeaf} />
                  </span>
                  <div>
                    <div className="font-semibold">Selected field</div>
                    <div className="text-emerald-100/80">{selectedFieldData?.name || 'Choose a field to begin'}</div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm text-emerald-50 backdrop-blur">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                    <FontAwesomeIcon icon={faWheatAwn} />
                  </span>
                  <div>
                    <div className="font-semibold">Current crop</div>
                    <div className="text-emerald-100/80">{selectedFieldData?.crop || 'Not specified yet'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {heroStats.map((stat, index) => (
                <MetricCard key={stat.label} {...stat} toneIndex={index} />
              ))}
            </div>
          </div>
        </section>

        {fieldsLoading ? (
          <div className={`${surfaceCard} flex items-center justify-center gap-3 px-6 py-16 text-slate-600`}>
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-emerald-600" />
            <span className="text-lg font-medium">Loading fields...</span>
          </div>
        ) : error && !fields.length ? (
          <div className={`${surfaceCard} p-10 text-center`}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl" />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-slate-900">We couldn&apos;t load your fields</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">{error}</p>
          </div>
        ) : !fields.length ? (
          <div className={`${surfaceCard} p-10 text-center`}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <FontAwesomeIcon icon={faSeedling} className="text-2xl" />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-slate-900">No fields available yet</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Create your first field to attach lifecycle records, timelines, and irrigation planning data.
            </p>
            <a href="/create-field" className="mt-6 inline-flex rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700">
              Create your first field
            </a>
          </div>
        ) : (
          <>
            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className={`${surfaceCard} p-6 sm:p-8`}>
                <SectionHeading
                  eyebrow="Overview"
                  title="Field intelligence at a glance"
                  description="Switch between fields and instantly see the crop, area, and lifecycle readiness in a more premium dashboard layout."
                  action={
                    <select
                      value={selectedField}
                      onChange={(e) => setSelectedField(e.target.value)}
                      className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-sm outline-none ring-0 transition focus:border-emerald-300"
                    >
                      {fields.map((field) => (
                        <option key={field.id} value={field.id}>{field.name}</option>
                      ))}
                    </select>
                  }
                />

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-white p-5 ring-1 ring-emerald-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
                      <FontAwesomeIcon icon={faLeaf} />
                    </div>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-emerald-600">Field name</p>
                    <h3 className="mt-2 text-2xl font-black text-slate-900">{selectedFieldData?.name || '—'}</h3>
                    <p className="mt-2 text-sm text-slate-500">Your selected production zone.</p>
                  </div>

                  <div className="rounded-3xl bg-gradient-to-br from-cyan-50 to-white p-5 ring-1 ring-cyan-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-lg shadow-cyan-200">
                      <FontAwesomeIcon icon={faSeedling} />
                    </div>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-cyan-600">Current crop</p>
                    <h3 className="mt-2 text-2xl font-black text-slate-900">{selectedFieldData?.crop || 'Not specified'}</h3>
                    <p className="mt-2 text-sm text-slate-500">Default crop attached to this field.</p>
                  </div>

                  <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-white p-5 ring-1 ring-amber-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-200">
                      <FontAwesomeIcon icon={faWheatAwn} />
                    </div>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-amber-600">Field area</p>
                    <h3 className="mt-2 text-2xl font-black text-slate-900">{selectedFieldData?.area || 0} ha</h3>
                    <p className="mt-2 text-sm text-slate-500">Used for crop and yield planning.</p>
                  </div>
                </div>
              </div>

              <div className={`${surfaceCard} p-6 sm:p-8`}>
                <SectionHeading
                  eyebrow="Create"
                  title="Launch a new crop cycle"
                  description="Create polished lifecycle entries directly from the frontend and save them into the backend database."
                  action={
                    <button
                      onClick={() => setShowPredictionForm((value) => !value)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      {showPredictionForm ? 'Hide form' : 'Add new crop'}
                    </button>
                  }
                />

                <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">Crop name</label>
                      <input
                        value={cropName}
                        onChange={(e) => setCropName(e.target.value)}
                        placeholder="e.g. Wheat, Rice, Maize"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">Sowing date</label>
                      <input
                        type="date"
                        value={sowingDate}
                        onChange={(e) => setSowingDate(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                      />
                    </div>
                  </div>

                  <div className={`grid transition-all duration-300 ${showPredictionForm ? 'mt-5 opacity-100' : 'mt-0 max-h-0 overflow-hidden opacity-0'}`}>
                    <div className="rounded-2xl bg-white p-4 text-sm text-slate-600 ring-1 ring-slate-200">
                      A saved lifecycle will automatically refresh the timeline cards below for the selected field.
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap justify-end gap-3">
                    <button
                      onClick={() => {
                        setShowPredictionForm(false);
                        setCropName('');
                        setSowingDate('');
                        setError('');
                      }}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleCreateCrop}
                      disabled={isLoading || !showPredictionForm}
                      className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FontAwesomeIcon icon={isLoading ? faSpinner : faArrowTrendUp} className={isLoading ? 'animate-spin' : ''} />
                      {isLoading ? 'Saving lifecycle...' : 'Predict & save'}
                    </button>
                  </div>
                </div>

                {successMessage && (
                  <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                    {successMessage}
                  </div>
                )}
                {error && (
                  <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}
              </div>
            </section>

            <section className={`${surfaceCard} p-6 sm:p-8`}>
              <SectionHeading
                eyebrow="Library"
                title="Saved lifecycle records"
                description="Every crop cycle attached to the field is presented as a cleaner card stack for faster scanning."
                action={cropLoading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xl text-emerald-600" /> : null}
              />

              {!crops.length ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-slate-500">
                  No crop lifecycle records have been saved for this field yet.
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {crops.map((crop, index) => (
                    <article key={crop._id} className="group rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-white/90">
                            Cycle {index + 1}
                          </div>
                          <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-900">{crop.crop_name}</h3>
                          <p className="mt-2 text-sm text-slate-500">Sown on {formatDate(crop.sowing_date)}</p>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                          {crop.current_stage || 'seeded'}
                        </span>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Harvest date</p>
                          <p className="mt-2 text-base font-bold text-slate-900">{formatDate(crop.expected_harvest_date)}</p>
                        </div>
                        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Water used</p>
                          <p className="mt-2 text-base font-bold text-slate-900">{crop.irrigation?.total_water_used || 0}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {latestCrop && (
              <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <div className={`${surfaceCard} p-6 sm:p-8`}>
                  <SectionHeading
                    eyebrow="Timeline"
                    title="Latest prediction summary"
                    description="A richer visual summary of the newest saved crop lifecycle with cleaner stage presentation."
                  />

                  <div className="grid gap-4 sm:grid-cols-3">
                    <MetricCard icon={faSeedling} label="Crop" value={latestCrop.crop_name} note="latest saved lifecycle" toneIndex={0} />
                    <MetricCard icon={faCalendarAlt} label="Harvest date" value={formatDate(latestCrop.expected_harvest_date)} note="estimated completion" toneIndex={1} />
                    <MetricCard icon={faDroplet} label="Irrigation" value={latestCrop.irrigation?.total_water_used || 0} note="recorded water usage" toneIndex={2} />
                  </div>

                  <div className="mt-8 space-y-4">
                    {latestTimeline.length ? latestTimeline.map((stage, index) => (
                      <div key={`${stage.Stage || stage.stage_name}-${index}`} className="flex gap-4 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="flex flex-col items-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
                            <FontAwesomeIcon icon={index === 0 ? faSeedling : faArrowTrendUp} />
                          </div>
                          {index !== latestTimeline.length - 1 && <div className="mt-3 h-full w-px bg-emerald-200" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h4 className="text-lg font-bold text-slate-900">{stage.Stage || stage.stage_name}</h4>
                              <p className="mt-1 text-sm text-slate-500">
                                {formatDate(stage.Start || stage.start_date)} to {formatDate(stage.End || stage.end_date)}
                              </p>
                            </div>
                            <div className="rounded-2xl bg-white px-4 py-2 text-right ring-1 ring-slate-200">
                              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Duration</p>
                              <p className="mt-1 text-base font-black text-slate-900">{stage.Duration_Days || stage.duration_days || '—'} days</p>
                            </div>
                          </div>
                          <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-100">
                            {stage.Irrigation_Need || stage.kc_value || 'Saved lifecycle stage'}
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-500">
                        No growth stages available.
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className={`${surfaceCard} p-6 sm:p-8`}>
                    <SectionHeading
                      eyebrow="Irrigation"
                      title="Weekly irrigation schedule"
                      description="A cleaner side panel for irrigation checkpoints and saved watering records."
                    />

                    <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                      {latestCrop.irrigation?.schedule?.length ? latestCrop.irrigation.schedule.map((week, index) => (
                        <div key={index} className="rounded-3xl bg-gradient-to-br from-cyan-50 to-white p-4 ring-1 ring-cyan-100">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold text-slate-900">{formatDate(week.Week_Start || week.date)}</p>
                              <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-600">{week.Stage || week.method || 'Irrigation'}</p>
                            </div>
                            <div className="rounded-2xl bg-cyan-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-cyan-200">
                              {week.Irrigation_Need || `${week.amount_mm || 0} mm`}
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-500">
                          No irrigation schedule saved yet.
                        </div>
                      )}
                    </div>
                  </div>

                  {activeStage && (
                    <div className={`${surfaceCard} overflow-hidden`}>
                      <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-500 px-6 py-6 text-white">
                        <p className="text-xs font-bold uppercase tracking-[0.26em] text-emerald-50">Current stage</p>
                        <h3 className="mt-3 text-3xl font-black tracking-tight">{activeStage.Stage || activeStage.stage_name}</h3>
                        <p className="mt-2 text-sm text-emerald-50/90">Focused summary of the current lifecycle phase from the saved backend record.</p>
                      </div>
                      <div className="p-6">
                        <div className="grid gap-4">
                          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                            <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                              <FontAwesomeIcon icon={faCalendarAlt} className="text-emerald-600" />
                              Started on {formatDate(activeStage.Start || activeStage.start_date)}
                            </div>
                          </div>
                          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                            <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                              <FontAwesomeIcon icon={faDroplet} className="text-cyan-600" />
                              Irrigation plan: {activeStage.Irrigation_Need || 'Saved in record'}
                            </div>
                          </div>
                          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                            <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                              <FontAwesomeIcon icon={faClockRotateLeft} className="text-indigo-600" />
                              Duration: {activeStage.Duration_Days || activeStage.duration_days || '—'} days
                            </div>
                          </div>
                          <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800 ring-1 ring-emerald-100">
                            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                            Review the saved timeline and keep irrigation/fertilizer records updated to maintain prediction quality.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CropLifecycle;
