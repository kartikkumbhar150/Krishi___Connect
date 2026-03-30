import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt,
  faCloudRain,
  faIndianRupeeSign,
  faSeedling,
  faCalendarCheck,
  faCheckCircle,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

const insurancePlans = [
  {
    id: 'pmfby',
    name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    coverageType: 'Yield + Prevented Sowing + Post-harvest',
    premium: '1.5% - 5% (crop dependent)',
    claimWindow: 'Within 72 hours of damage event',
    idealFor: 'Small and marginal farmers',
    pros: ['Low premium', 'Government supported', 'Wide crop eligibility'],
    caution: 'Claim process may require local survey confirmation'
  },
  {
    id: 'weather-index',
    name: 'Weather Index Insurance',
    coverageType: 'Rainfall/temperature trigger-based',
    premium: '2% - 6%',
    claimWindow: 'Auto-triggered based on weather station data',
    idealFor: 'Rain-fed farming regions',
    pros: ['Quick settlement', 'No field-level loss assessment required', 'Transparent triggers'],
    caution: 'Payout may not exactly match actual field loss (basis risk)'
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive Multi-Risk Policy',
    coverageType: 'Flood + Drought + Pest + Fire + Storm',
    premium: '6% - 10%',
    claimWindow: 'Typically 7-15 days after incident report',
    idealFor: 'High-value crops and intensive farms',
    pros: ['Broad risk protection', 'Useful for commercial cultivation', 'Higher sum insured'],
    caution: 'Higher premium and stricter documentation'
  },
  {
    id: 'localized',
    name: 'Localized Peril Insurance',
    coverageType: 'Hailstorm, landslide, inundation, cloudburst',
    premium: '3% - 7%',
    claimWindow: '48-72 hours after localized event',
    idealFor: 'Regions with recurring extreme weather pockets',
    pros: ['Good for specific recurring local risks', 'Event-focused coverage', 'Can be bundled'],
    caution: 'Only covers listed local perils'
  }
];

const CropInsuranceSuggestions = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white shadow-lg md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">Financial Protection</p>
            <h1 className="mt-2 text-2xl font-bold md:text-3xl">Crop Insurance Suggestions & Comparison</h1>
            <p className="mt-3 text-sm text-emerald-50 md:text-base">
              Compare insurance options side-by-side and choose the best coverage for your crop type,
              weather risk, and budget.
            </p>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FontAwesomeIcon icon={faShieldAlt} />
              <span>4 policy categories</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {insurancePlans.map((plan) => (
          <article key={plan.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                <FontAwesomeIcon icon={faSeedling} />
              </span>
              <h2 className="text-sm font-semibold text-slate-900">{plan.name}</h2>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <p><span className="font-medium text-slate-800">Coverage:</span> {plan.coverageType}</p>
              <p className="flex items-start gap-2">
                <FontAwesomeIcon icon={faIndianRupeeSign} className="mt-0.5 text-emerald-600" />
                <span><span className="font-medium text-slate-800">Premium:</span> {plan.premium}</span>
              </p>
              <p className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCalendarCheck} className="mt-0.5 text-emerald-600" />
                <span><span className="font-medium text-slate-800">Claim timeline:</span> {plan.claimWindow}</span>
              </p>
              <p className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCloudRain} className="mt-0.5 text-emerald-600" />
                <span><span className="font-medium text-slate-800">Best for:</span> {plan.idealFor}</span>
              </p>
            </div>

            <ul className="mt-4 space-y-1.5 text-sm text-slate-700">
              {plan.pros.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="mt-0.5 text-emerald-600" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <p className="mt-4 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800">
              <FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" />
              {plan.caution}
            </p>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Quick Comparison</h3>
          <p className="text-sm text-slate-600">Use this table for a fast side-by-side decision.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Insurance Type</th>
                <th className="px-4 py-3 text-left font-semibold">Coverage Scope</th>
                <th className="px-4 py-3 text-left font-semibold">Premium Range</th>
                <th className="px-4 py-3 text-left font-semibold">Claim Speed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {insurancePlans.map((plan) => (
                <tr key={plan.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{plan.name}</td>
                  <td className="px-4 py-3">{plan.coverageType}</td>
                  <td className="px-4 py-3">{plan.premium}</td>
                  <td className="px-4 py-3">{plan.claimWindow}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default CropInsuranceSuggestions;
