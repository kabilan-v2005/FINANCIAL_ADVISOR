import { AIResponse } from '../../types';

interface OverviewProps {
  data: AIResponse;
}

const Overview = ({ data }: OverviewProps) => {
  return (
    <div className="section-grid">
      <div className="card">
        <h3>Summary</h3>
        <p>{data.summary}</p>
      </div>
      <div className="card">
        <h3>Health Score</h3>
        <div className="health-score">{data.healthScore.toFixed(1)} / 10</div>
        <div className="health-label">{data.healthLabel}</div>
      </div>
      <div className="card">
        <h3>Top Expense</h3>
        <p>{data.expenseCategories[0]?.name ?? 'N/A'} — ₹{data.expenseCategories[0]?.amount?.toLocaleString() ?? 0}</p>
      </div>
      <div className="card">
        <h3>Top Income</h3>
        <p>{data.incomeSources[0]?.name ?? 'N/A'} — ₹{data.incomeSources[0]?.amount?.toLocaleString() ?? 0}</p>
      </div>
    </div>
  );
};

export default Overview;
