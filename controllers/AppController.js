import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static async getStatus(req, res) {
    const redisStatus = redisClient.isAlive(); // Check Redis status
    const dbStatus = dbClient.isAlive(); // Check DB status
    res.status(200).json({ redis: redisStatus, db: dbStatus });
  }

  static async getStats(req, res) {
    const usersCount = await dbClient.nbUsers(); // Count users in DB
    const filesCount = await dbClient.nbFiles(); // Count files in DB
    res.status(200).json({ users: usersCount, files: filesCount });
  }
}

export default AppController;
