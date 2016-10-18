# Node to Postgres Lecture
Books by Genre
Seeing all of our books listed is pretty cool. But if we had a lot of books, this would quickly become difficult to use. Let's clean this up and allow the user some control over what they see.

Genre Selector
Add a drop down menu using an HTML select element to the listing part of the page that allows the user to select a genre of book to display. For now just hard-code the genres into your HTML view. In the future, we'll want to create this list dynamically, but all in good time :)

## Takeaways

* You can connect to your Postgres database using the `pg` module
* You need to know the URI for the database (see `connectionString` in server/routes/books.js)
* Use `pg.connect(...)` to connect to the database
* Use `client.query(...)` to query the database with SQL
* When creating queries with client-submitted data, always use the prepared statement pattern (see router.post in server/routes/books.js)
