<?php
header('Content-Type: application/json');
require 'db.php';

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'read') {
        $sql = "SELECT * FROM clothes ORDER BY id DESC";
        $result = $conn->query($sql);
        $clothes = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $clothes[] = $row;
            }
        }
        echo json_encode($clothes);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if ($action === 'create') {
        $stmt = $conn->prepare("INSERT INTO clothes (name, price, description, image_url, stock) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sdssi", $data['name'], $data['price'], $data['description'], $data['image_url'], $data['stock']);
        if($stmt->execute()) {
            echo json_encode(['status' => 'success', 'id' => $conn->insert_id]);
        } else {
            echo json_encode(['status' => 'error', 'message' => $stmt->error]);
        }
        $stmt->close();
    } elseif ($action === 'update') {
        $stmt = $conn->prepare("UPDATE clothes SET name=?, price=?, description=?, image_url=?, stock=? WHERE id=?");
        $stmt->bind_param("sdssii", $data['name'], $data['price'], $data['description'], $data['image_url'], $data['stock'], $data['id']);
        if($stmt->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => $stmt->error]);
        }
        $stmt->close();
    } elseif ($action === 'delete') {
        $stmt = $conn->prepare("DELETE FROM clothes WHERE id=?");
        $stmt->bind_param("i", $data['id']);
        if($stmt->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => $stmt->error]);
        }
        $stmt->close();
    }
}
$conn->close();
?>
