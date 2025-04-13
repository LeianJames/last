
<?php
// ilagay ung file sa htdocs folder ng xampp
// Enable CORS

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Connect to SQLite database
$db = new SQLite3('C:\Users\hermie\OneDrive\Desktop\Library System\database.db');

// Get category from URL parameter (optional)
$category = isset($_GET['category']) ? $_GET['category'] : null;

// Prepare SQL query
if ($category) {
    $stmt = $db->prepare('SELECT * FROM books WHERE category = :category');
    $stmt->bindValue(':category', $category, SQLITE3_TEXT);
} else {
    $stmt = $db->prepare('SELECT * FROM books');
}

// Execute query
$result = $stmt->execute();

// Fetch results
$books = [];
while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
    $books[] = $row;
}

// Return as JSON
echo json_encode($books);
?>