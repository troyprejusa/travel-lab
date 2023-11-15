import CityPhoto from '../assets/city.jpg';
import CountrysidePhoto from '../assets/countryside.jpg';
import HistoricalPhoto from '../assets/historical.jpg';
import RoadTripPhoto from '../assets/road_trip.jpg';
import TropicalPhoto from '../assets/tropical.jpg';
import WildernessPhoto from '../assets/wilderness.jpg';
import WinterPhoto from '../assets/winter.jpg';

const vite_mode = import.meta.env.MODE; // Automatically set by Vite
const deployment = import.meta.env.VITE_DEPLOYMENT;

let mode;   // development, staging, or production
if (vite_mode === 'production' && deployment !== 'heroku') {
  mode = 'staging';
} else {
  mode = vite_mode;
}

const Constants = {
  MODE: mode,
  PROXY_HOST: mode === 'production' ?  import.meta.env.VITE_PROD_PROXY_HOST : import.meta.env.VITE_DEV_PROXY_HOST,
  PROXY_PORT: mode === 'development' ? import.meta.env.VITE_DEV_PROXY_PORT : '443',

  AUTH0_DOMAIN: mode === 'production' ? import.meta.env.VITE_PROD_AUTH0_DOMAIN : import.meta.env.VITE_DEV_AUTH0_DOMAIN,
  AUTH0_CLIENT: mode === 'production' ? import.meta.env.VITE_PROD_AUTH0_CLIENT : import.meta.env.VITE_DEV_AUTH0_CLIENT,
  AUTH0_AUDIENCE: mode === 'production' ? import.meta.env.VITE_PROD_AUTH0_AUDIENCE : import.meta.env.VITE_DEV_AUTH0_AUDIENCE,

  PHOTO_MAP: {
    city: CityPhoto,
    countryside: CountrysidePhoto,
    historical: HistoricalPhoto,
    road_trip: RoadTripPhoto,
    tropical: TropicalPhoto,
    wilderness: WildernessPhoto,
    winter: WinterPhoto,
    default: RoadTripPhoto,
  },

  COLORS: ['#00C49F', '#FFBB28', '#0088FE', '#FF8042', '#9933FF'],
  BACKGROUND_TRANSPARENCY: 'rgba(255, 255, 255, 0.6)',
  BACKROUND_GRADIENT:
    'linear-gradient(135deg, rgba(66, 165, 245, 0.7), rgba(255, 167, 38, 0.7))',

  NAVBAR_LEFT_PANE_WIDTH: '15rem',
  NAVBAR_TOP_PANE_HEIGHT: '5rem',
  OUTLET_PADDING: '1rem',
};

export default Constants;
