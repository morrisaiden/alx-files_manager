import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.myClient = createClient();
    this.myClient.on('error', (error) => console.log(error));

    // Wait for the client to be ready before allowing operations
    this.readyPromise = new Promise((resolve) => {
      this.myClient.on('ready', () => {
        console.log('true');
        resolve();
      });
    });
  }

  async isAlive() {
    await this.readyPromise; // Ensure the client is ready
    return this.myClient.connected;
  }

  async get(key) {
    await this.readyPromise; // Ensure the client is ready
    const getAsync = promisify(this.myClient.GET).bind(this.myClient);
    return getAsync(key);
  }

  async set(key, val, time) {
    await this.readyPromise; // Ensure the client is ready
    const setAsync = promisify(this.myClient.SET).bind(this.myClient);
    return setAsync(key, val, 'EX', time);
  }

  async del(key) {
    await this.readyPromise; // Ensure the client is ready
    const delAsync = promisify(this.myClient.DEL).bind(this.myClient);
    return delAsync(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;