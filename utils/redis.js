import redis from 'redis';

class RedisClient {
    constructor() {
        this.client = redis.createClient();

        this.client.on('error', (err) => {
            console.error('Redis connection error:', err);
        });

        this.client.on('ready', () => {
            console.log('Redis client connected successfully.');
        });
    }

    isAlive() {
      this.client.ping((err, reply) => {
          if (err || reply !== 'PONG') {
              console.log(false);
          } else {
              console.log(true);
          }
      });
    }

    async get(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, value) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(value);
                }
            });
        });
    }

    async set(key, value, duration) {
        return new Promise((resolve, reject) => {
            this.client.setex(key, duration, value, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async del(key) {
        return new Promise((resolve, reject) => {
            this.client.del(key, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
