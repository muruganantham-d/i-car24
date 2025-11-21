export default function WizardProgress({ step, total }) {
  const pct = (step / total) * 100;

  return (
    <div className="mb-6">
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="h-2 bg-blue-600 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        ></div>
      </div>
      <p className="mt-2 text-sm text-gray-600">Step {step} of {total}</p>
    </div>
  );
}
