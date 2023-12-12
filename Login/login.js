function login(e) {
    e.preventDefault();
    console.log(e.target.name);

    const loginDetails = {
        email: e.target.email.value,
        password: e.target.password.value

    }
    console.log(loginDetails);
    axios.post('http://localhost:3000/user/login', loginDetails)
        .then(response => {
            if (response.status == 200) {
                alert(response.data.message);
            } else {
                throw new error(response.data.message);
            }
        }).catch(err => {
            console.log(JSON.stringify(err))
            document.body.innerhtml += `<div style="color:red;">${err.message} <div>`
        })
}