import { AIResponse } from '../../types';

interface TransactionsProps {
  data: AIResponse;
}

const Transactions = ({ data }: TransactionsProps) => {
  return (
    <div className="section-list">
      <h2>Recent transactions</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {data.transactions.slice(0, 20).map((tx, index) => (
              <tr key={`${tx.date}-${tx.description}-${index}`}>
                <td>{tx.date}</td>
                <td>{tx.description}</td>
                <td>{tx.category}</td>
                <td className={tx.type === 'expense' ? 'neg' : 'pos'}>
                  {tx.type === 'expense' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                </td>
                <td>{tx.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
