import React from 'react';
import { useProjectStore } from '../../stores/projectStore';
import type { WizardStep } from '../../types';

const steps: { key: WizardStep; label: string }[] = [
  { key: 'input', label: '选择输入' },
  { key: 'preview', label: '编辑调整' },
  { key: 'export', label: '导出下载' },
];

export const StepIndicator: React.FC = () => {
  const currentStep = useProjectStore((s) => s.wizardStep);
  const currentIndex = steps.findIndex(s => s.key === currentStep);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '14px 24px',
      backgroundColor: 'white',
      borderBottom: '1px solid #eaeaea',
      gap: '8px'
    }}>
      {steps.map((step, index) => (
        <React.Fragment key={step.key}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: index <= currentIndex ? '#111' : '#e5e7eb',
                color: 'white',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              {index < currentIndex ? '✓' : index + 1}
            </div>
            <span style={{
              fontSize: '13px',
              color: index <= currentIndex ? '#111' : '#9ca3af',
              fontWeight: index === currentIndex ? '500' : '400'
            }}>
              {step.label}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div style={{
              width: '32px',
              height: '1px',
              backgroundColor: index < currentIndex ? '#111' : '#e5e7eb',
              margin: '0 4px'
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
