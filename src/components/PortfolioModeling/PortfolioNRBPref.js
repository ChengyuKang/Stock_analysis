// src/components/PortfolioNRBPref.js
import React from 'react';

function PortfolioNRBPref({ selectedStock }) {
  return (
    <div>
      <h4>Portfolio NRB Pref</h4>
      {selectedStock && <p>Currently selected stock: {selectedStock}</p>}
      {/* Add your content here */}
    </div>
  );
}

export default PortfolioNRBPref;
