const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Creating the Express server
const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.all('/*', (req, res, next) => {
  // CORS headers
  res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});
const port = process.env.PORT || 8080;
const dbPath = 'contacts.db';

// Server configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Database connection
let db = null;

async function createTables() {
  try {
    await db.run(
      `CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      emailaddress text,
      streetaddress text,
      city text,
      state text DEFAULT NULL,
      zipcode text DEFAULT NULL,
      phonenumber text DEFAULT NULL,
      isactive INTEGER DEFAULT 1,
      created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
      [],
    );
    return console.log("Successful creation of the 'Contacts' table");
  } catch (e) {
    return console.error(e.message);
  }
}
fs.createWriteStream(dbPath, { overwrite: false });

const dbName = path.join(__dirname, dbPath);
console.log(dbName);
db = new sqlite3.Database(dbName, (err) => {
  if (err) {
    return console.error(err.message);
  }
  createTables();
});
// Hack to look like node-postgres
db.query = function (sql, params, callback) {
  if (!Array.isArray(params)) throw new Error('params is not an array!');
  sql = sql.replace(/SERIAL PRIMARY KEY/, 'INTEGER PRIMARY KEY AUTOINCREMENT');
  this.all(sql, params, (err, rows) => {
    callback(err, rows);
  });
};

app.listen(port, () => {
  console.log(`listening on *:${port}`);
});

// check to see if call is working
app.get('/', (req, res) => {
  res.status(200).send('We are hot!');
});

// /allContacts return list of all active contacts
app.post('/allContacts', async (req, res) => {
  console.log('Get contacts');
  try {
    await db.query('SELECT * FROM contacts WHERE isactive = 1 ORDER BY lastname ASC', [], (err, rows) => {
      if (!err) {
        res.status(200).send(rows);
      } else {
        res.status(400).send('Error receiving data');
      }
    });
  } catch (e) {
    res.status(500).send('Unauthorized');
  }
});

// /contact return individual contact
app.post('/contact', async (req, res) => {
  console.log('Get individual contact');
  try {
    if (req.body && req.body.user && req.body.user.id) {
      await db.query(
        'SELECT * FROM contacts WHERE isactive = 1 AND id = ? LIMIT 1',
        [req.body.user.id],
        (err, rows) => {
          if (!err && rows && rows[0]) {
            res.status(200).send(rows[0]);
          } else {
            res.status(404).send('Contact does not exist');
          }
        },
      );
    } else {
      res.status(404).send('No contact information was passed');
    }
  } catch (e) {
    res.status(500).send('Unauthorized');
  }
});

// /updateContact update contact
app.post('/updateContact', async (req, res) => {
  console.log('Get individual contact');
  try {
    if (req.body && req.body.user) {
      const { user } = req.body;
      if (
        user.id &&
        user.firstname &&
        user.lastname &&
        user.emailaddress &&
        user.phonenumber &&
        user.streetaddress &&
        user.city &&
        user.state &&
        user.zipcode
      ) {
        let qu = '';
        const da = [
          user.firstname,
          user.lastname,
          user.emailaddress,
          user.phonenumber,
          user.streetaddress,
          user.city,
          user.state,
          user.zipcode,
        ];
        if (user.id !== -1) {
          da.push(user.id);
          qu =
            'UPDATE contacts SET firstname = ?, lastname = ?, emailaddress = ?, phonenumber = ?, streetaddress = ?, city = ?, state = ?, zipcode = ?, updated = CURRENT_TIMESTAMP WHERE id = ?';
        } else {
          qu =
            'INSERT INTO contacts (firstname, lastname, emailaddress, phonenumber, streetaddress, city, state, zipcode, updated) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_TIMESTAMP)';
        }

        await db.query(qu, da, (err, rows) => {
          console.log(err, rows);
          if (!err) {
            res.status(200).send('');
          } else {
            res.status(404).send('Error updating contact information');
          }
        });
      } else {
        res.status(404).send('Not all contact information was passed');
      }
    } else {
      res.status(404).send('No contact information was passed');
    }
  } catch (e) {
    res.status(500).send('Unauthorized');
  }
});

// /deleteContact delete contact
app.post('/deleteContact', async (req, res) => {
  console.log('Delete individual contact');
  try {
    if (req.body && req.body.user && req.body.user.id) {
      await db.query('UPDATE contacts SET isactive = -1 WHERE id = ?', [req.body.user.id], (err, rows) => {
        if (!err) {
          res.status(200).send('');
        } else {
          res.status(404).send('Contact does not exist');
        }
      });
    } else {
      res.status(404).send('No contact information was passed');
    }
  } catch (e) {
    res.status(500).send('Unauthorized');
  }
});
