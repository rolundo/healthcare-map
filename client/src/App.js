import React from 'react'
import ReactDOMServer from 'react-dom/server'
import axios from 'axios'
import L from 'leaflet'
import { Map, Marker, LayersControl, LayerGroup, TileLayer } from 'react-leaflet'
import Control from 'react-leaflet-control'
import { Rectangle } from 'react-shapes'
import FilterButton from './components/filter-button'
import FilterModal from './components/filter-modal'
import Popup from './components/popup'
import 'leaflet/dist/leaflet.css'
import './css/app.css'

L.Icon.Default.imagePath =
'../node_modules/leaflet'

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


const color = (type) => {
  switch(type) {
    case 'Clinics': return 'blue';
    case 'Dentists': return 'green';
    case 'Hospitals': return 'red';
    default: return 'black'
  }
}

const colorString = (type) => {
  let color = ''
  let layer
  switch(type) {
    case 'Clinics': layer = 'Clinics'; color = 'blue'; break;
    case 'Dentists': layer = 'Dentists'; color = 'green'; break;
    case 'Hospitals': layer = 'Hospitals'; color = 'red'; break;
    default: color = '#000000'; break;
  }

  return (
    <div className='layerControl'>
      <div className='layerColor'>
      <Rectangle width={12} height={12} fill={{ color }} />
      </div>
      <div className='layerName'>
        {layer}
      </div>
    </div>
  )
}

const markerHtmlStyles = (type) => {
  return `
    background-color: ${color(type)};
    width: 1rem;
    height: 1rem;
    display: block;
    left: -.25rem;
    top: -.25rem;
    position: relative;
    border-radius: 1rem 1rem 0;
    transform: rotate(45deg);
    border: 1px solid #FFFFFF
  `
}

const icon = (name) => {
  return L.divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 12],
    labelAnchor: [-12, 0],
    popupAnchor: [4, -18],
    html: `<span style="${markerHtmlStyles(name)}" />`
  })
}

export default class HealthcareMap extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      clinics: [],
      dentists: [],
      hospitals: [],
      showFilterModal: false,
    }
  }

  async componentDidMount() {
    try {
      const res = await axios.get('https://healthcare-map.herokuapp.com/locations')
      this.setState({
        clinics: res.data.filter(l => l.type === 'clinic'),
        dentists: res.data.filter(l => l.type === 'dentist'),
        hospitals: res.data.filter(l => l.type === 'hospital')
      })
    } catch(err) {
      console.log(`Error fetching locations: ${err}`)
    }
  }

  markerLayer = (type, locations) => {
    return (
      <LayersControl.Overlay 
      name={ReactDOMServer.renderToString(colorString(type))}
      checked={true}
      >
        <LayerGroup>
          {locations.map(l => (
            <Marker key={l._id} position={l.coordinates} icon={icon(type)}>
              <Popup feature={l}/>
            </Marker>
          ))}
        </LayerGroup>
      </LayersControl.Overlay>
    )
  }

  filterLocations = (locations) => {
    this.setState({
      clinics: locations.filter(l => l.type === 'clinic'),
      dentists: locations.filter(l => l.type === 'dentist'),
      hospitals: locations.filter(l => l.type === 'hospital'),
    })
  }

  render () {
    return (
      <Map 
        center={[30.2, -96.5]}
        style={{position: 'absolute', width: '100%', top: 0, bottom: 0 }} 
        maxZoom={20}
        zoom={9}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        <LayersControl>
          {this.markerLayer('Clinics', this.state.clinics)}
          {this.markerLayer('Dentists', this.state.dentists)}
          {this.markerLayer('Hospitals', this.state.hospitals)}
        </LayersControl>
        <Control position='topleft'>
          <FilterButton showFilterModal={() => this.setState({ showFilterModal: true })}/>
        </Control>
        <FilterModal 
          show={this.state.showFilterModal} 
          handleHide={() => this.setState({ showFilterModal: false })}
          filterLocations={this.filterLocations}
        />
      </Map>
    )
  }
}