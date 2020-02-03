<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <style>
        * {
            box-sizing: border-box;
        }

        html {
            font: 400 16px/1.6em sans-serif;
            background: #fff;
        }

        a {
            text-decoration: none;
            color: #4A80DD;
        }

        .container {
            width: 95%;
            max-width: 600px;
            margin: 0 auto;
        }

        .title {
            font-size: 16px;
        }

        .list {
            width: 100%;
            max-width: 600px;
            padding: 0;
            margin: 0 0 25px 0;
            list-style: none;
        }

        .list li:nth-child(even) {
            background: #F9F9F9;
        }

        .list a {
            position: relative;
            display: block;
            padding: 8px;
            padding-left: 48px;
            border-bottom: solid 1px #ddd;
            font-size: 14px;
            line-height: 1.6em;
        }

        .list a:hover,
        .list a:focus {
            background: #E5F6FF;
        }

        .list svg {
            position: absolute;
            top: 50%;
            left: 16px;
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
        }

        @media screen and (min-width: 40em) {
            .title {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">
            Index of
            <?= str_replace('/index.php', '/', $_SERVER['SCRIPT_NAME']) ?>
        </h1>
        <ul class="list">
            <?php
                $path   = './';
                $files  = scandir( $path );

                foreach ($files as $value) {
                    if (
                        $value == '.DS_Store' ||
                        $value == '.' ||
                        $value == '.git' ||
                        $value == '.gitignore' ||
                        $value == '.editorconfig' ||
                        $value == 'package.json' ||
                        $value == 'bower.json' ||
                        $value == 'dev' ||
                        $value == 'gulpfile.js' ||
                        $value == '..' ||
                        $value == '.sass-cache' ||
                        $value == 'bower_components' ||
                        $value == 'node_modules' ||
                        $value == 'assets' ||
                        $value == '_partials' ||
                        $value == 'package-lock.json' ||
                        $value == 'home.html' ||
                        $value == 'index.php' ) continue;

                    if ( is_dir($value) ) {
                ?>
                <li>
                    <a href="<?= $value ?>">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M20 6h-8l-2-2h-6c-1.105 0-1.99 0.895-1.99 2l-0.010 12c0 1.105 0.895 2 2 2h16c1.105 0 2-0.895 2-2v-10c0-1.105-0.895-2-2-2zM20 18h-16v-10h16v10z" fill="#444444"></path>
                        </svg>
                        <?= $value ?>/
                    </a>
                </li>
                <?php } else { ?>
                <li>
                    <a href="<?= $value ?>"><?= $value ?></a>
                </li>
                <?php } ?>
            <?php
                }
            ?>
        </ul>
    </div>
</body>
</html>
