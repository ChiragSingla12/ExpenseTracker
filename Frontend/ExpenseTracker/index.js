async function addNewExpense(event){
    try{
        event.preventDefault();
        const expenseDetails = {
            expenseamount: event.target.expenseamount.value,
            description: event.target.description.value,
            category: event.target.category.value
        }
        console.log(expenseDetails);
        const response = await axios.post('http://localhost:3000/expense/addexpense', expenseDetails)
        console.log(response);
        if(response.status === 201){
            addNewExpensetoUI(response.data.expense);
        }
    }catch(err){
        showError(err);
    }
}

window.addEventListener('DOMContentLoaded',  () => {
    axios.get('http://localhost:3000/expense/getexpenses').then(response => {
        console.log(response.data.data);
        response.data.data.forEach(expense => {
            addNewExpensetoUI(expense);
        })
    })
})

function addNewExpensetoUI(expense){
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
    // const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3000/expense/deleteexpense/${expenseid}`).then((response) => {

    if(response.status === 200){
            removeExpensefromUI(expenseid);
        } 
    }).catch((err => {
        showError(err);
    }))
}

function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

function removeExpensefromUI(expenseid){
    const expenseElemId = `${expenseid}`;
    document.getElementById(expenseElemId).remove();
}