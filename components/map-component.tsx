import { type LatLngExpression } from 'leaflet';
import { type FC, useState, type Dispatch, type SetStateAction, useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

const formSchema = z.object({
  role: z.literal('user'),
  content: z.string().min(1, {
    message: 'Search content is required.',
  }),
});

interface MarkerData {
  position: LatLngExpression;
  title: string;
}

const MapComponent: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [{ position, title }, setMarkerData] = useState<MarkerData>({
    position: [51.505, -0.09],
    title: 'London, Capital of England',
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: 'user',
      content: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (userMessage) => {
    if (isLoading) return;

    setIsLoading(true);
    const { data } = await axios.post('/api/coordinates', { userMessage });

    setIsLoading(false);
    setMarkerData(data);
  };

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
      <div className="absolute bottom-5 left-0 w-full z-[10000] p-3">
        <div className="flex justify-center container">
          <Form {...form}>
            <form className="relative w-[400px] max-w-full" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="m-0 p-0">
                      <Input
                        className="flex-grow p-2 border rounded-md bg-white disabled:opacity-100 pr-10"
                        required
                        disabled={isLoading}
                        placeholder="Search location"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {isLoading ? (
                <div
                  aria-label="Loading..."
                  role="status"
                  className="absolute top-0 right-2 bottom-0 flex items-center"
                >
                  <svg className="animate-spin w-6 h-6 fill-blue-500" viewBox="3 3 18 18">
                    <path
                      className="opacity-20"
                      d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                    />
                    <path d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z" />
                  </svg>
                </div>
              ) : (
                <button type="submit" className="absolute top-0 right-0 bottom-0">
                  Search
                </button>
              )}
            </form>
          </Form>
        </div>
      </div>
      <InitView position={position} setMarkerData={setMarkerData} />
    </MapContainer>
  );
};

interface InitViewProps {
  position: MarkerData['position'];
  setMarkerData: Dispatch<SetStateAction<MarkerData>>;
}

const InitView: FC<InitViewProps> = ({ position, setMarkerData }) => {
  const map = useMap();
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setMounted(true);
        setMarkerData({ position: [latitude, longitude], title: 'Current Location' });
      },
      (error) => {
        setMounted(true);
        console.log('Location access deined');
      }
    );
  }, []);

  useEffect(() => {
    if (isMounted) {
      map.flyTo(position, map.getZoom(), {
        animate: true,
        duration: 1.5,
      });
    }
  }, [position]);

  return null;
};

export default MapComponent;
