const ul = document.getElementById('listOfExpenses')
const pages = document.getElementById('pages');
const select = document.getElementById('per-page');

select.oninput = () => {
    localStorage.setItem("number", select.value);
    console.log(select.value, localStorage.getItem('number'));
}

async function addNewExpense(event) {
    try {
        event.preventDefault();
        const expenseDetails = {
            expenseamount: event.target.expenseamount.value,
            description: event.target.description.value,
            category: event.target.category.value
        }
        const token = localStorage.getItem('token');
        const response = await axios.post('/expense/add-expense', expenseDetails, { headers: { 'Authorization': token } })
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




async function sendGetRequest(page) {
    const token = localStorage.getItem('token');
    try {
        let number = 5;
        if (localStorage.getItem('number')) {
            number = localStorage.getItem('number');
        }
        const { data } = await axios.get(`/expense/get-expenses?page=${page}&number=${number}`, { headers: { "Authorization": token } });
        const { expenses, pageData } = data;

        ul.innerHTML = '';
        expenses.forEach(expense => {
            addNewExpensetoUI(expense);
        });
        pages.innerHTML = '';

        if (+pageData.previousPage > 0) {
            console.log(pageData.previousPage, 'type-', typeof (pageData.previousPage), 'typeof', typeof (+pageData.previousPage));

            if (+pageData.previousPage > 1) {
                pages.innerHTML = `<button id='page1' onclick='sendGetRequest(1)'>1</button>`
            }
            // pages.innerHTML = '';
            pages.innerHTML += `<button id='page${pageData.previousPage}' onclick='sendGetRequest(${pageData.previousPage})'>${pageData.previousPage}</button>`;
        }
        // expenses.remove();
        pages.innerHTML += `<button id='page${pageData.currentPage}' onclick='sendGetRequest(${pageData.currentPage})'>${pageData.currentPage}</button>`;
        document.getElementById(`page${page}`).className = 'active';
        if (pageData.hasNextPage) {
            // expenses.remove();
            pages.innerHTML += `<button id='page${pageData.nextPage}' onclick='sendGetRequest(${pageData.nextPage})'>${pageData.nextPage}</button>`
        }
    }
    catch (err) {
        console.log(err);
    }
}


window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token)
    const ispremiumuser = decodeToken.ispremiumuser;

    if (ispremiumuser) {
        showPremiumuserMessage();
        showLeaderboard();
    }
    const page = 1;
    sendGetRequest(page);
    if (localStorage.getItem('number')) {
        select.value = localStorage.getItem('number');
    }

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
          <div>
            <button class='del' onclick='deleteExpense(event, ${expense.id})'> Delete </button>
          </div>
    </div>`;
}

function deleteExpense(e, expenseid) {
    const token = localStorage.getItem('token');
    axios.delete(`/expense/delete-expense/${expenseid}`, { headers: { 'Authorization': token } }).then((response) => {

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
        const userLeaderBoardArray = await axios.get('/premium/showLeaderBoard', { headers: { "Authorization": token } })

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
    const response = await axios.get('/purchase/premium-membership', { headers: { "Authorization": token } });
    var options =
    {
        "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
        "order_id": response.data.order.id,// For one time payment
        // This handler function will handle the success payment
        "handler": async function (response) {
            const res = await axios.post('/purchase/updatetransactionstatus', {
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

function download() {
    const token = localStorage.getItem('token');
    axios.get('/expense/download', { headers: { "Authorization": token } })
        .then((response) => {
            if (response.status === 200) {
                //the bcakend is essentially sending a download link
                //  which if we open in browser, the file would download
                var a = document.createElement("a");
                a.href = response.data.fileURL;
                a.download = 'myexpense.csv';
                a.click();
            } else {
                throw new Error(response.data.message)
            }

        })
        .catch((err) => {
            showError(err)
        });
}