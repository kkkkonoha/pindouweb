import { useProjectStore } from './stores/projectStore';
import { StepIndicator } from './components/Wizard/StepIndicator';
import { InputStep } from './components/Wizard/InputStep';
import { PreviewStep } from './components/Wizard/PreviewStep';
import { ExportDialog } from './components/Export/ExportDialog';
import { useIsMobile } from './hooks/useIsMobile';

function App() {
  const wizardStep = useProjectStore((s) => s.wizardStep);
  const isMobile = useIsMobile();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fafafa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #eaeaea',
        padding: isMobile ? '0 16px' : '0 24px',
        height: isMobile ? '48px' : '56px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: isMobile ? '18px' : '22px' }}>🫘</span>
        <h1 style={{ fontSize: isMobile ? '15px' : '17px', fontWeight: '600', margin: 0, color: '#111' }}>
          拼豆图纸生成器
        </h1>
        <div style={{ flex: 1 }} />
        {!isMobile && <span style={{ fontSize: '13px', color: '#999' }}>Bead Pattern Generator</span>}
      </header>

      <StepIndicator />

      <main style={{ flex: 1, overflow: 'hidden' }}>
        {wizardStep === 'input' && <InputStep />}
        {wizardStep === 'preview' && <PreviewStep />}
        {wizardStep === 'export' && (
          <div style={{ padding: isMobile ? '24px 16px' : '40px 20px', maxWidth: '480px', margin: '0 auto' }}>
            <ExportDialog />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
