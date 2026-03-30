import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import GovernmentDashboard from './pages/GovernmentDashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ClimateAnalysis from './pages/ClimateAnalysis';
import FarmConsole from './pages/FarmConsole';
import AIAssistant from './pages/AIAssistant';
import CropManagement from './pages/CropManagement';
import CreateField from './pages/CreateField';
import Fields from './pages/Fields';
import FieldDetail from './pages/FieldDetail';
import FinancialAid from './pages/FinancialAid';
import ClimateDamageClaim from './pages/ClimateDamageClaim';
import WaterManagement from './pages/WaterManagement';
import PlantDiseaseDetection from './pages/PlantDiseaseDetection';
import CropLifecycle from './pages/CropLifecycle';
import CropPrediction from './pages/CropPrediction';
import YieldPrediction from './pages/YieldPrediction';
import IrrigationManagement from './pages/IrrigationManagement';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

const wrapProtected = (element, userType = null) => (
  <ProtectedRoute userType={userType}>
    <Layout>{element}</Layout>
  </ProtectedRoute>
);

function App() {
  const { t } = useTranslation();

  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <ProtectedRoute requireAuth={false}>
                  <SignUp />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={wrapProtected(<Dashboard />)} />
            <Route path="/dashboard" element={wrapProtected(<Dashboard />, 'farmer')} />
            <Route
              path="/government-dashboard"
              element={wrapProtected(<GovernmentDashboard />, 'government')}
            />

            <Route path="/climate" element={wrapProtected(<ClimateAnalysis />, 'farmer')} />
            <Route path="/farm-console" element={wrapProtected(<FarmConsole />, 'farmer')} />
            <Route path="/reports" element={wrapProtected(<Reports />, 'farmer')} />
            <Route path="/crop-management" element={wrapProtected(<CropManagement />, 'farmer')} />
            <Route path="/crop-planning" element={wrapProtected(<CropManagement />, 'farmer')} />
            <Route path="/crop-health" element={wrapProtected(<PlantDiseaseDetection />, 'farmer')} />
            <Route path="/financial-aid" element={wrapProtected(<FinancialAid />, 'farmer')} />
            <Route
              path="/climate-damage-claim"
              element={wrapProtected(<ClimateDamageClaim />, 'farmer')}
            />
            <Route path="/water-management" element={wrapProtected(<WaterManagement />, 'farmer')} />
            <Route path="/irrigation" element={wrapProtected(<WaterManagement />, 'farmer')} />
            <Route
              path="/irrigation-management"
              element={wrapProtected(<IrrigationManagement />, 'farmer')}
            />
            <Route path="/ai-assistant" element={wrapProtected(<AIAssistant />)} />

            <Route path="/create-field" element={wrapProtected(<CreateField />, 'farmer')} />
            <Route path="/fields" element={wrapProtected(<Fields />, 'farmer')} />
            <Route path="/field-list" element={<Navigate to="/fields" replace />} />
            <Route path="/field-detail/:id" element={wrapProtected(<FieldDetail />, 'farmer')} />

            <Route path="/crop-lifecycle" element={wrapProtected(<CropLifecycle />, 'farmer')} />
            <Route path="/crop-prediction" element={wrapProtected(<CropPrediction />, 'farmer')} />
            <Route path="/yield-prediction" element={wrapProtected(<YieldPrediction />, 'farmer')} />

            <Route path="/profile" element={wrapProtected(<Profile />)} />

            <Route
              path="*"
              element={
                <div className="min-h-screen grid place-items-center bg-slate-50 text-slate-700 px-4 text-center">
                  <div>
                    <h1 className="text-2xl font-bold">404</h1>
                    <p className="mt-2">{t('errors.notFound')}</p>
                  </div>
                </div>
              }
            />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
