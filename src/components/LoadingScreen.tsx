interface LoadingScreenProps {
  step: number;
}

const steps = [
  'Reading file',
  'Extracting transactions',
  'Categorizing & detecting leaks',
  'Building insights & savings plan',
];

const LoadingScreen = ({ step }: LoadingScreenProps) => {
  return (
    <div className="screen active" id="s-loading">
      <div className="loader-orb">
        <svg viewBox="0 0 72 72" width="72" height="72">
          <circle cx="36" cy="36" r="30" fill="none" stroke="var(--ink5)" strokeWidth="5" />
          <circle cx="36" cy="36" r="30" fill="none" stroke="var(--lime)" strokeWidth="5" strokeDasharray="188.5" strokeDashoffset="141" strokeLinecap="round" transform="rotate(-90 36 36)" />
        </svg>
      </div>
      <div className="loader-title">Analyzing your statement…</div>
      <div className="loader-steps">
        {steps.map((label, index) => (
          <div key={label} className={`lstep ${index + 1 === step ? 'active' : index + 1 < step ? 'done' : ''}`}>
            <div className="lstep-dot" />{label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
