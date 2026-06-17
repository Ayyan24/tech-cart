// Login and signup

document.addEventListener("DOMContentLoaded", function () {
    var loginForm = document.getElementById("login-form");
    var signupForm = document.getElementById("signup-form");
    var path = window.location.pathname;
    var isRoot = path.indexOf("/buyer/") === -1 && path.indexOf("/vendor/") === -1 && path.indexOf("/admin/") === -1;
    var prefix = isRoot ? "" : "../";

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            var loginId = document.getElementById("email").value.trim().toLowerCase();
            var password = document.getElementById("password").value;
            var users = window.TechVerseDB.getUsers();
            var user = users.find(function (u) {
                var userEmail = (u.email || "").toLowerCase();
                var userName = (u.username || "").toLowerCase();
                return userEmail === loginId || userName === loginId;
            });

            if (!user) {
                Swal.fire({ icon: "error", title: "Account Not Found", text: "No account matches this email or admin ID.", confirmButtonColor: "#132238" });
                return;
            }
            if (user.password !== password) {
                Swal.fire({ icon: "error", title: "Wrong Password", confirmButtonColor: "#132238" });
                return;
            }

            window.TechVerseDB.setCurrentUser(user);
            Swal.fire({ icon: "success", title: "Welcome, " + user.name + "!", showConfirmButton: false, timer: 1500 })
                .then(function () { redirectByRole(user.role, prefix); });
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();
            var name = document.getElementById("name").value.trim();
            var email = document.getElementById("email").value.trim().toLowerCase();
            var role = document.getElementById("role").value;
            var password = document.getElementById("password").value;
            var confirm = document.getElementById("confirm-password").value;

            if (password !== confirm) {
                Swal.fire({ icon: "error", title: "Passwords do not match", confirmButtonColor: "#132238" });
                return;
            }

            var users = window.TechVerseDB.getUsers();
            if (users.some(function (u) { return u.email.toLowerCase() === email; })) {
                Swal.fire({ icon: "error", title: "Email already registered", confirmButtonColor: "#132238" });
                return;
            }

            var newUser = {
                id: "u_" + Date.now(),
                username: "",
                name: name,
                email: email,
                password: password,
                role: role,
                address: "",
                city: "",
                phone: ""
            };
            if (role === "vendor") newUser.shopName = name + "'s Shop";

            users.push(newUser);
            window.TechVerseDB.saveUsers(users);
            window.TechVerseDB.setCurrentUser(newUser);

            Swal.fire({ icon: "success", title: "Account Created!", showConfirmButton: false, timer: 1500 })
                .then(function () { redirectByRole(role, prefix); });
        });
    }
});

function redirectByRole(role, prefix) {
    if (role === "admin") window.location.href = prefix + "admin/dashboard.html";
    else if (role === "vendor") window.location.href = prefix + "vendor/dashboard.html";
    else window.location.href = prefix + "index.html";
}
