interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  furthestStep: number;
  onStepClick: (index: number) => void;
}

export function StepIndicator({ steps, currentStep, furthestStep, onStepClick }: StepIndicatorProps) {
  return (
    <ol className="mb-8 flex items-center justify-between">
      {steps.map((label, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = index <= furthestStep;
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(index)}
              className="flex flex-col items-center gap-1.5 disabled:cursor-not-allowed"
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  isCurrent ? 'bg-brand-600 text-white' : isCompleted ? 'bg-brand-100 text-brand-700' : 'bg-stone-100 text-stone-400'
                }`}
              >
                {isCompleted ? '✓' : index + 1}
              </span>
              <span className={`hidden text-xs font-medium sm:block ${isCurrent ? 'text-brand-700' : 'text-stone-400'}`}>
                {label}
              </span>
            </button>
            {index < steps.length - 1 && (
              <div className={`mx-2 h-0.5 flex-1 ${isCompleted ? 'bg-brand-300' : 'bg-stone-200'}`} aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
