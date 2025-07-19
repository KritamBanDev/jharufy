import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Logger from '../src/utils/logger.js';

let mongo;

// Connect to the in-memory database
export const connect = async () => {
  try {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    await mongoose.connect(uri);
    Logger.info('Connected to in-memory test database');
  } catch (error) {
    Logger.error('Error connecting to test database:', error);
    throw error;
  }
};

// Drop database, close connection and stop mongod
export const closeDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
    Logger.info('Test database connection closed');
  } catch (error) {
    Logger.error('Error closing test database:', error);
    throw error;
  }
};

// Clear all data in the database
export const clearDatabase = async () => {
  try {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
    Logger.info('Test database cleared');
  } catch (error) {
    Logger.error('Error clearing test database:', error);
    throw error;
  }
};
