import React from 'react';
import { Link } from "react-router-dom";
import { json, checkStatus } from './utils';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ConvResults = () => {
  return (
    <h3>Conversion Results</h3>
  )
}


class Converter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      results: [],
      error: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const { searchTerm, results, error } = this.state;

    return (
      <Container>
        <Row>
          <Col>
          <h1>Currency Converter</h1>
          <ConvResults />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Converter;