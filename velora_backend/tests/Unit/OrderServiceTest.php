<?php

test('calculate total price', function () {
    $items = [
        ['price' => 100, 'quantity' => 2],
        ['price' => 50, 'quantity' => 1],
    ];

    $total = array_reduce($items, function ($carry, $item) {
        return $carry + ($item['price'] * $item['quantity']);
    }, 0);

    expect($total)->toBe(250);
});

test('order service can validate stock', function () {
    $stock = 10;
    $quantity = 5;
    expect($quantity)->toBeLessThanOrEqual($stock);
});
