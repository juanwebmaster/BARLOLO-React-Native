/* eslint-disable prettier/prettier */
import env from '../../env.json';

class Config {
  get(key) {
    return env[key];
  }
}

const config = new Config();
export default config;
