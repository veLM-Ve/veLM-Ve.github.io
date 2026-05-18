<?php

namespace App\Encoder;

class CsvEncoder implements EncoderInterface
{
    public function supports($format)
    {
        return $format == "csv"
            || $format == "ssv"
            || $format == "tsv";
    }

    public function decode($input, $format)
    {
        if($format == "csv")
        {
            $s = ",";
        }
        elseif($format == "ssv")
        {
            $s = ";";
        }
        else
        {
            $s = "\t";
        }

        $lines = explode("\n", $input);

        $headers = explode($s, trim($lines[0]));

        $data = array();

        for($i = 1; $i < count($lines); $i++)
        {
            $values = explode($s, trim($lines[$i]));

            $row = array();

            for($j = 0; $j < count($headers); $j++)
            {
                $row[$headers[$j]] = $values[$j];
            }

            $data[] = $row;
        }

        return $data;
    }

    public function encode($data, $format)
    {
        if($format == "csv")
        {
            $s = ",";
        }
        elseif($format == "ssv")
        {
            $s = ";";
        }
        else
        {
            $s = "\t";
        }

        $text = "";

        $headers = array_keys($data[0]);

        $text .= implode($s, $headers);

        $text .= "\n";

        foreach($data as $row)
        {
            $text .= implode($s, $row);

            $text .= "\n";
        }

        return $text;
    }
}