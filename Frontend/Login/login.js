// const { response } = require("express");

const login = async (e) => {
    e.preventDefault();
    console.log(e.target.name);

    const loginDetails = {
        email: e.target.email.value,
        password: e.target.password.value
    }
    const notif = document.getElementsByClassName('notif')[0];
    console.log(loginDetails);

    try {
        const res = await axios.post('http://localhost:3000/user/login', loginDetails)
        console.log('res', res);

        if(res.data){
            // notif.classList.toggle('notif2');
            setTimeout(() => {
                notif.classList.toggle('notif2');
                window.location.href = "../ExpenseTracker/index.html"// change the page on successful login /
            }, 1500);
            notif.innerHTML = `${res.data.message}`;
            localStorage.setItem('token', res.data.token);
            // alert(res.data.message)
        }
    } catch (err) {
        notif.classList.toggle('notif3');
        setTimeout(() => {
            notif.classList.toggle('notif3');
        }, 1500);
        notif.innerHTML = `${err.response.data.message}`;
        console.log('error',err)
        // alert(err.response.data.message);
    }
}