<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SMOG20</title>
    <link rel="stylesheet" href="style.css">

    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css">

</head>

<body>

    <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="https://bulma.io" id="sidebar_link_floors_scene">
                <h1 class="is-1">Smog 20</h1>
            </a>

            <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div class="navbar-menu" id="btnHome">
            <div class="navbar-start">
                <a class="navbar-item">
                    Home
                </a>

                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        Batiments
                    </a>
                    <div class="navbar-dropdown" id="link_batiment">

                    </div>
                </div>
            </div>


        </div>
    </nav>



    <canvas id="renderCanvas"></canvas>
    <script src="bundle.js"></script>




    <script defer src="https://use.fontawesome.com/releases/v5.14.0/js/all.js"></script>
</body>

</html>