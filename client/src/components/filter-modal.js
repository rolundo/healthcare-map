import React from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import axios from 'axios'
import "bootstrap/dist/css/bootstrap.min.css"

export default class FilterModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      address: '',
      city: '',
      state: '',
      zipcode: '',
    }
  }

  onShow = () => {
    // this.setState({
    //   name: '',
    //   address: '',
    //   city: '',
    //   state: '',
    //   zipcode: '',
    // })
  }

  clearForm = () => {
    this.setState({
      name: '',
      address: '',
      city: '',
      state: '',
      zipcode: '',
    })
  }

  onSubmit = async(e) => {
    e.preventDefault()

    const body = {
      name: this.state.name,
      address: this.state.address,
      city: this.state.city,
      state: this.state.state,
      zipcode: this.state.zipcode
    }

    try {
      const res = await axios.post('https://healthcare-map.herokuapp.com/locations/filter', body)

      this.props.filterLocations(res.data)
      this.props.handleHide()
    } catch(err) {
      console.log(`Error filtering locations: ${err}`)
    }
  }

  render() {
    return (
      <Modal show={this.props.show} onShow={this.onShow} onHide={this.props.handleHide}>
        <Modal.Header closeButton>
          <Modal.Title>Filter Locations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.onSubmit}>
            <Form.Group>
              <Form.Label>Name: </Form.Label>
              <Form.Control 
                type='search'
                value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value })}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Address: </Form.Label>
              <Form.Control 
                type='search'
                value={this.state.address}
                onChange={(e) => this.setState({ address: e.target.value })}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>City: </Form.Label>
              <Form.Control 
                type='search'
                value={this.state.city}
                onChange={(e) => this.setState({ city: e.target.value })}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>State: </Form.Label>
              <Form.Control 
                type='search'
                value={this.state.state}
                onChange={(e) => this.setState({ state: e.target.value })}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>ZIP Code: </Form.Label>
              <Form.Control 
                type='search'
                value={this.state.zipcode}
                onChange={(e) => this.setState({ zipcode: e.target.value })}
              />
            </Form.Group>
            
            <Button className="mr-2" variant='secondary' value='Clear Form' onClick={this.clearForm}>Clear</Button>
            <Button type='submit' value='Filter Locations'>Filter</Button>
          </Form>
        </Modal.Body>
      </Modal>
    )
  }
}