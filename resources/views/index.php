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

</head>

<body>
    <!-- Nav -->
    <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="http://smog20.test" id="sidebar_link_floors_scene">
                <h1 class="is-1">Smog 20</h1>
            </a>

            <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div class="navbar-menu">
            <div class="navbar-start">

                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        Batiments
                    </a>
                    <div class="navbar-dropdown" id="link_batiment">

                    </div>
                </div>
                <a class="navbar-item" id="schedule_modale_button" ">
                    Horaire
                </a>
            </div>


        </div>
    </nav>

    <!-- Schedule -->
    <div id="schedule_container" class="schedule_container">
        <p>
            <button id="close_schedule_button" class="button is-small">
                <span class="icon is-small">
                    <i class="fas fa-times"></i>
                </span>
            </button>
        </p>
        <div class="table-container">
            <table class="table is-bordered is-striped is-narrow is-hoverable">
                <thead>
                    <tr>
                        <th>Lundi</th>
                        <th>Mardi</th>
                        <th>Mercredi</th>
                        <th>Jeudi</th>
                        <th>Vendredi</th>
                    </tr>
                </thead>
                <tbody id="schedule_grid">

                </tbody>
            </table>
        </div>
    </div>

    <!-- Canvas -->
    <canvas id="renderCanvas" style="z-index: 1;position:absolute; margin-top:0px; "></canvas>

    <!-- Scripts -->
    <script src="bundle.js"></script>
</body>
</html>
