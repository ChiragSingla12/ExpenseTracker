async function userDetail(event) {
    try {
        event.preventDefault();
        const name = event.target.username.value;
        const email = event.target.emailId.value;
        const password = event.target.password.value;
        
        //localStorage.setItem('name', name);
        //localStorage.setItem('email', email);
        //localStorage.setItem('phonenumber', phonenumber);


        const signUpDetails = { name, email, password }
        const response = axios.post("http://localhost:3000/user/Signup", signUpDetails)
        console.log(response);
        if (response.status === 201) {
            window.location.href = "../login/login.html"// change the page on successful login 
        } else {
            throw new Error('failed to login');
        }
        // .then((response) => {
        //     console.log(response);
        //     // showUserOnScreen(response.data.newUserDetail);
        // })

    }
    catch (err){
        document.body.innerHTML = document.body.innerHTML + `<div style="color: red";>${err} </div>`;
        // console.log(err);
    }
}