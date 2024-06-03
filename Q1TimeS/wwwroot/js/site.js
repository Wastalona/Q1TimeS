document.getElementById("year").innerHTML = new Date().getFullYear();

function goUp() {
    /* Scrolls the page all the way to the top */
    window.scrollTo({ top: 0, behavior: 'smooth' });
}