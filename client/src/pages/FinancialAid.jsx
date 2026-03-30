import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMoneyBill, 
  faHandshake, 
  faUniversity,
  faBell,
  faGift,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import SchemeEligibilityRecommender from '../components/financial-aid/SchemeEligibilityRecommender';
import LoanBankFinder from '../components/financial-aid/LoanBankFinder';
import SubsidiesFreebies from '../components/financial-aid/SubsidiesFreebies';
import NotificationCenter from '../components/financial-aid/NotificationCenter';
import SupportGuide from '../components/financial-aid/SupportGuide';

/**
 * Financial Aid Main Page Component
 * 
 * This is the main container for all financial aid features including:
 * - Government scheme recommendations
 * - Bank and loan comparisons
 * - Subsidies and freebies
 * - Notifications and alerts
 * - Support and application guides
 */
const FinancialAid = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('schemes');

  const tabs = [
    {
      id: 'schemes',
      label: t('pages.financialAid.governmentSchemes', { defaultValue: 'Government Schemes' }),
      icon: faHandshake,
      component: SchemeEligibilityRecommender
    },
    {
      id: 'loans',
      label: t('pages.financialAid.banksLoans', { defaultValue: 'Banks & Loans' }),
      icon: faUniversity,
      component: LoanBankFinder
    },
    {
      id: 'subsidies',
      label: t('pages.financialAid.subsidiesFreebies', { defaultValue: 'Subsidies & Freebies' }),
      icon: faGift,
      component: SubsidiesFreebies
    },
    {
      id: 'notifications',
      label: t('pages.financialAid.notifications', { defaultValue: 'Notifications' }),
      icon: faBell,
      component: NotificationCenter
    },
    {
      id: 'support',
      label: t('pages.financialAid.supportGuide', { defaultValue: 'Support Guide' }),
      icon: faQuestionCircle,
      component: SupportGuide
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('pages.financialAid.title', { defaultValue: 'Financial Aid' })}</h1>
        <p className="text-gray-600">
          {t('pages.financialAid.subtitle', { defaultValue: 'Access schemes, loans, subsidies, alerts, and step-by-step support for farm finance.' })}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-screen">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default FinancialAid;
