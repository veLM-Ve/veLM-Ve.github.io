<?php

namespace App\Encoder;

class YamlEncoder implements EncoderInterface
{
    public function supports($format)
    {
        if($format == "yaml")
        {
            return true;
        }

        return false;
    }

    public function decode($input, $format)
    {
        return yaml_parse($input);
    }

    public function encode($data, $format)
    {
        return yaml_emit($data);
    }
}