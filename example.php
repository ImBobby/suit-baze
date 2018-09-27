<!doctype html>
<html class="no-js" lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">

    <meta name="description" content="Baze is a front-end starter template">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="theme-color" content="#FFFFFF">

    <meta property="og:url" content="">
    <meta property="og:title" content="">
    <meta property="og:site_name" content="">
    <meta property="og:description" content="">
    <meta property="og:image" content="">
    <meta property="og:type" content="website">
    <meta property="fb:app_id" content="">

    <meta name="twitter:card" content="">
    <meta name="twitter:site" content="">
    <meta name="twitter:description" content="">
    <meta name="twitter:title" content="">
    <meta name="twitter:image" content="">

    <link rel="apple-touch-icon" href="assets/img/apple-icon.png">
    <link rel="icon" type="image/png" href="assets/img/favicon.png">

    <title>Suit Baze - front-end starter kit</title>

    <link rel="stylesheet" href="assets/css/main.css">
</head>
<body>
    <!--[if lte IE 9]>
        <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

    <?php $h = [1,2,3,4,5,6] ?>
    <?php $color = ['primary', 'black', 'light-grey', 'white'] ?>

    <div class="sticky-footer-container">
        <div class="sticky-footer-container-item">
            <header>
                <h1 class="sr-only">Suit Baze</h1>
                <a href="#" class="site-logo">Logo</a>
            </header>
        </div>
        <div class="sticky-footer-container-item --pushed">
            <main>
                <div class="container">
                    <div class="mb-24">
                        <h2>Heading</h2>
                        <?php for ($i=0; $i < sizeof($h); $i++) { ?>
                            <h<?=$h[$i]?>>Heading <?=$h[$i]?></h<?=$h[$i]?>>
                        <?php } ?>
                    </div>
                    <hr>
                    <div class="mb-24">
                        <h2>Heading Style</h2>
                        <?php for ($i=0; $i < sizeof($h); $i++) { ?>
                        <p class="h<?=$h[$i]?>">Text size adjust h<?=$h[$i]?></p>
                        <?php } ?>
                    </div>
                    <hr>
                    <div class="mb-24">
                        <h2>Text color</h2>
                        <?php for ($c=0; $c < sizeof($color); $c++) { ?>
                            <p class="text-<?=$color[$c]?>">Text class color = ".text-<?=$color[$c]?>"</p>
                        <?php } ?>
                    </div>
                    <hr>
                    <div class="mb-24">
                        <h2>Buttons</h2>
                        <?php for ($c=0; $c < sizeof($color); $c++) { ?>
                            <p>
                                <button class="btn--<?=$color[$c]?>">Button Color</button>
                            </p>
                        <?php } ?>
                    </div>
                </div>
            </main>
        </div>
        <div class="sticky-footer-container-item">
            <footer>Footer</footer>
        </div>
    </div>

    <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=default,promise,fetch" defer></script>
    <script src="assets/js/vendor/modernizr.min.js" defer></script>
    <script src="assets/js/vendor/jquery.min.js" defer></script>
    <script src="assets/js/vendor/object-fit-images.min.js" defer></script>
    <script src="assets/js/vendor/slick.min.js" defer></script>
    <script src="assets/js/vendor/sprintf.min.js" defer></script>
    <script src="assets/js/vendor/baze.validate.min.js" defer></script>
    <script src="assets/js/main.min.js" defer></script>
</body>
</html>
