import { AIResponse } from '../../types';

interface AdvisorProps {
  data: AIResponse;
}

const Advisor = ({ data }: AdvisorProps) => {
  return (
    <div className="section-grid-two">
      {data.leaks.map((leak) => (
        <div key={leak.title} className="card leak-card">
          <div className="leak-header">
            <span className="leak-icon">{leak.icon}</span>
            <div>
              <h3>{leak.title}</h3>
              <p>{leak.subtitle}</p>
            </div>
          </div>
          <div className="leak-meta">
            <div>Severity: {leak.severity}</div>
            <div>Cost: ₹{leak.amount.toLocaleString()}</div>
            <div>Save: ₹{leak.potentialSave.toLocaleString()}</div>
          </div>
          <ul>
            {leak.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Advisor;
