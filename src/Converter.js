import React from 'react';
import { json, checkStatus } from './utils';
import currencies from './currencies';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Chart from 'chart.js/auto';


class Converter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: 0,
      baseAcronym: 'USD',
      baseValue: 0,
      quoteAcronym: 'AUD',
      quoteValue: 0,
      loading: false,
    };

    this.chartRef = React.createRef();

  }

  componentDidMount() {
    const { baseAcronym, quoteAcronym } = this.state;
    this.getRate(baseAcronym, quoteAcronym);
    this.getHistoricalRates(baseAcronym, quoteAcronym);
  }

  getRate(base, quote) {
    this.setState({ loading: true });
    fetch(`https://www.frankfurter.app/latest?base=${base}&symbols=${quote}`)
      .then(checkStatus)
      .then(json)
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }

        const rate = data.rates[quote];

        this.setState({
          rate,
          baseValue: 1,
          quoteValue: Number((1 * rate).toFixed(3)),
          loading: false,
        });
      })
      .catch(error => console.error(error.message));
  }

  toBase(amount, rate) {
    return amount * (1 / rate);
  }

  toQuote(amount, rate) {
    return amount * rate;
  }

  convert(amount, rate, equation) {
    const input = parseFloat(amount);
    if (Number.isNaN(input)) {
      return '';
    }
    return equation(input, rate).toFixed(3);
  }
  
  changeBaseAcronym = (event) => {
    const baseAcronym = event.target.value;
    this.setState({ baseAcronym });
    this.getRate(baseAcronym, this.state.quoteAcronym);
    this.getHistoricalRates(baseAcronym, this.state.quoteAcronym);
  }

  changeBaseValue = (event) => {
    const quoteValue = this.convert(event.target.value, this.state.rate, this.toQuote);
    this.setState({
      baseValue: event.target.value,
      quoteValue,
    });
  }

  changeQuoteAcronym = (event) => {
    const quoteAcronym = event.target.value;
    this.setState({ quoteAcronym });
    this.getRate(this.state.baseAcronym, quoteAcronym);
    this.getHistoricalRates(this.state.baseAcronym, quoteAcronym);
  }

  changeQuoteValue = (event) => {
    const baseValue = this.convert(event.target.value, this.state.rate, this.toBase);
    this.setState({
      quoteValue: event.target.value,
      baseValue,
    });
  }

  getHistoricalRates = (base, quote) => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date((new Date).getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
    fetch(`https://api.frankfurter.app/${startDate}..${endDate}?from=${base}&to=${quote}`)
      .then(checkStatus)
      .then(json)
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        const chartLabels = Object.keys(data.rates);
        const chartData = Object.values(data.rates).map(rate => rate[quote]);
        const chartLabel = `${base}/${quote}`;
        this.buildChart(chartLabels, chartData, chartLabel);
      })
      .catch(error => console.error(error.message));
  }

  buildChart = (labels, data, label) => {
    const chartRef = this.chartRef.current.getContext("2d");
    if (typeof this.chart !== "undefined") {
      this.chart.destroy();
    }
    this.chart = new Chart(this.chartRef.current.getContext("2d"), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: label,
            data,
            fill: false,
            tension: 0,
          }
        ]
      },
      options: {
        responsive: true,
      }
    })
  }

  render() {
    const { rate, baseAcronym, baseValue, quoteAcronym, quoteValue, loading } = this.state;
    const currencyOptions = Object.keys(currencies).map(currencyAcronym => <option key={currencyAcronym} value={currencyAcronym}>{currencyAcronym}</option>);

    return (
      <Container>
        <Row>
          <Col>
            <h1 className='text-center m-3'>Currency Converter</h1>
            <h3 className='text-center m-3'>1 {baseAcronym} to 1 {quoteAcronym} = {rate.toFixed(4)} {currencies[quoteAcronym].name}</h3>
            <div className='mb-5 mt-5'>
              <Form>
                <Form.Group controlId="base" className='mb-3'>
                  <Form.Select value={baseAcronym} onChange={this.changeBaseAcronym} disable={{ loading }.toString()}>
                    {currencyOptions}
                  </Form.Select>
                </Form.Group>
                <InputGroup className='mb-3'>
                  <InputGroup.Text>{currencies[baseAcronym].symbol}</InputGroup.Text>
                  <Form.Control type="number" value={baseValue} onChange={this.changeBaseValue} />
                </InputGroup>
                <small className="text-secondary">{currencies[baseAcronym].name}</small>
                <h1 className='text-center'>=</h1>
                <Form.Group controlId="quote" className='mb-3'>
                  <Form.Select value={quoteAcronym} onChange={this.changeQuoteAcronym} disable={{ loading }.toString()}>
                    {currencyOptions}
                  </Form.Select>
                </Form.Group>
                <InputGroup className='mb-3'>
                  <InputGroup.Text>{currencies[quoteAcronym].symbol}</InputGroup.Text>
                  <Form.Control type="number" value={quoteValue} onChange={this.changeQuoteValue} />
                </InputGroup>
                <small className="text-secondary">{currencies[quoteAcronym].name}</small>
              </Form>
              <canvas ref={this.chartRef} />
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Converter;