import { AIResponse } from '../../types';

interface CategoriesProps {
  data: AIResponse;
}

const Categories = ({ data }: CategoriesProps) => {
  return (
    <div className="section-list">
      <h2>Expense categories</h2>
      <div className="budget-list">
        {data.expenseCategories.map((category) => (
          <div key={category.name} className="budget-row">
            <div>
              <strong>{category.name}</strong>
              <div className="muted">{category.pct.toFixed(1)}%</div>
            </div>
            <div>₹{category.amount.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
