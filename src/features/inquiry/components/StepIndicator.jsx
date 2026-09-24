import { CheckCircle } from "lucide-react";
import { INQUIRY_STEP } from "../types/inquiry.types.js";

const STEPS = [
  { key: INQUIRY_STEP.CATEGORY, label: "Pilih Jalur" },
  { key: INQUIRY_STEP.FORM, label: "Isi Form" },
  { key: INQUIRY_STEP.SUCCESS, label: "Selesai" },
];

function getStepIndex(step) {
  if (step === INQUIRY_STEP.CATEGORY) return 0;
  if (step === INQUIRY_STEP.PLATFORM) return 0.5;
  if (step === INQUIRY_STEP.FORM) return 1;
  if (step === INQUIRY_STEP.SUCCESS) return 2;
  return 0;
}

export default function StepIndicator({ step, category }) {
  const currentIndex = getStepIndex(step, category);

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((s, idx) => {
        const isDone = currentIndex > idx;
        const isActive = currentIndex >= idx && currentIndex < idx + 1;

        return (
          <div key={s.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDone
                    ? "bg-superstar-blue text-white"
                    : isActive
                    ? "bg-superstar-blue text-white"
                    : "bg-graphite/20 text-graphite"
                }`}
              >
                {isDone ? <CheckCircle size={18} /> : <span className="font-sans font-bold text-xs">{idx + 1}</span>}
              </div>
              <span className={`font-sans text-xs whitespace-nowrap ${isActive || isDone ? "text-superstar-blue font-semibold" : "text-graphite"}`}>
                {s.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`h-0.5 w-16 mx-1 mb-4 transition-all duration-300 ${currentIndex > idx ? "bg-superstar-blue" : "bg-graphite/20"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
