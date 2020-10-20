import devConfig from './app.config.dev';
import prodConfig from './app.config.prod';

const selectedConfiguration = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

export default selectedConfiguration;
