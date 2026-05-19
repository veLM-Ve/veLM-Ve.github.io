<?php

$formats=array(
    "csv"=>"CSV",
    "ssv"=>"SSV",
    "tsv"=>"TSV",
    "json"=>"JSON",
    "yaml"=>"YAML"
);

?>

<!DOCTYPE html>
<html lang="pl">

<head>

    <meta charset="UTF-8">
    <title>Konwerter danych</title>
    <link rel="stylesheet" href="style.css">

</head>

<body>

<h1>Konwerter CSV / SSV / TSV / JSON / YAML</h1>

<?php
if($error!="")
{
    echo "<div class='error'>$error</div>";
}
?>

<form method="post">

    <p>Dane wejściowe:</p>
    <textarea name="input"><?= htmlspecialchars($input, ENT_QUOTES, "UTF-8") ?></textarea>
    <br><br>

    <div class="row">

        <div>

            <p>Format wejściowy:</p>

            <select name="input_format">

                <?php foreach($formats as $value=>$label){ ?>

                    <option value="<?= $value ?>" <?= $inputFormat==$value ? "selected" : "" ?>><?= $label ?></option>

                <?php } ?>

            </select>

        </div>

        <div>

            <p>Format wyjściowy:</p>

            <select name="output_format">

                <?php foreach($formats as $value=>$label){ ?>

                    <option value="<?= $value ?>" <?= $outputFormat==$value ? "selected" : "" ?>><?= $label ?></option>

                <?php } ?>

            </select>

        </div>

    </div>

    <br>

    <button type="submit">Konwertuj</button>

</form>

<h2>Output</h2>

<pre><?= htmlspecialchars($output, ENT_QUOTES, "UTF-8") ?></pre>

</body>

</html>