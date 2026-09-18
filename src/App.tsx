import React, { useState } from 'react';
import { NavTabId, AlertStatus } from './types';
import { INITIAL_ALERTS } from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SituationOverviewView } from './components/views/SituationOverviewView';
import { RealtimeMonitoringView } from './components/views/RealtimeMonitoringView';
import { AlertCenterView } from './components/views/AlertCenterView';
import { ModelTrainingView } from './components/views/ModelTrainingView';
import { SystemConfigView } from './components/views/SystemConfigView';
import { EmergencyBroadcastModal } from './components/modals/EmergencyBroadcastModal';
import { DeployModelModal } from './components/modals/DeployModelModal';
import { QuickDiagnosticModal } from './components/modals/QuickDiagnosticModal';
import { AuditLogsModal } from './components/modals/AuditLogsModal';
import { SnapshotPreviewModal } from './components/modals/SnapshotPreviewModal';
import { ApiDocsModal } from './components/modals/ApiDocsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabId>('overview');
  const [selectedAlertId, setSelectedAlertId] = useState<string>(INITIAL_ALERTS[0].id);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  // Modals state
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);
  const [isApiDocsOpen, setIsApiDocsOpen] = useState(false);
  const [activeSnapshot, setActiveSnapshot] = useState<{
    id: string;
    time: string;
    title: string;
    url: string;
  } | null>(null);

  // Toast notification
  const [globalNotice, setGlobalNotice] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setGlobalNotice(msg);
    setTimeout(() => setGlobalNotice(null), 3000);
  };

  const handleAlertStatusChange = (alertId: string, status: AlertStatus) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status } : a))
    );
  };

  const handleBroadcast = (zone: string, msg: string) => {
    triggerToast(`全网紧急广播已成功下发至 [${zone}]: "${msg}"`);
  };

  const handleDeploySuccess = (version: string) => {
    triggerToast(`模型版本 [${version}] 已成功编译并下发至边缘计算节点！`);
  };

  const unverifiedCount = alerts.filter((a) => a.status === 'unverified').length;

  return (
    <div className="min-h-screen bg-[#f4f5fa] text-[#131b2e] font-sans antialiased flex flex-col selection:bg-[#eaedff] selection:text-[#0037b0]">
      {/* Global Header */}
      <Header
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenDeploy={() => setIsDeployOpen(true)}
      />

      <div className="flex flex-1 pt-12">
        {/* Left Fixed Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          unresolvedAlertCount={unverifiedCount}
          onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
          onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
          onOpenApiDocs={() => setIsApiDocsOpen(true)}
        />

        {/* Main Content View Container */}
        <main className="flex-1 ml-60 p-4 md:p-6 overflow-x-hidden">
          {/* Global Toast */}
          {globalNotice && (
            <div className="fixed top-14 right-6 z-50 bg-[#131b2e] text-white px-4 py-2.5 rounded shadow-xl border border-slate-700 font-mono text-xs flex items-center gap-2 animate-bounce">
              <span className="material-symbols-outlined text-emerald-400 text-[18px]">info</span>
              <span>{globalNotice}</span>
            </div>
          )}

          {activeTab === 'overview' && (
            <SituationOverviewView
              onNavigateTab={setActiveTab}
              onSelectAlertForInspection={(alertId) => {
                setSelectedAlertId(alertId);
                setActiveTab('alerts');
              }}
            />
          )}

          {activeTab === 'monitoring' && (
            <RealtimeMonitoringView
              onOpenSnapshotModal={(snap) => setActiveSnapshot(snap)}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertCenterView
              initialSelectedId={selectedAlertId}
              onAlertStatusChange={handleAlertStatusChange}
            />
          )}

          {activeTab === 'training' && (
            <ModelTrainingView
              onOpenDeployModal={() => setIsDeployOpen(true)}
            />
          )}

          {activeTab === 'config' && <SystemConfigView />}
        </main>
      </div>

      {/* Modals */}
      <EmergencyBroadcastModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onBroadcast={handleBroadcast}
      />

      <DeployModelModal
        isOpen={isDeployOpen}
        onClose={() => setIsDeployOpen(false)}
        onDeploySuccess={handleDeploySuccess}
      />

      <QuickDiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
      />

      <AuditLogsModal
        isOpen={isAuditLogsOpen}
        onClose={() => setIsAuditLogsOpen(false)}
      />

      <ApiDocsModal
        isOpen={isApiDocsOpen}
        onClose={() => setIsApiDocsOpen(false)}
      />

      <SnapshotPreviewModal
        isOpen={!!activeSnapshot}
        onClose={() => setActiveSnapshot(null)}
        snapshot={activeSnapshot}
      />
    </div>
  );
}
