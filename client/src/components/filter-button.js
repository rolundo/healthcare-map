import React from 'react'
import { Button, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/fontawesome-free-solid'
import "bootstrap/dist/css/bootstrap.min.css"

export default class FilterButton extends React.Component {
  tooltip = () => ( 
    <Tooltip id="tooltip">Filter</Tooltip>
  )

  render() {
    return (
      // <OverlayTrigger placement="right" overlay={this.tooltip}>
        <Button 
          className='filter-button'
          onClick={this.props.showFilterModal}
        >
          <FontAwesomeIcon
            icon={faFilter} 
            color='black' 
            style={{ height: '0.75em' }}
            cursor='pointer'
          />
        </Button>
      // </OverlayTrigger>
    )
  }
}