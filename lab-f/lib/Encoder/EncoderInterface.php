<?php

namespace App\Encoder;

interface EncoderInterface
{
    public function supports($format);

    public function decode($input, $format);

    public function encode($data, $format);
}