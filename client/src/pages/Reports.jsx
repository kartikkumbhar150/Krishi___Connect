import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faChartLine, faCloudSunRain, faDroplet, faSeedling } from '@fortawesome/free-solid-svg-icons';

const reportCards = [
  {
    title: 'Crop Lifecycle Report',
    description: 'Monitor growth stages and current progress of fields.',
    icon: faSeedling,
    route: '/crop-lifecycle',
    tone: 'emerald'
  },
  {
    title: 'Yield Prediction Report',
    description: 'Review expected output and forecast confidence.',
    icon: faChartLine,
    route: '/yield-prediction',
    tone: 'amber'
  },
  {
    title: 'Climate Analysis Report',
    description: 'Analyze weather impact and field-level climate risk.',
    icon: faCloudSunRain,
    route: '/climate',
    tone: 'sky'
  },
  {
    title: 'Irrigation Efficiency Report',
    description: 'Track irrigation performance and water usage trends.',
    icon: faDroplet,
    route: '/irrigation-management',
    tone: 'indigo'
  }
];

const toneClasses = {
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  amber: 'bg-amber-50 border-amber-200 text-amber-700',
  sky: 'bg-sky-50 border-sky-200 text-sky-700',
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700'
};

const Reports = () => (
  <section className="min-h-[calc(100vh-7rem)] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Reports Center</h2>
    <p className="mt-1 text-slate-600">Central access to your operational and analytics reports.</p>

    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {reportCards.map((card) => (
        <Link
          key={card.title}
          to={card.route}
          className="group rounded-xl border border-slate-200 p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border ${toneClasses[card.tone]}`}>
            <FontAwesomeIcon icon={card.icon} />
          </div>
          <h3 className="mt-3 text-lg font-semibold text-slate-800">{card.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{card.description}</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
            Open report <FontAwesomeIcon icon={faArrowRight} className="transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      ))}
    </div>
  </section>
);

export default Reports;
