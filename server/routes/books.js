var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/omicron';

router.get('/', function (req, res) {
  // Retrieve books from database
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * FROM books', function (err, result) {
      done(); // closes connection, I only have 10!

      if (err) {
        res.sendStatus(500);
      }

      res.send(result.rows);
    });
  });
});

//new GET that will get based on filter;
router.get('/:id', function (req, res) {
  // genre filter
  var id = req.params.id;
  console.log(id);

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }
    //query based on ID that is defined based on the filter;
    client.query('SELECT * FROM books ' +
                'WHERE genre ILIKE $1',
                [id],
                function (err, result) {
      done();

      if (err) {
        res.sendStatus(500);
      }

      res.send(result.rows);
    });
  });
});

router.post('/', function (req, res) {
  var book = req.body;
  console.log(req.body);

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('INSERT INTO books (author, title, published, genre) '
                + 'VALUES ($1, $2, $3, $4)',
                [book.author, book.title, book.published, book.genre],
                function (err, result) {
                  done();

                  if (err) {
                    res.sendStatus(500);
                  } else {
                    res.sendStatus(201);
                  }
                });
  });
});

// /:id is a catch all for anything that is after /books - will be set to the server ID parameter;
//req.params.id
router.put('/:id', function (req, res) {
  var id = req.params.id;
  var book = req.body;

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    //first param is our SQL, second param is the infor we get from the user;
    //blings dont need to match POST bling
    //id is the var that we created to equal the id of the param;
    //last param is the response
    //using an update query instead; getting an ID off of req.param.id and that is from the URL;
    client.query('UPDATE books ' +
                  'SET title = $1, ' +
                  'author = $2, ' +
                  'published = $3, ' +
                  'genre = $4 ' +
                  'WHERE id = $5',
                  [book.title, book.author, book.published, book.genre, id],
                  function (err, result) {
                    //close the connection;
                    done();

                    if (err) {
                      console.log('err', err);
                      res.sendStatus(500);
                    }else {
                      //200 is OK
                      res.sendStatus(200);
                    }
                  });
  });
});

router.delete('/:id', function (req, res) {
  var id = req.params.id;

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    //referencing the var ID with $1
    client.query('DELETE FROM books ' +
                  'WHERE id = $1',
                  [id],
                  function (err, result) {
                    done();

                    if (err) {
                      res.sendStatus(500);
                      return;
                    }

                    res.sendStatus(200);
                  });
  });
});

module.exports = router;
