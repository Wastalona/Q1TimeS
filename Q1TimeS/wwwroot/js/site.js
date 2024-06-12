document.getElementById("year").innerHTML = new Date().getFullYear();

function goUp() {
    /* Scrolls the page all the way to the top */
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getTokenFromCookie() {
    /* Function for obtaining a token from a cookie */
    const tokenRow = document.cookie.split('; ').find(row => row.startsWith('token='));
    return tokenRow ? tokenRow.split('=')[1] : null;
}

function generateUniqueId() {
    // A simple function for generating small unique numbers
    return Math.floor(Math.random() * 1000000); 
}