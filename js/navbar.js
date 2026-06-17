// Navbar injection script
document.addEventListener('DOMContentLoaded', function() {
    var loc = window.location.pathname;
    const root_path_length = "/photodex/".length;
    var dir = loc.substring(root_path_length);
    var depth = dir.split("/").length - 1;
    var path_to_root = "../".repeat(depth);
    const navbarHTML = `
    <nav class="navbar">
        <div class="container">
            <div class="logo">
                <h2 class="title">Arthur Nowakowski</h2>
                <h4 class="title">Photodex</h4>
            </div>
            <ul class="nav-links" id="navMenu">
                <li><a href="${path_to_root}index.html">Accueil</a></li>
                <li><a href="${path_to_root}birds.html">Oiseaux</a></li>
                <li><a href="${path_to_root}mammals.html">Mammifères</a></li>
                <li><a href="${path_to_root}contact.html">Contact</a></li>
            </ul>
        </div>
    </nav>`;
    
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
});


// Close menu when a link is clicked
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const navMenu = document.getElementById('navMenu');
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
                if (hamburger) {
                    hamburger.classList.remove('active');
                }
            });
        });
    }, 100);
});
