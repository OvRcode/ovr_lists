<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit59190840481b2b1a0370a626caa274c2
{
    public static $files = array (
        'decc78cc4436b1292c6c0d151b19445c' => __DIR__ . '/..' . '/phpseclib/phpseclib/phpseclib/bootstrap.php',
        'aa75ea0761a2f40c1f3b32ad314f86c4' => __DIR__ . '/..' . '/phpseclib/mcrypt_compat/lib/mcrypt.php',
    );

    public static $prefixLengthsPsr4 = array (
        'p' => 
        array (
            'phpseclib3\\' => 11,
        ),
        'P' => 
        array (
            'ParagonIE\\ConstantTime\\' => 23,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'phpseclib3\\' => 
        array (
            0 => __DIR__ . '/..' . '/phpseclib/phpseclib/phpseclib',
        ),
        'ParagonIE\\ConstantTime\\' => 
        array (
            0 => __DIR__ . '/..' . '/paragonie/constant_time_encoding/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
        'SimpleEmailService' => __DIR__ . '/..' . '/daniel-zahariev/php-aws-ses/src/SimpleEmailService.php',
        'SimpleEmailServiceMessage' => __DIR__ . '/..' . '/daniel-zahariev/php-aws-ses/src/SimpleEmailServiceMessage.php',
        'SimpleEmailServiceRequest' => __DIR__ . '/..' . '/daniel-zahariev/php-aws-ses/src/SimpleEmailServiceRequest.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit59190840481b2b1a0370a626caa274c2::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit59190840481b2b1a0370a626caa274c2::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit59190840481b2b1a0370a626caa274c2::$classMap;

        }, null, ClassLoader::class);
    }
}
