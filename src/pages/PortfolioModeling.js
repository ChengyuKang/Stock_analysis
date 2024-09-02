// src/pages/PortfolioModeling.js
import React, { useState, useEffect } from 'react';
import { Col, Nav, ListGroup, Row } from 'react-bootstrap';
import PortfolioNRBPref from '../components/PortfolioModeling/PortfolioNRBPref';
import Performance from '../components/PortfolioModeling/Performance';
import SpreadRatioAnalysis from '../components/PortfolioModeling/SpreadRatioAnalysis';

function PortfolioModeling() {
  const [activeTab, setActiveTab] = useState('/portfolio-modeling/nrb-pref');
  const [stockList, setStockList] = useState([]);

  useEffect(() => {
    const loadStockList = async () => {
      try {
        const response = await fetch('http://localhost:5000/stockList');
        const data = await response.json();
        setStockList(data.map(stock => stock.name));
      } catch (err) {
        console.error('Failed to load stock list:', err);
      }
    };

    loadStockList();
  }, []);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case '/portfolio-modeling/performance':
        return <Performance />;
      case '/portfolio-modeling/spread-ratio-analysis':
        return <SpreadRatioAnalysis />;
      default:
        return <PortfolioNRBPref />;
    }
  };

  return (
    <Row>
      <Col xs={2}>
        <ListGroup>
          {stockList.map((stock, index) => (
            <ListGroup.Item key={index}>
              {stock}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Col>
      <Col xs={10}>
        <Nav variant="tabs" defaultActiveKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
          <Nav.Item>
            <Nav.Link eventKey="/portfolio-modeling/nrb-pref">NRB Pref</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="/portfolio-modeling/performance">Performance</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="/portfolio-modeling/spread-ratio-analysis">Spread & Ratio Analysis</Nav.Link>
          </Nav.Item>
        </Nav>
        <div className="p-4">
          {renderActiveComponent()}
        </div>
      </Col>
    </Row>
  );
}

export default PortfolioModeling;
