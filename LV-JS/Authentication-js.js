const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(e){

    e.preventDefault();

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    if(email === 'example@gmail.com' && password === '123456'){

        localStorage.setItem("isLoggedIn", "true");

        window.location.href = "Asset.html";
    } else {
        alert('Please enter correct Details');
    }
});