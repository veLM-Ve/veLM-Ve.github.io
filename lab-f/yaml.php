<?php // I:\ptw\lab-f\yaml.php

$data = [
    'name' => 'Dawid Zajkowski',
    'index' => '57735',
    'date' => date(DATE_ATOM),
];

$yaml = yaml_emit($data);

echo $yaml;