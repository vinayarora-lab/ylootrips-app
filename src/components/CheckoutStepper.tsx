import { Check } from 'lucide-react';

interface CheckoutStepperProps {
    currentStep: 1 | 2 | 3;
}

const steps = [
    { label: 'Trip Selected' },
    { label: 'Your Details' },
    { label: 'Payment' },
];

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
    return (
        <div className="flex items-center gap-0 mb-8 md:mb-12">
            {steps.map((step, index) => {
                const stepNum = index + 1;
                const isDone = stepNum < currentStep;
                const isActive = stepNum === currentStep;

                return (
                    <div key={step.label} className="flex items-center flex-1 last:flex-none">
                        <div className="flex items-center gap-2 shrink-0">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${isDone
                                    ? 'bg-secondary text-cream'
                                    : isActive
                                        ? 'bg-primary text-cream'
                                        : 'bg-primary/10 text-primary/40'
                                    }`}
                            >
                                {isDone ? <Check className="w-4 h-4" /> : stepNum}
                            </div>
                            <span
                                className={`text-sm hidden sm:inline ${isActive ? 'text-primary font-medium' : isDone ? 'text-secondary' : 'text-primary/40'}`}
                            >
                                {step.label}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-px mx-3 ${isDone ? 'bg-secondary' : 'bg-primary/10'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
