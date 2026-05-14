let authBtn= document.getElementById("authBtn");

let loginTab = document.getElementById('logBtn');
let registerTab = document.getElementById('regBtn');
let loginForm = document.getElementById('login-form');
let registerForm = document.getElementById('register-form');

function openModal() {
    document.getElementById('auth-modal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('auth-modal').style.display = 'none';

}

function showLogin() {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
}

function showRegister() {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');

    registerForm.classList.add('active');
    loginForm.classList.remove('active');
}

document.getElementById('authBtn').addEventListener('click', openModal);
document.getElementById('closeAuth').addEventListener('click', closeModal);
loginTab.addEventListener('click', showLogin);
registerTab.addEventListener('click', showRegister);






let scrollBtn = document.getElementById("scrollToTop");

window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
}

scrollBtn.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});