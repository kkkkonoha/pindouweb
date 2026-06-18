import { useProjectStore } from './stores/projectStore';
import { StepIndicator } from './components/Wizard/StepIndicator';
import { InputStep } from './components/Wizard/InputStep';
import { PreviewStep } from './components/Wizard/PreviewStep';
import { ExportDialog } from './components/Export/ExportDialog';

function App() {
  const wizardStep = useProjectStore((s) => s.wizardStep);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f3f4f6'
    }}>
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ fontSize: '24px' }}>🫘</span>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#1f2937' }}>
          拼豆图纸生成器
        </h1>
      </header>

      <StepIndicator />

      <main style={{ flex: 1, overflow: 'hidden' }}>
        {wizardStep === 'input' && <InputStep />}
        {wizardStep === 'preview' && <PreviewStep />}
        {wizardStep === 'export' && (
          <div style={{ padding: '32px', maxWidth: '500px', margin: '0 auto' }}>
            <ExportDialog />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
