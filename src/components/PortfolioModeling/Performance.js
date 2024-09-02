// src/components/Performance.js
import React from 'react';

function Performance({ selectedStock }) {
  return (
    <div>
      <h4>Performance</h4>
      {selectedStock && <p>Currently selected stock: {selectedStock}</p>}
      {/* Add your content here */}
    </div>
  );
}

export default Performance;
