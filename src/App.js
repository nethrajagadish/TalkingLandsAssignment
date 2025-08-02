import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMapEvents,
} from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import './App.css';
import L from 'leaflet';

// Fix for Leaflet marker icon in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function App() {
  const [properties, setProperties] = useState([]);
  const [boundary, setBoundary] = useState(null);
  const [clickedInfo, setClickedInfo] = useState(null);

  useEffect(() => {
    fetch('/data/properties.json')
      .then((res) => res.json())
      .then((data) => setProperties(data));
  }, []);

  useEffect(() => {
    fetch('/data/bangalore_boundary.json')
      .then((res) => res.json())
      .then((data) => setBoundary(data));
  }, []);

  const ClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setClickedInfo({ lat, lng });
      },
    });
    return null;
  };

  return (
    <div className="app-container">
      <div className="map-wrapper">
        <MapContainer
          center={[12.9716, 77.5946]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {properties.map((prop) => (
            <Marker key={prop.id} position={prop.coordinates}>
              <Popup>
                <strong>{prop.title}</strong>
                <br />
                {prop.location}
                <br />
                Price: {prop.price}
              </Popup>
            </Marker>
          ))}

          {boundary && (
            <GeoJSON data={boundary} style={{ color: 'blue', weight: 2 }} />
          )}

          <ClickHandler />
        </MapContainer>
      </div>

      <div className="sidebar">
        <h2>Real Estate Map</h2>
        <h3>Clicked Location</h3>
        {clickedInfo ? (
          <>
            <p>Latitude: {clickedInfo.lat.toFixed(4)}</p>
            <p>Longitude: {clickedInfo.lng.toFixed(4)}</p>
          </>
        ) : (
          <p>Click on the map to get coordinates</p>
        )}
      </div>
    </div>
  );
}

export default App;
