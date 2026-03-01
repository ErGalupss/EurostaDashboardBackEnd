import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Partner from './pages/Partner';
import Operativo from './pages/Operativo';
import Pec from './pages/Pec';
import GuidaTecnica from './pages/GuidaTecnica';
import BigQuery from './pages/BigQuery';
import DataArchitecture from './pages/DataArchitecture';
import LookML from './pages/LookML';
import DataScience from './pages/DataScience';
import BIDesign from './pages/BIDesign';
import BIAutomation from './pages/BIAutomation';
import AnalystReport from './pages/AnalystReport';
import FileHistory from './pages/FileHistory';
import DeploymentGuide from './pages/DeploymentGuide';
import DataList from './pages/DataList';
import IncaricoDetails from './pages/IncaricoDetails';
import Confronto from './pages/Confronto';
import ILovePDF from './pages/Utilities/ILovePDF';
import PdfP7m from './pages/Utilities/PdfP7m';
import GoogleCalendar from './pages/Utilities/GoogleCalendar';
import EmailClient from './pages/EmailClient';
import GuidaInstallazione from './pages/GuidaInstallazione';
import GuidaDeploy from './pages/GuidaDeploy';
import GuidaBackend from './pages/GuidaBackend';
import DebugBackend from './pages/DebugBackend';
import AdminPanel from './admin/AdminPanel';
import { DashboardProvider } from './context/DashboardContext';

export default function App() {
  return (
    <DashboardProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="partner" element={<Partner />} />
            <Route path="operativo" element={<Operativo />} />
            <Route path="pec" element={<Pec />} />
            <Route path="history" element={<FileHistory />} />
            <Route path="datalist" element={<DataList />} />
            <Route path="incarico/:id" element={<IncaricoDetails />} />
            <Route path="confronto" element={<Confronto />} />
            <Route path="email" element={<EmailClient />} />
            <Route path="ilovepdf" element={<ILovePDF />} />
            <Route path="pdf-p7m" element={<PdfP7m />} />
            <Route path="calendar" element={<GoogleCalendar />} />
            <Route path="deployment" element={<DeploymentGuide />} />
            <Route path="guida-installazione" element={<GuidaInstallazione />} />
            <Route path="guida-deploy" element={<GuidaDeploy />} />
            <Route path="guida-backend" element={<GuidaBackend />} />
            <Route path="debug-backend" element={<DebugBackend />} />
            <Route path="guida" element={<GuidaTecnica />} />
            <Route path="bigquery" element={<BigQuery />} />
            <Route path="architecture" element={<DataArchitecture />} />
            <Route path="lookml" element={<LookML />} />
            <Route path="datascience" element={<DataScience />} />
            <Route path="bidesign" element={<BIDesign />} />
            <Route path="biautomation" element={<BIAutomation />} />
            <Route path="analyst" element={<AnalystReport />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DashboardProvider>
  );
}
