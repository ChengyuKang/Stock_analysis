// src/pages/StockPick.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, ListGroup, Alert } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

function StockPick() {
  const [stockInput, setStockInput] = useState('TSLA');
  const [stockList, setStockList] = useState([]);
  const [error, setError] = useState(null);
  const { marketDataToken } = require('../config');

  useEffect(() => {
    const loadStockList = async () => {
      try {
        const response = await fetch('http://localhost:5000/stockList');
        const data = await response.json();
        setStockList(data.map(stock => stock.name));

        // Fetch stock data for each stock in the list
        data.forEach(stock => {
          fetchStockData(stock.name, true);
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load stock list from server.');
      }
    };

    loadStockList();
  }, []);

  const saveStockList = async (newStock) => {
    try {
      await fetch('http://localhost:5000/stockList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newStock }),
      });
    } catch (err) {
      console.error(err);
      setError('Failed to save stock list to server.');
    }
  };

  const saveOrUpdateStockData = async (symbol, data) => {
    try {
      const response = await fetch(`http://localhost:5000/Stockdata?symbol=${symbol}`);
      const existingData = await response.json();

      if (existingData.length > 0) {
        // Update existing record
        await fetch(`http://localhost:5000/Stockdata/${existingData[0].id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ symbol, data }),
        });
      } else {
        // Save new record
        await fetch('http://localhost:5000/Stockdata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ symbol, data }),
        });
      }
    } catch (err) {
      console.error(err);
      setError('Failed to save stock data to server.');
    }
  };

  const fetchStockData = async (symbol, onLoad = false) => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    oneYearAgo.setDate(oneYearAgo.getDate() + 1);

    const from = oneYearAgo.toISOString().split('T')[0];
    const to = today.toISOString().split('T')[0];

    try {
      const response = await fetch(
        `https://api.marketdata.app/v1/stocks/candles/D/${symbol}?from=${from}&to=${to}&token=${marketDataToken}`
      );
      const data = await response.json();

      if (data.s === 'ok') {
        console.log(data);
        saveOrUpdateStockData(symbol, data);
        if (!onLoad) {
          setError(null);
        }
      } else {
        if (!onLoad) {
          setError('No data available for the selected stock and time range.');
        }
      }
    } catch (err) {
      console.error(err);
      if (!onLoad) {
        setError('Failed to fetch stock data.');
      }
    }
  };

  const handleAddStock = () => {
    const trimmedStock = stockInput.trim();

    if (trimmedStock === '') {
      setError('Stock name cannot be empty.');
    } else if (stockList.includes(trimmedStock)) {
      setError('Stock already exists in the list.');
    } else {
      const newStockList = [...stockList, trimmedStock];
      setStockList(newStockList);
      setStockInput(''); 
      setError(null);
      saveStockList(trimmedStock);

      fetchStockData(trimmedStock); 
    }
  };

  const handleDeleteStock = async (index) => {
    const stockToDelete = stockList[index];
    const newStockList = stockList.filter((_, i) => i !== index);
    setStockList(newStockList);

    try {
      const response = await fetch(`http://localhost:5000/stockList?name=${stockToDelete}`);
      const data = await response.json();
      if (data.length > 0) {
        await fetch(`http://localhost:5000/stockList/${data[0].id}`, {
          method: 'DELETE',
        });
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete stock from server.');
    }
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col xs={12} md={8} lg={6}>
          <Form>
            <Form.Group>
              <Form.Label>Enter Stock Symbol or Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., AAPL, TSLA"
                value={stockInput}
                onChange={(e) => setStockInput(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddStock} className="mt-2">
              Add Stock
            </Button>
            {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
          </Form>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xs={12} md={8} lg={6}>
          <h4>Stock List</h4>
          <ListGroup>
            {stockList.map((stock, index) => (
              <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                {stock}
                <Button variant="danger" size="sm" onClick={() => handleDeleteStock(index)}>
                  <FaTrash />
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default StockPick;
