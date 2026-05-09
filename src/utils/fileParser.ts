export function parseCsv(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Unable to read CSV file.'));
        return;
      }
      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error('CSV read failed.'));
    };

    reader.readAsText(file);
  });
}
