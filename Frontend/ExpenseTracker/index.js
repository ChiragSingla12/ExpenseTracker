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
        if (response.status === 201) {
            addNewExpensetoUI(response.data.expense);
        }
    } catch (err) {
        showError(err);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

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
        `<li id=${expenseElemId}>
            ${expense.expenseamount} - ${expense.category} - ${expense.description}
            <button onclick='deleteExpense(event, ${expense.id})'> Delete Expense </button>
            <p>hi there</p>
    </li>`;
}

function deleteExpense(e, expenseid) {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3000/expense/deleteexpense/${expenseid}`,{ headers: { 'Authorization': token } }).then((response) => {

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

function removeExpensefromUI(expenseid) {
    const expenseElemId = `${expenseid}`;
    document.getElementById(expenseElemId).remove();
}

document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "order_id": response.data.order.id,// For one time payment
     // This handler function will handle the success payment
     "handler": async function (response) {
        const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} })
        
        console.log(res)
         alert('You are a Premium User Now')
         document.getElementById('rzp-button1').style.visibility = "hidden"
         document.getElementById('message').innerHTML = "You are a premium user "
         localStorage.setItem('token', res.data.token)
        //  showLeaderboard()
     },
  }
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
    console.log(response)
    alert('Something went wrong')
 });
}