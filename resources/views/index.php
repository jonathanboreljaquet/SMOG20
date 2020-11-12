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
                <a class="navbar-item" onclick="openModal()">
                    open modal
                </a>
            </div>


        </div>
    </nav>



    <canvas id="renderCanvas" style="z-index: 1;position:absolute; margin-top:0px; "></canvas>
    <script src="bundle.js"></script>

    <div class="modal" id="modal">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Modal title</p>
                <button onclick="closeModal()" class="delete" aria-label="close" onclick="closeModal"></button>
            </header>
            <section class="modal-card-body">
                <div id="Schedule_ul">
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success">Save changes</button>
                <button class="button" onclick="closeModal()">Cancel</button>
            </footer>
        </div>
    </div>
    <div>

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
</body>
<style>
    table.darkTable {
        font-family: "Arial Black", Gadget, sans-serif;
        border: 2px solid #000000;
        background-color: #4A4A4A;
        width: 100%;
        height: 200px;
        text-align: center;
        border-collapse: collapse;
    }

    table.darkTable td,
    table.darkTable th {
        border: 1px solid #4A4A4A;
        padding: 3px 2px;
    }

    table.darkTable tbody td {
        font-size: 13px;
        color: #E6E6E6;
    }

    table.darkTable tr:nth-child(even) {
        background: #888888;
    }

    table.darkTable thead {
        background: #000000;
        border-bottom: 3px solid #000000;
    }

    table.darkTable thead th {
        font-size: 15px;
        font-weight: bold;
        color: #E6E6E6;
        text-align: center;
        border-left: 2px solid #4A4A4A;
    }

    table.darkTable thead th:first-child {
        border-left: none;
    }

    table.darkTable tfoot {
        font-size: 12px;
        font-weight: bold;
        color: #E6E6E6;
        background: #000000;
        background: -moz-linear-gradient(top, #404040 0%, #191919 66%, #000000 100%);
        background: -webkit-linear-gradient(top, #404040 0%, #191919 66%, #000000 100%);
        background: linear-gradient(to bottom, #404040 0%, #191919 66%, #000000 100%);
        border-top: 1px solid #4A4A4A;
    }

    table.darkTable tfoot td {
        font-size: 12px;
    }
</style>

</html>