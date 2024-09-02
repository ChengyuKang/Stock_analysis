// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { FaTachometerAlt, FaChartLine, FaCogs, FaChartPie } from 'react-icons/fa';
import StockPick from './pages/StockPick';
import PortfolioModeling from './pages/PortfolioModeling'; // Import the PortfolioModeling component

function App() {
  return (
    <Router>
      <Container fluid className="p-0">
        {/* Top Navbar */}
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="/">Stock Analyzer</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                <Nav.Link href="#about">About</Nav.Link>
                <Nav.Link href="#contact">Contact</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Row>
          {/* Left Sidebar */}
          <Col xs={2} className="bg-secondary text-white min-vh-100 p-0">
            <Nav className="flex-column p-3">
              <Nav.Item className="mb-3">
                <Nav.Link href="/dashboard" className="text-white">
                  <FaTachometerAlt className="mr-2" /> Dashboard
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mb-3">
                <Nav.Link href="/stock-pick" className="text-white">
                  <FaChartLine className="mr-2" /> Stock Pick
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mb-3">
                <Nav.Link href="/portfolio-modeling" className="text-white">
                  <FaCogs className="mr-2" /> Portfolio Modeling
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mb-3">
                <Nav.Link href="/portfolio-volatility" className="text-white">
                  <FaChartPie className="mr-2" /> Portfolio Volatility
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          {/* Main Content */}
          <Col xs={10} className="p-4">
            <Routes>
              <Route path="/stock-pick" element={<StockPick />} />
              <Route path="/dashboard" element={<div><h2>Dashboard</h2></div>} />
              <Route path="/portfolio-modeling" element={<PortfolioModeling />} />
              <Route path="/portfolio-volatility" element={<div><h2>Portfolio Volatility</h2></div>} />
              <Route path="/" element={<div><h2>Welcome to the Stock Analyzer</h2></div>} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
