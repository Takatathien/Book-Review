<?php
/**
 * Created by PhpStorm.
 * User: Takatathien
 * Date: 11/17/2016
 * Time: 9:22 PM
 * CSE 154 AG, Homework 6(Bestreads)
 * TA: Casey Williams-Smith
 *
 * This page is the PHP webservice of bestreads.html
 */

$mode = $_GET['mode'];

if ($mode == "books") { // if the query is mode "books".
    $xmldoc = new DOMDocument();
    $books_tag = $xmldoc->createElement("books");
    $xmldoc->appendChild($books_tag);

    foreach (glob("books/*") as $folder) {
        $info = file("$folder/info.txt", FILE_IGNORE_NEW_LINES);
        $folder = explode("books/", $folder);
        list($title) = $info;

        $book_tag = $xmldoc->createElement("book");
        $title_tag = $xmldoc->createElement("title");
        $title_tag->nodeValue = $title;
        $folder_tag = $xmldoc->createElement("folder");
        $folder_tag->nodeValue = $folder[1];
        $book_tag->appendChild($title_tag);
        $book_tag->appendChild($folder_tag);
        $books_tag->appendChild($book_tag);
    }

    header("Content-type: text/xml");
    print $xmldoc->saveXML();
} else { // if the query is not mode "books"
    $book = $_GET["title"]; // find the query title in this case.
    if ($mode == "info") { // if the query is mode "info"
        $info = file("books/$book/info.txt", FILE_IGNORE_NEW_LINES);
        list($title, $author, $stars) = $info;
        $data = array(
            "title" => $title,
            "author" => $author,
            "stars" => $stars,
        );

        header("Content-type: application/json");
        print json_encode($data);
    } else if ($mode == "description") { // if the query is mode "description"
        $descriptions = file("books/$book/description.txt", FILE_IGNORE_NEW_LINES);
        header("Content-type: text/plain");
        foreach ($descriptions as $description) {
            echo ($description);
        }
    } else { // if the query is mode "reviews"
        foreach (glob("books/$book/review*.txt") as $file) {
            $review = file($file, FILE_IGNORE_NEW_LINES);
            list($name, $rating, $comment) = $review;
            ?>
            <h3><?=$name?> <span><?=$rating?></span></h3>
            <p><?=$comment?></p>
            <?php
        }
    }
}
