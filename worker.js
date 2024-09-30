const Bull = require('bull');
const { FileModel } = require('./models/File'); // Assuming a Mongoose model is used
const imageThumbnail = require('image-thumbnail');

const fileQueue = new Bull('fileQueue');

fileQueue.process(async (job) => {
  const { userId, fileId } = job.data;

  if (!fileId) {
    throw new Error('Missing fileId');
  }

  if (!userId) {
    throw new Error('Missing userId');
  }

  const file = await FileModel.findOne({ _id: fileId, userId });
  if (!file) {
    throw new Error('File not found');
  }

  if (file.type !== 'image') {
    return; // Only process images
  }

  const sizes = [500, 250, 100];

  for (const size of sizes) {
    const thumbnailOptions = { width: size };
    const thumbnail = await imageThumbnail(file.localPath, thumbnailOptions);
    const thumbnailPath = `${file.localPath}_${size}`;

    // Save the thumbnail to the same location with size suffix
    fs.writeFileSync(thumbnailPath, thumbnail);
  }
});

// Start the worker
fileQueue.on('completed', (job) => {
  console.log(`Job completed: ${job.id}`);
});

fileQueue.on('failed', (job, err) => {
  console.error(`Job failed: ${job.id} with error ${err.message}`);
});
