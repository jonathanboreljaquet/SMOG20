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
                <a class="navbar-item" id="btnHome">
                    Home
                </a>

                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        Batiments
                    </a>
                    <div class="navbar-dropdown" id="link_batiment">

                    </div>
                </div>
                <a class="navbar-item" onclick="openModal()">
                    open modal
                </a>
            </div>


        </div>
    </nav>



    <canvas id="renderCanvas" style="z-index: 1;position:absolute; margin-top:0px; "></canvas>
    <script src="bundle.js"></script>




    <script defer src="https://use.fontawesome.com/releases/v5.14.0/js/all.js"></script>
</body>


<div class="modal" id="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Modal title</p>
            <button onclick="closeModal()" class="delete" aria-label="close" onclick="closeModal"></button>
        </header>
        <section class="modal-card-body">
            <div>
                <ul id="Schedule_ul">

                </ul>

            </div>
        </section>
        <footer class="modal-card-foot">
            <button class="button is-success">Save changes</button>
            <button class="button">Cancel</button>
        </footer>
    </div>
</div>
<script>
    function closeModal() {
        document.getElementById("modal").classList.remove("is-active");
        modal.classList.toggle('modal-close');
    }

    function openModal() {
        document.getElementById("modal").classList.remove("modal-close");
        modal.classList.toggle('is-active');
    }
</script>


</html>