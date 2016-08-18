$(document).ready(function () {
  getBooks();

  // add a book
  $('#book-submit').on('click', postBook);

  //we reference book list because it is already on the DOM; it then listens for the button click;
  $('#book-list').on('click', '.update', putBook);
  $('#book-list').on('click', '.delete', delBook);

  //new listener for the filter button;
  $('#book-selector').on('click', '.submit', filterBooks);
});
/**
 * Retrieve books from server and append to DOM
 */
function getBooks() {
  $.ajax({
    type: 'GET',
    url: '/books',
    success: function (books) {
      console.log('GET /books returns:', books);
      books.forEach(function (book) {
        var $el = $('<div></div>');

        var bookProperties = ['title', 'author', 'published', 'genre'];

        // nested loop
        bookProperties.forEach(function (property) {
          var inputType = 'text';
          if (property == 'published') {
            // var inputType = 'date';
            // book[property] = new Date(book[property]);
            book[property] = new Date(book[property]);
            var month = book[property].getUTCMonth(book[property]) + 1; //months from 1-12
            var day = book[property].getUTCDate(book[property]);
            var year = book[property].getUTCFullYear(book[property]);

            //catcatcanate into one string month/day/year and set to book.published as text

            book[property] = month + '/' + day + '/' + year;
          }

          console.log('properties', book[property]);

          var $input = $('<input type="' + inputType + '" id="' +
                        property + '"name="' + property + '"/>');

          $input.val(book[property]);
          $el.append($input);
        });

        //we're giving it a prop that we can use to reference it later - since we already have a unique identifier - we can use book ID - we're not appending the actual book ID from our database, so we have to use data to assign it to the boook to be used later;
        $el.data('bookId', book.id);
        $el.append('<button class="update">Update</button>');
        $el.append('<button class="delete">Delete</button>');

        $('#book-list').append($el);
      });
    },

    error: function (response) {
      console.log('GET /books fail. No books could be retrieved!');
    },
  });
}
/**
 * Add a new book to the database and refresh the DOM
 */
function postBook() {
  event.preventDefault();

  var book = {};

  $.each($('#book-form').serializeArray(), function (i, field) {
    book[field.name] = field.value;
  });

  console.log('book: ', book);

  $.ajax({
    type: 'POST',
    url: '/books',
    data: book,
    success: function () {
      console.log('POST /books works!');
      $('#book-list').empty();
      getBooks();
    },

    error: function (response) {
      console.log('POST /books does not work...');
    },
  });

  $("#book-form").find("input[type=text]").val("");
  $("#book-form").find("input[type=date]").val("");
  $("#title").focus();
}

function putBook() {
  var book = {};

  //move all the stuff in to a var to make it easier
  //seralizeArray = take elements off a form/element an turn it into an array
  //seralize arry is taking the name and taking the value of the input;
  var inputs = $(this).parent().children().serializeArray();

  //when we click on the button (this button), parent will be the div
  //(information that is in the same div as the button); data lives on the parent (div)
  //there is no form, just a bunch on input fields: how to get off using seralize array:
  //select all the childre - ALL OF THE INPUT FIELDS
  $.each(inputs, function (i, field) {
    book[field.name] = field.value;
  });

  console.log('book we are putting', book);

  //this is the button, parent is the div, data is the prop we assigned earlier;
  var bookId = $(this).parent().data('bookId');

  //new request type: its a PUT; url is different by convention; appending and ID to it;
  $.ajax({
    type: 'PUT',

    //append the book id to the url;
    url: '/books/' + bookId,

    //send the book object;
    data: book,
    success: function () {
      $('#book-list').empty();
      getBooks();
    },

    error: function () {
      console.log('Error PUT /books/' + bookId);
    },
  });
}

function delBook() {
  var bookId = $(this).parent().data('bookId');

  $.ajax({
    type: 'DELETE',
    url: '/books/' + bookId,
    success: function () {
      console.log('DELETE success');
      $('#book-list').empty();
      getBooks();
    },

    error: function () {
      console.log('DELETE failed');
    },
  });

}

function filterBooks() {
  event.preventDefault();

  //define new var to capture the options value;
  var genreId = $('#genres').val();
  // console.log(genreId);
  //will reappend the DOM with the new filter;
  $.ajax({
    type: 'GET',
    url: '/books/' + genreId,
    success: function (books) {
      $('#book-list').empty();
      console.log('GET /books/ returns:', genreId);
      books.forEach(function (book) {
        var $el = $('<div></div>');

        var bookProperties = ['title', 'author', 'published', 'genre'];

        // nested loop
        bookProperties.forEach(function (property) {
          var inputType = 'text';
          if (property == 'published') {
            // var inputType = 'date';
            // book[property] = new Date(book[property]);
            book[property] = new Date(book[property]);
            var month = book[property].getUTCMonth(book[property]) + 1; //months from 1-12
            var day = book[property].getUTCDate(book[property]);
            var year = book[property].getUTCFullYear(book[property]);

            //catcatcanate into one string month/day/year and set to book.published as text

            book[property] = month + '/' + day + '/' + year;
          }

          console.log('properties', book[property]);

          var $input = $('<input type="' + inputType + '" id="' +
                        property + '"name="' + property + '"/>');

          $input.val(book[property]);
          $el.append($input);
        });

        //we're giving it a prop that we can use to reference it later - since we already have a unique identifier - we can use book ID - we're not appending the actual book ID from our database, so we have to use data to assign it to the boook to be used later;
        $el.data('bookId', book.id);
        $el.append('<button class="update">Update</button>');
        $el.append('<button class="delete">Delete</button>');

        $('#book-list').append($el);
      });
    },

    error: function (response) {
      console.log('GET /books fail. No books could be filtered!');
    },
  });
}
