let navButton = document.getElementById('schedule_modale_button');
let scheduleContainer = document.getElementById('schedule_container');
let closeButton = document.getElementById('close_schedule_button');

function show(): void{
    scheduleContainer.style.left = '5px';
    scheduleContainer.style.opacity = '1';
}
function hide(): void{
    scheduleContainer.style.left = '-1000px';
    scheduleContainer.style.opacity = '0';
}

navButton.addEventListener('click', () => {
    show();
    navButton.focus();
});
closeButton.addEventListener('click', () => {
    hide();
});
