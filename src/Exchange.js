import React from 'react';
import { json, checkStatus } from './utils';
import currencies from './currencies';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

const ConvTable = (props) => {
  const { base, rates } = props;
  if (!rates) {
    return null;
  }
  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th></th>
          <th>1.00 {base}</th>
        </tr>
      </thead>
      <tbody>
        {rates.map(currency => 
          <tr key={currency.acronym}>
            <td>{currency.name} ({currency.acronym})</td>
            <td>({currency.symbol}) {currency.rate}</td>
          </tr>
          )}
      </tbody>
    </Table>
  )
}

class Exchange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base: 'USD',
      rates: null,
      loading: false,
    };
  }

  componentDidMount() {
    this.getRatesData(this.state.base);
  }

  changeBase = (event) => {
    this.setState({ base: event.target.value });
    this.getRatesData(event.target.value);
  }

  getRatesData = (base) => {
    this.setState({ loading: true });
    fetch(`https://www.frankfurter.app/latest?base=${base}`)
      .then(checkStatus)
      .then(json)
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }

        const rates = Object.keys(data.rates)
          .filter(acronym => acronym !== base)
          .map(acronym => ({
            acronym,
            rate: data.rates[acronym],
            name: currencies[acronym].name,
            symbol: currencies[acronym].symbol,
          }))

        this.setState({ rates, loading: false });
      })
      .catch(error => console.error(error.message));
  }

  render() {
    const { base, rates, loading } = this.state;
    const currencyOptions = Object.keys(currencies).map(currencyAcronym => <option key={currencyAcronym} value={currencyAcronym}>{currencyAcronym}</option>);


    return (
      <Container>
        <Row>
          <Col>
            <h1 className='text-center m-3'>Exchange Rates</h1>
            <h3 className='text-center m-3'>Base Currency: 1</h3>
            <div className='mb-5 mt-5'>
              <Form className='mb-3'>              
                <Form.Select value={base} onChange={this.changeBase} disable={{loading}.toString()}>
                  {currencyOptions}
                </Form.Select>
              </Form>
              <ConvTable base={base} rates={rates} />
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Exchange;