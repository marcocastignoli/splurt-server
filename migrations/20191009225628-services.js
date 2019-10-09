module.exports = {
  up(db) {
    return db.createCollection('services')
  },
  down(db) {
    return db.collection('services').drop()
  }
};
