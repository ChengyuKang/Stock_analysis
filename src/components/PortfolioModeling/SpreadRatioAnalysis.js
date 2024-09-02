// src/components/SpreadRatioAnalysis.js
import React from 'react';

function SpreadRatioAnalysis({ selectedStock }) {
  return (
    <div>
      <h4>Spread & Ratio Analysis</h4>
      {selectedStock && <p>Currently selected stock: {selectedStock}</p>}
      {/* Add your content here */}
    </div>
  );
}

export default SpreadRatioAnalysis;
