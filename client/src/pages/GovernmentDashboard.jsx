import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine, faUsers, faBuilding, faClipboardList,
  faMapMarkedAlt, faLeaf, faDatabase, faCog,
  faCalendarAlt, faBell, faDownload, faEye
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const GovernmentDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Placeholder data for government dashboard
  const dashboardStats = [
    {
      title: t('pages.governmentDashboard.registeredFarmers'),
      value: t('pages.governmentDashboard.farmersCount'),
      change: t('pages.governmentDashboard.farmersGrowth'),
      icon: faUsers,
      color: 'bg-blue-500'
    },
    {
      title: t('pages.governmentDashboard.totalFarmArea'),
      value: t('pages.governmentDashboard.areaCount'),
      change: t('pages.governmentDashboard.areaGrowth'),
      icon: faMapMarkedAlt,
      color: 'bg-green-500'
    },
    {
      title: t('pages.governmentDashboard.subsidiesDistributed'),
      value: t('pages.governmentDashboard.subsidiesAmount'),
      change: t('pages.governmentDashboard.subsidiesGrowth'),
      icon: faDatabase,
      color: 'bg-purple-500'
    },
    {
      title: t('pages.governmentDashboard.activeSchemes'),
      value: t('pages.governmentDashboard.schemesCount'),
      change: t('pages.governmentDashboard.schemesGrowth'),
      icon: faClipboardList,
      color: 'bg-orange-500'
    }
  ];

  const quickActions = [
    {
      title: t('pages.governmentDashboard.farmerRegistration'),
      description: t('pages.governmentDashboard.farmerRegDesc'),
      icon: faUsers,
      color: 'bg-blue-500'
    },
    {
      title: t('pages.governmentDashboard.schemeManagement'),
      description: t('pages.governmentDashboard.schemeManDesc'),
      icon: faClipboardList,
      color: 'bg-green-500'
    },
    {
      title: t('pages.governmentDashboard.subsidyDistribution'),
      description: t('pages.governmentDashboard.subsidyDistDesc'),
      icon: faDatabase,
      color: 'bg-purple-500'
    },
    {
      title: t('pages.governmentDashboard.analyticsReports'),
      description: t('pages.governmentDashboard.analyticsDesc'),
      icon: faChartLine,
      color: 'bg-orange-500'
    },
    {
      title: t('pages.governmentDashboard.fieldMonitoring'),
      description: t('pages.governmentDashboard.fieldMonitorDesc'),
      icon: faMapMarkedAlt,
      color: 'bg-indigo-500'
    },
    {
      title: t('pages.governmentDashboard.policyManagement'),
      description: t('pages.governmentDashboard.policyManDesc'),
      icon: faCog,
      color: 'bg-red-500'
    }
  ];

  const recentActivity = [
    t('pages.governmentDashboard.activity1'),
    t('pages.governmentDashboard.activity2'),
    t('pages.governmentDashboard.activity3'),
    t('pages.governmentDashboard.activity4'),
    t('pages.governmentDashboard.activity5')
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('pages.governmentDashboard.title')}</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.name} | {currentTime.toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                {t('pages.governmentDashboard.exportData')}
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
                <FontAwesomeIcon icon={faBell} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <FontAwesomeIcon icon={stat.icon} className="text-white text-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">{t('pages.governmentDashboard.quickActions')}</h2>
                <p className="text-gray-600 text-sm mt-1">{t('pages.governmentDashboard.manageAdmin')}</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all text-left group"
                    >
                      <div className="flex items-start">
                        <div className={`${action.color} p-2 rounded-lg mr-4 group-hover:scale-110 transition-transform`}>
                          <FontAwesomeIcon icon={action.icon} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">{t('pages.governmentDashboard.recentActivity')}</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-sm text-gray-600">{activity}</p>
                    </div>
                  ))}
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-4">
                  {t('pages.governmentDashboard.viewAllActivity')}
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">{t('pages.governmentDashboard.systemStatus')}</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('pages.governmentDashboard.database')}</span>
                    <span className="text-green-600 text-sm">{t('pages.governmentDashboard.online')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('pages.governmentDashboard.apiServices')}</span>
                    <span className="text-green-600 text-sm">{t('pages.governmentDashboard.running')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('pages.governmentDashboard.backupStatus')}</span>
                    <span className="text-green-600 text-sm">{t('pages.governmentDashboard.updated')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('pages.governmentDashboard.lastSync')}</span>
                    <span className="text-gray-600 text-sm">{t('pages.governmentDashboard.lastSyncTime')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faBuilding} className="text-blue-500 text-2xl mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900">{t('pages.governmentDashboard.comingSoonTitle')}</h3>
              <p className="text-blue-700 mt-1">
                {t('pages.governmentDashboard.comingSoonDesc')}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {t('pages.governmentDashboard.farmerRegManagement')}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {t('pages.governmentDashboard.subsidyDist')}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {t('pages.governmentDashboard.policyImplementation')}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {t('pages.governmentDashboard.analyticsReporting')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernmentDashboard;
