async function addNewExpense(event) {
    try {
        event.preventDefault();
        const expenseDetails = {
            expenseamount: event.target.expenseamount.value,
            description: event.target.description.value,
            category: event.target.category.value
        }
        console.log(expenseDetails);
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/expense/addexpense', expenseDetails, { headers: { 'Authorization': token } })
        console.log('res', response);
        if (response.data) {
            console.log(response.data.expense)
            addNewExpensetoUI(response.data.expense);
        }
    } catch (err) {
        showError(err);
    }
}

function showPremiumuserMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden"
    document.getElementById('message').innerHTML = "You are a premium user "
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token)
    console.log(decodeToken);
    const ispremiumuser = decodeToken.ispremiumuser
    if (ispremiumuser) {
        showPremiumuserMessage();
        showLeaderboard();
    }
    axios.get('http://localhost:3000/expense/getexpenses', { headers: { 'Authorization': token } }).then(response => {
        console.log(response.data.data);
        response.data.data.forEach(expense => {
            addNewExpensetoUI(expense);
        })
    })
})


function addNewExpensetoUI(expense) {
    const parentElement = document.getElementById('listOfExpenses');
    const expenseElemId = `${expense.id}`;
    parentElement.innerHTML +=
        `<div id=${expenseElemId} class='expence'>
        <div class='data'>
          <p>  ${expense.expenseamount}</p>
           <p>  ${expense.category} </p> 
             <p> ${expense.description}</p>
          </div>
            <button class='del' onclick='deleteExpense(event, ${expense.id})'> Delete </button>
    </div>`;
}

function deleteExpense(e, expenseid) {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3000/expense/deleteexpense/${expenseid}`, { headers: { 'Authorization': token } }).then((response) => {

        if (response.status === 200) {
            removeExpensefromUI(expenseid);
        }
    }).catch((err => {
        showError(err);
    }))
}

function showError(err) {
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

function showLeaderboard() {
    const inputElement = document.createElement("input")
    inputElement.type = "button"
    inputElement.value = 'Show Leaderboard'
    inputElement.onclick = async () => {
        const token = localStorage.getItem('token')
        const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showLeaderBoard', { headers: { "Authorization": token } })
        console.log(userLeaderBoardArray)

        var leaderboardElem = document.getElementById('leaderboard')
        leaderboardElem.innerHTML += '<h1> Leader Board </<h1>'
        userLeaderBoardArray.data.forEach((userDetails) => {
            leaderboardElem.innerHTML += `<li>Name - ${userDetails.name} Total Expense - ${userDetails.totalExpenses || 0} </li>`
        })
    }
    document.getElementById("message").appendChild(inputElement);
}

function removeExpensefromUI(expenseid) {
    const expenseElemId = `${expenseid}`;
    document.getElementById(expenseElemId).remove();
}

document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: { "Authorization": token } });
    console.log(response);
    var options =
    {
        "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
        "order_id": response.data.order.id,// For one time payment
        // This handler function will handle the success payment
        "handler": async function (response) {
            const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { "Authorization": token } })

            console.log(res)
            alert('You are a Premium User Now')
            document.getElementById('rzp-button1').style.visibility = "hidden"
            document.getElementById('message').innerHTML = "You are a premium user "
            localStorage.setItem('token', res.data.token);
            showLeaderboard();
        },
    }
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response) {
        console.log(response)
        alert('Something went wrong')
    });
}