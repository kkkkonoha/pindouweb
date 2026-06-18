import React from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useIsMobile } from '../../hooks/useIsMobile';
import type { WizardStep } from '../../types';

const steps: { key: WizardStep; label: string }[] = [
  { key: 'input', label: '选择输入' },
  { key: 'preview', label: '编辑调整' },
  { key: 'export', label: '导出下载' },
];

export const StepIndicator: React.FC = () => {
  const currentStep = useProjectStore((s) => s.wizardStep);
  const currentIndex = steps.findIndex(s => s.key === currentStep);
  const isMobile = useIsMobile();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '10px 16px' : '14px 24px',
      backgroundColor: 'white',
      borderBottom: '1px solid #eaeaea',
      gap: isMobile ? '4px' : '8px'
    }}>
      {steps.map((step, index) => (
        <React.Fragment key={step.key}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '8px' }}>
            <div
              style={{
                width: isMobile ? '20px' : '24px',
                height: isMobile ? '20px' : '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: index <= currentIndex ? '#111' : '#e5e7eb',
                color: 'white',
                fontSize: isMobile ? '10px' : '12px',
                fontWeight: '500'
              }}
            >
              {index < currentIndex ? '✓' : index + 1}
            </div>
            <span style={{
              fontSize: isMobile ? '11px' : '13px',
              color: index <= currentIndex ? '#111' : '#9ca3af',
              fontWeight: index === currentIndex ? '500' : '400'
            }}>
              {step.label}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div style={{
              width: isMobile ? '16px' : '32px',
              height: '1px',
              backgroundColor: index < currentIndex ? '#111' : '#e5e7eb',
              margin: '0 2px'
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
