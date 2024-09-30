const { FileModel } = require('../models/File'); // Import your Mongoose model

describe('DB Client', () => {
  beforeAll(async () => {
    await FileModel.deleteMany({});
  });

  afterAll(async () => {
    await FileModel.deleteMany({});
  });

  test('should create a new file document', async () => {
    const file = new FileModel({ name: 'test_file.png', type: 'image' });
    await file.save();
    const foundFile = await FileModel.findById(file._id);
    expect(foundFile.name).toBe('test_file.png');
  });

  test('should return null for non-existing file', async () => {
    const foundFile = await FileModel.findById('non_existing_id');
    expect(foundFile).toBe(null);
  });
});
