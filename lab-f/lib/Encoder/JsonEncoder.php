<?php

namespace App\Encoder;

class JsonEncoder implements EncoderInterface
{
    public function supports($format)
    {
        if($format == "json")
        {
            return true;
        }

        return false;
    }

    public function decode($input, $format)
    {
        return json_decode($input, true);
    }

    public function encode($data, $format)
    {
        return json_encode($data, JSON_PRETTY_PRINT);
    }
}