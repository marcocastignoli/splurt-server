const dotenv = require('dotenv');
dotenv.config();

const config = {
  mongodb: {
    url: `mongodb://${process.env.MONGO_URL}`,
    databaseName: process.env.MONGO_DB,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog"
};

module.exports = config;
