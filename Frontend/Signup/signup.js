async function userDetail(event) {
    const notif = document.getElementsByClassName('notif')[0];

    try {
        event.preventDefault();
        const name = event.target.username.value;
        const email = event.target.emailId.value;
        const password = event.target.password.value;

        //localStorage.setItem('name', name);
        //localStorage.setItem('email', email);
        //localStorage.setItem('phonenumber', phonenumber);

        const signUpDetails = { name, email, password }
        const response = await axios.post("http://localhost:3000/user/Signup", signUpDetails)
        console.log(response);

        if (response.status === 201) {
            notif.classList.toggle('notif2');
            setTimeout(() => {
                notif.classList.toggle('notif2');
            window.location.href = "../login/login.html"// change the page on successful login 
            }, 2000);
            notif.innerHTML = `${response.data.message}`;
        } 
    } catch (err) {
        console.log(err);
        notif.classList.toggle('notif3');
        setTimeout(() => {
            notif.classList.toggle('notif3');
        }, 2000);
        notif.innerHTML = `${err.response.data.message}`;
        // document.body.innerHTML = document.body.innerHTML + `<div style="color: red";>${err} </div>`;
        // console.log(err);
    }
}
