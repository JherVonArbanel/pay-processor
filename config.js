require('dotenv').config();

module.exports = {
  ttlMinutes: process.env.TTL_MINUTES,
  database_user: process.env.DATABASE_USER,
  database_password: process.env.DATABASE_PASSWORD,
  database_url: process.env.DATABASE_URL,
  kafkaPort: process.env.KAFKA_PORT,
  kafkaHost: process.env.KAFKA_HOST,
};  
