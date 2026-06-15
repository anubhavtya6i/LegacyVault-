const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(e){

    e.preventDefault();

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    if(email && password){

        localStorage.setItem("isLoggedIn", "true");

        window.location.href = "Asset.html";
    }
});