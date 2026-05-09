import { useState, type DragEvent } from 'react';

interface UploadScreenProps {
  onFileSelected: (file: File) => void;
  error?: string;
}

const UploadScreen = ({ onFileSelected, error }: UploadScreenProps) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    onFileSelected(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="screen active" id="s-upload">
      <div className="hero-eyebrow">AI-Powered Financial Clarity</div>
      <h1 className="hero-h1">Know exactly where<br />your <em>money goes.</em></h1>
      <p className="hero-sub">Upload any bank statement — PDF or CSV — and get instant AI analysis: spending categories, money leaks, savings recommendations, and a personalized plan for next month.</p>

      <div
        className={`drop-zone fu fu2 ${dragOver ? 'over' : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <span className="drop-icon">🏦</span>
        <div className="drop-title">Drop your bank statement here</div>
        <div className="drop-sub">or click to browse files</div>
        <div className="drop-formats">📄 PDF &nbsp;·&nbsp; 📊 CSV &nbsp;·&nbsp; up to 10 MB</div>
      </div>

      <input type="file" id="fileInput" accept=".pdf,.csv,application/pdf,text/csv" style={{ display: 'none' }} onChange={(event) => {
        const file = event.target.files?.[0];
        if (file) handleFile(file);
      }} />

      {error && <div className="err-bar" style={{ display: 'block' }}>{error}</div>}

      <div className="feat-strip fu fu3">
        <div className="feat"><div className="feat-dot" />Income tracking</div>
        <div className="feat"><div className="feat-dot" />Smart categorization</div>
        <div className="feat"><div className="feat-dot" />Money leak detection</div>
        <div className="feat"><div className="feat-dot" />Next month plan</div>
        <div className="feat"><div className="feat-dot" />AI advisor chat</div>
        <div className="feat"><div className="feat-dot" />Fully reusable</div>
      </div>
    </div>
  );
};

export default UploadScreen;
