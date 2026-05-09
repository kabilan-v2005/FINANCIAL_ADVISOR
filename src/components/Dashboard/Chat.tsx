import { useState } from 'react';

const Chat = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string>('Type a question to get personalized financial insights.');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAnswer(`AI is preparing a response for: ${question}`);
  };

  return (
    <div className="section-list">
      <h2>Ask the AI advisor</h2>
      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="What should I change to save more each week?"
        />
        <button type="submit">Ask</button>
      </form>
      <div className="chat-response">
        <p>{answer}</p>
      </div>
    </div>
  );
};

export default Chat;
