<?php
// create_typesense_collection.php

require __DIR__.'/vendor/autoload.php';

use Typesense\Client;

$client = new Client([
    'api_key' => 'xyz', // المفتاح حقك (عادة 'xyz' لو ما غيرته)
    'nodes' => [
        [
            'host' => 'localhost',
            'port' => '8108',
            'protocol' => 'http',
        ],
    ],
    'connection_timeout_seconds' => 2,
]);

$collectionSchema = [
    'name' => 'products',
    'fields' => [
        ['name' => 'id', 'type' => 'string'],
        ['name' => 'product_name', 'type' => 'string'],
        ['name' => 'short_description', 'type' => 'string'],
        ['name' => 'price', 'type' => 'float'],
        ['name' => 'category_name', 'type' => 'string'],
    ],
    'default_sorting_field' => 'price'
];

try {
    $result = $client->collections->create($collectionSchema);
    echo "✅ Collection created successfully!\n";
    print_r($result);
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}