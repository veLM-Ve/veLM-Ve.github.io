<?php

require "autoload.php";

use App\Serializer;
use App\Encoder\JsonEncoder;
use App\Encoder\YamlEncoder;
use App\Encoder\CsvEncoder;

$json = new JsonEncoder();

$yaml = new YamlEncoder();

$csv = new CsvEncoder();

$serializer = new Serializer(array(
    $json,
    $yaml,
    $csv
));

$input = "";

$output = "";

$inputFormat = "csv";

$outputFormat = "json";

$error = "";

if(isset($_COOKIE["input"]))
{
    $input = $_COOKIE["input"];
}

if(isset($_COOKIE["input_format"]))
{
    $inputFormat = $_COOKIE["input_format"];
}

if(isset($_COOKIE["output_format"]))
{
    $outputFormat = $_COOKIE["output_format"];
}

if(isset($_POST["input"]))
{
    $input = $_POST["input"];
}

if(isset($_POST["input_format"]))
{
    $inputFormat = $_POST["input_format"];
}

if(isset($_POST["output_format"]))
{
    $outputFormat = $_POST["output_format"];
}

if($_SERVER["REQUEST_METHOD"] == "POST")
{
    setcookie("input", $input, time() + 60 * 60 * 24 * 365 * 10);

    setcookie("input_format", $inputFormat, time() + 60 * 60 * 24 * 365 * 10);

    setcookie("output_format", $outputFormat, time() + 60 * 60 * 24 * 365 * 10);

    $output = $serializer->convert(
        $input,
        $inputFormat,
        $outputFormat
    );
}

include "templates/layout.php";

?>