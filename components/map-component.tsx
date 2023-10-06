import { type LatLngExpression } from 'leaflet';
import { useEffect, type FC, useState, type Dispatch, type SetStateAction } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

interface MarkerData {
  position: LatLngExpression;
  title: string;
}

const MapComponent: FC = () => {
  const [{ position, title }, setMarkerData] = useState<MarkerData>({
    position: [51.505, -0.09],
    title: 'London, Capital of England',
  });

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      style={{ width: '100vw', height: '100vh' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>{title}</Popup>
      </Marker>
      <InitView setMarkerData={setMarkerData} />
    </MapContainer>
  );
};

interface InitViewProps {
  setMarkerData: Dispatch<SetStateAction<MarkerData>>;
}

const InitView: FC<InitViewProps> = ({ setMarkerData }) => {
  const map = useMap();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setMarkerData({ position: [latitude, longitude], title: 'Current Location' });
        map.flyTo([latitude, longitude], map.getZoom(), {
          animate: true,
          duration: 1.5,
        });
      },
      (error) => {
        console.log('Something Wrong');
      }
    );
  }, []);

  return null;
};

export default MapComponent;
