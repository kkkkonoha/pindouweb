import { useProjectStore } from './stores/projectStore';
import { StepIndicator } from './components/Wizard/StepIndicator';
import { InputStep } from './components/Wizard/InputStep';
import { PreviewStep } from './components/Wizard/PreviewStep';
import { ExportDialog } from './components/Export/ExportDialog';

function App() {
  const wizardStep = useProjectStore((s) => s.wizardStep);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-bold">拼豆图纸生成器</h1>
      </header>

      <StepIndicator />

      <main className="flex-1 overflow-hidden">
        {wizardStep === 'input' && <InputStep />}
        {wizardStep === 'preview' && <PreviewStep />}
        {wizardStep === 'export' && (
          <div className="p-8 max-w-md mx-auto">
            <ExportDialog />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
