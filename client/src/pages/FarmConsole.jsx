import { useTranslation } from 'react-i18next';

const FarmConsole = () => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('pages.farmConsole.title')}</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">{t('pages.farmConsole.subtitle')}</p>
        
        {/* Placeholder for farm console features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">{t('pages.farmConsole.irrigationControls')}</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span>{t('pages.farmConsole.zone')} 1</span>
                <button className="bg-blue-500 text-white px-3 py-1 rounded">{t('pages.farmConsole.off')}</button>
              </div>
              <div className="flex justify-between items-center">
                <span>{t('pages.farmConsole.zone')} 2</span>
                <button className="bg-green-500 text-white px-3 py-1 rounded">{t('pages.farmConsole.on')}</button>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">{t('pages.farmConsole.sensorReadings')}</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">{t('pages.farmConsole.soilMoisture')}</span> {t('pages.farmConsole.moistureValue')}
              </div>
              <div>
                <span className="font-medium">{t('pages.farmConsole.temperature')}</span> {t('pages.farmConsole.temperatureValue')}
              </div>
              <div>
                <span className="font-medium">{t('pages.farmConsole.humidity')}</span> {t('pages.farmConsole.humidityValue')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmConsole;
