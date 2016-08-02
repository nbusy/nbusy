const AWS = require('aws-sdk');

AWS.config.endpoint = 'http://localhost:8000';
AWS.config.region = 'us-west-2';
const db = new AWS.DynamoDB();

exports.printTableNames = async function() {
  try {
    const names = await db.listTables().promise();
    console.log('table names: ', names.TableNames);
  } catch (e) {
    console.error(e);
  }
};
