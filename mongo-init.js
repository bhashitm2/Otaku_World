// Creates the least-privileged application account on the first MongoDB start.
// The official Mongo image runs this only while initializing an empty volume.
const databaseName = process.env.MONGO_INITDB_DATABASE;
const appUsername = process.env.MONGO_APP_USERNAME;
const appPassword = process.env.MONGO_APP_PASSWORD;

if (!databaseName || !appUsername || !appPassword) {
  throw new Error("MongoDB application credentials are required");
}

db.getSiblingDB(databaseName).createUser({
  user: appUsername,
  pwd: appPassword,
  roles: [{ role: "readWrite", db: databaseName }],
});
