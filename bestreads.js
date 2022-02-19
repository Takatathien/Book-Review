/**
 * Created by Takatathien on 11/17/2016.
 * CSE 154 AG, Homework 6(Bestreads)
 * TA: Casey Williams-Smith
 *
 * This is the JavaScript of bestreads.html
 * It will display a library of book and will
 * display the general information of the book
 * that the user clicked.
 */

(function() {
    'use strict';

    window.onload = function() {
        requestXML('books'); // call method to make Ajax request.
    };

    // Helper function to make Ajax request for multiple function
    // depend on the user input parameters.
    function requestXML(mode, title) {
        // the url of the php webservice that the code will use through out.
        var url = 'https://webster.cs.washington.edu/students/trinht2/hw6/bestreads.php';
        var request = new XMLHttpRequest();
        if (mode == 'books') { // if the user wants an entire library of book.
            hideDisplay();
            request.onload = loadBooks;
            request.open('GET', url + '?mode=books', true);
        } else { // if the user wants the general information of a book.
            showDisplay();
            document.getElementById('cover').src = 'https://webster.cs.washington.edu/students/trinht2/hw6/books/' + title + '/cover.jpg';
            if (mode == 'info') {
                request.onload = loadInfo;
                request.open('GET', url + '?mode=info&title=' + title, true);
            } else if (mode == 'description') {
                request.onload = loadDescription;
                request.open('GET', url + '?mode=description&title=' + title, true);
            } else { //mode == 'reviews'
                request.onload = loadReviews;
                request.open('GET', url + '?mode=reviews&title=' + title, true);
            }
        }
        request.send();
    }

    // this function would display an entire library of books available.
    function loadBooks() {
        var response = this.responseXML;
        var titles = response.querySelectorAll('title');
        var folders = response.querySelectorAll('folder');
        var allBooks = document.getElementById('allbooks');
        allBooks.innerHTML = '';

        for (var i = 0; i < folders.length; i++) {
            var section = document.createElement('div');
            section.setAttribute('id', folders[i].textContent);
            section.onclick = helperRequestBook;

            var cover = document.createElement('img');
            cover.src = 'https://webster.cs.washington.edu/students/trinht2/hw6/books/' + folders[i].textContent + '/cover.jpg';
            cover.alt = 'cover';

            var title = document.createElement('p');
            title.innerHTML = titles[i].textContent;

            section.appendChild(cover);
            section.appendChild(title);
            allBooks.appendChild(section);
        }
        document.getElementById('back').onclick = helperRequestBooks;
    }

    // This function inject the information of the book into the HTML.
    function loadInfo() {
        var response = JSON.parse(this.responseText);
        document.getElementById('title').innerHTML = response.title;
        document.getElementById('author').innerHTML = response.author;
        document.getElementById('stars').innerHTML = response.stars;
    }

    // This function inject the description of the book into the HTML.
    function loadDescription() {
        document.getElementById('description').innerHTML = this.responseText;
    }

    // This function inject the reviews of the book into the HTML.
    function loadReviews() {
        document.getElementById('reviews').innerHTML = this.responseText;
    }

    // Helper method that allowed the HOME button to access back into requestXML with parameter 'book'.
    function helperRequestBooks() {
        requestXML('books');
    }

    // Helper method that allowed each book in the library to access back into requestXML with
    // their own unique parameter.
    function helperRequestBook() {
        requestXML('info', this.id);
        requestXML('description', this.id);
        requestXML('reviews', this.id);
    }

    // Hide all information of individual book when the library is displayed.
    function hideDisplay() {
        document.getElementById('title').style.display = 'none';
        document.getElementById('author').style.display = 'none';
        document.getElementById('stars').style.display = 'none';
        document.getElementById('description').style.display = 'none';
        document.getElementById('reviews').style.display = 'none';
        document.getElementById('cover').style.display = 'none';
    }

    // Clean the library and display the information of a book that the user chosen.
    function showDisplay() {
        document.getElementById('allbooks').innerHTML = '';
        document.getElementById('title').removeAttribute('style');
        document.getElementById('author').removeAttribute('style');
        document.getElementById('stars').removeAttribute('style');
        document.getElementById('description').removeAttribute('style');
        document.getElementById('reviews').removeAttribute('style');
        document.getElementById('cover').removeAttribute('style');
    }
})();