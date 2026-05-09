import { AIResponse } from '../../types';

interface PlanProps {
  data: AIResponse;
}

const Plan = ({ data }: PlanProps) => {
  return (
    <div className="section-grid-two">
      <div className="card">
        <h2>Weekly plan</h2>
        <ol className="plan-list">
          {data.weekPlan.map((item) => (
            <li key={item.week}>
              <strong>{item.week}:</strong> {item.title}
              <p>{item.desc}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="card">
        <h2>Goals</h2>
        <div className="goal-list">
          {data.goals.map((goal) => (
            <div key={goal.title} className="goal-card">
              <div className="goal-icon">{goal.icon}</div>
              <div>
                <strong>{goal.title}</strong>
                <p>{goal.desc}</p>
              </div>
              <div className="goal-meta">{goal.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plan;
