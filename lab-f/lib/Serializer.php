<?php

namespace App;

class Serializer
{
    private $encoders;

    public function __construct($encoders)
    {
        $this->encoders = $encoders;
    }

    public function convert($input, $inputFormat, $outputFormat)
    {
        if ($inputFormat == $outputFormat) {
            return $input;
        }

        $data = array();

        foreach($this->encoders as $encoder)
        {
            if($encoder->supports($inputFormat))
            {
                $data = $encoder->decode($input, $inputFormat);
            }
        }

        foreach($this->encoders as $encoder)
        {
            if($encoder->supports($outputFormat))
            {
                return $encoder->encode($data, $outputFormat);
            }
        }

        return "";
    }
}