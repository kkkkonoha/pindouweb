import React from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { WizardStep } from '../../types';

const steps: { key: WizardStep; label: string }[] = [
  { key: 'input', label: '选择输入' },
  { key: 'settings', label: '参数设置' },
  { key: 'preview', label: '预览调整' },
  { key: 'export', label: '导出' },
];

export const StepIndicator: React.FC = () => {
  const currentStep = useProjectStore((s) => s.wizardStep);

  return (
    <div className="flex items-center justify-center py-4 bg-white border-b">
      {steps.map((step, index) => (
        <React.Fragment key={step.key}>
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === step.key
                  ? 'bg-blue-500 text-white'
                  : steps.findIndex(s => s.key === currentStep) > index
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {steps.findIndex(s => s.key === currentStep) > index ? '✓' : index + 1}
            </div>
            <span className="ml-2 text-sm">{step.label}</span>
          </div>

          {index < steps.length - 1 && (
            <div className="w-12 h-0.5 bg-gray-200 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};