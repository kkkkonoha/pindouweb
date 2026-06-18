import React from 'react';
import { useProjectStore } from '../../stores/projectStore';
import type { WizardStep } from '../../types';

const steps: { key: WizardStep; label: string }[] = [
  { key: 'input', label: '选择输入' },
  { key: 'preview', label: '预览调整' },
  { key: 'export', label: '导出' },
];

export const StepIndicator: React.FC = () => {
  const currentStep = useProjectStore((s) => s.wizardStep);
  const currentIndex = steps.findIndex(s => s.key === currentStep);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb'
    }}>
      {steps.map((step, index) => (
        <React.Fragment key={step.key}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: currentStep === step.key ? '#3b82f6' : index < currentIndex ? '#22c55e' : '#e5e7eb',
                color: currentStep === step.key || index < currentIndex ? 'white' : '#6b7280',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {index < currentIndex ? '✓' : index + 1}
            </div>
            <span style={{
              marginLeft: '8px',
              fontSize: '14px',
              color: currentStep === step.key ? '#1f2937' : '#6b7280',
              fontWeight: currentStep === step.key ? '500' : '400'
            }}>
              {step.label}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div style={{
              width: '48px',
              height: '2px',
              backgroundColor: index < currentIndex ? '#22c55e' : '#e5e7eb',
              margin: '0 12px'
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
