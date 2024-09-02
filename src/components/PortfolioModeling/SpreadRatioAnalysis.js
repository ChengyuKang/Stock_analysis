// src/components/PortfolioModeling/SpreadRatioAnalysis.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import LineChartComponent from '../LineChartComponent';

function SpreadRatioAnalysis({ stockList }) {
  const [longStock, setLongStock] = useState(stockList[0]);
  const [shortStock, setShortStock] = useState(stockList[1]);
  const [spreadData, setSpreadData] = useState([]);
  const [ratioData, setRatioData] = useState([]);
  const [error, setError] = useState(null);

  // New state variables to store key information
  const [longStockInfo, setLongStockInfo] = useState({});
  const [shortStockInfo, setShortStockInfo] = useState({});
  const [commonTimestampsCount, setCommonTimestampsCount] = useState(0);

  const fetchStockData = async (symbol) => {
    try {
        const response = await fetch(`http://localhost:5000/Stockdata?symbol=${symbol}`);
        const result = await response.json();
        const data = result[0].data; // Access the `data` field inside the response object

        if (result.length > 0 && data.s === 'ok') {
            return data; // Directly return the data object containing stock data
        } else {
            setError(`Failed to fetch data for ${symbol}`);
            return null;
        }
    } catch (err) {
        console.error(err);
        setError(`Failed to fetch data for ${symbol}`);
        return null;
    }
  };

  // Correct the typo in the variable name
const calculateSpreadAndRatio = async () => {
  const longData = await fetchStockData(longStock);
  const shortData = await fetchStockData(shortStock);

  if (longData && shortData) {
    // Ensure we only use overlapping time periods
    const commonTimestamps = longData.t.filter((time) => shortData.t.includes(time));

    const spread = commonTimestamps.map((time) => {
      const longIndex = longData.t.indexOf(time);
      const shortIndex = shortData.t.indexOf(time);
      return {
        time,
        value: longData.c[longIndex] - shortData.c[shortIndex],
      };
    });

    const ratio = commonTimestamps.map((time) => {
      const longIndex = longData.t.indexOf(time);
      const shortIndex = shortData.t.indexOf(time);
      return {
        time,
        value: longData.c[longIndex] / shortData.c[shortIndex],
      };
    });

    setSpreadData(spread);
    setRatioData(ratio);
    setCommonTimestampsCount(commonTimestamps.length);
    
    // Store key info
    setLongStockInfo({
      latestClose: longData.c[longData.c.length - 1],
      lastDate: new Date(longData.t[longData.t.length - 1] * 1000).toISOString().split('T')[0],
    });

    setShortStockInfo({
      latestClose: shortData.c[shortData.c.length - 1],
      lastDate: new Date(shortData.t[shortData.t.length - 1] * 1000).toISOString().split('T')[0],
    });

    setError(null);
  } else {
    setError('Failed to calculate spread and ratio due to missing data.');
  }
};


  useEffect(() => {
    calculateSpreadAndRatio();
  }, [longStock, shortStock]);

  return (
    <Container fluid>
      <Row className="mt-4">
        <Col xs={12} md={3}>
          <Form.Group>
            <Form.Label>Long Stock</Form.Label>
            <Form.Control
              as="select"
              value={longStock}
              onChange={(e) => setLongStock(e.target.value)}
            >
              {stockList.map((stock, index) => (
                <option key={index} value={stock}>
                  {stock}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Short Stock</Form.Label>
            <Form.Control
              as="select"
              value={shortStock}
              onChange={(e) => setShortStock(e.target.value)}
            >
              {stockList.map((stock, index) => (
                <option key={index} value={stock}>
                  {stock}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Button variant="primary" onClick={calculateSpreadAndRatio}>
            Calculate
          </Button>

          {error && <p className="text-danger mt-3">{error}</p>}

          {/* Display important data below the calculate button */}
          <div className="mt-4">
            <h5>Long Stock Info ({longStock}):</h5>
            <p>Latest Closing Price: ${longStockInfo.latestClose}</p>
            <p>Last Available Date: {longStockInfo.lastDate}</p>

            <h5>Short Stock Info ({shortStock}):</h5>
            <p>Latest Closing Price: ${shortStockInfo.latestClose}</p>
            <p>Last Available Date: {shortStockInfo.lastDate}</p>

            <h5>Common Data Points:</h5>
            <p>{commonTimestampsCount} overlapping dates used for analysis</p>
          </div>
        </Col>

        <Col xs={12} md={9}>
        <h4 className="mt-5">Ratio Analysis</h4>
          <LineChartComponent
            data={ratioData}
            dataKeyX="time"
            dataKeyY="value"
            yAxisLabel="Ratio Value"
          />

          <h4>Spread Analysis</h4>
          <LineChartComponent
            data={spreadData}
            dataKeyX="time"
            dataKeyY="value"
            yAxisLabel="Spread Value"
          />
        </Col>
      </Row>
    </Container>
  );
}

export default SpreadRatioAnalysis;
