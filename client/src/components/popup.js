import React from 'react'
import { Popup } from 'react-leaflet'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle } from '@fortawesome/fontawesome-free-solid'
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'


export default class PopupComponent extends React.Component {
  reportInfo = async() => {
    const reason = await Swal.fire({
      title: 'Report Incorrect Info',
      text: 'Enter reason for report:',
      input: 'textarea',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return 'You must provide a reason.'

        if (value.length < 5) return 'Reason must be at least 5 characters long.'

        if (value.split(" " ).length < 2) return 'Reason must be at least 2 words long.'
      }
    })

    if (reason.value) {
      Swal.fire('Success', 'Report has been sent.', 'success')
    }
  }

  coordinates = () => {
    const latitude = this.props.feature.coordinates[0]
    const longitude = this.props.feature.coordinates[1]
    const tooltip = ( <Tooltip>Report Incorrect Info</Tooltip> )

    return (
      <div>
        <a 
          href={`https://www.google.com/maps?&z=15&q=${latitude},${longitude}&ll=${latitude},${longitude}`} 
          target="_blank"
          rel="noopener noreferrer"
        >
          Open in Google Maps
        </a>&nbsp;
        <OverlayTrigger placement='right' overlay={tooltip}>
          <FontAwesomeIcon
            icon={faExclamationCircle} 
            color='darkred' 
            style={{ height: '2em', verticalAlign: 'middle' }}
            cursor='pointer'
            onClick={this.reportInfo}
          />
        </OverlayTrigger>
        <br/>
      </div>
    )
  }

  render() {
    const { name, address, city, state, zipcode } = this.props.feature

    return (
      <Popup>
        <span className='font-weight-bold'>{name}</span><br/>
        <span>{address}</span><br/>
        <span>{`${city}, ${state} ${zipcode}`}</span><br/>
        {this.coordinates()}
      </Popup>
    )
  }
}