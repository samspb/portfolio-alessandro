const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')


//Armazena e atualiza os dados de transações na API do LocalStorage(navegador)
const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
     transactions = transactions.filter(transaction => 
        transaction.id !== ID)
        updateLocalStorage()
    init()
}

/*
Cria elementos HTML, que é adicionado à lista de transações no DOM. 
Remove a transação quando o botão de excluir é clicado.
*/
const addTransactionIntoDOM = ({amount, name, id}) => {
    const operator = amount < 0 ? '-' : '+'
    const CSSClass = amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(amount)
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = `
     ${name}
     <span>${operator} R$ ${amountWithoutOperator}</span>
     <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
    `
    transactionsUl.append(li)
}


//Calcula os valores totais de despesas, receitas e o saldo 
const getExpense = transactionsAmounts => Math.abs(transactionsAmounts
    .filter(value => value < 0)
    .reduce((acumulator, value) => acumulator + value, 0))
    .toFixed(2)

    const getIncome = transactionsAmounts => transactionsAmounts
        .filter(value => value > 0)
        .reduce((acumulator, value) => acumulator + value, 0)
        .toFixed(2)

    const getTotal = transactionsAmounts => transactionsAmounts
        .reduce((acumulator, transaction) => acumulator + transaction, 0)
        .toFixed(2)

//Atualizar os valores exibidos na página relacionados ao balanço financeiro
const updateBalanceValues = () => {
    const transactionsAmounts = transactions.map(({amount}) => amount)
    const total = getTotal(transactionsAmounts)
    const income = getIncome(transactionsAmounts)
    const expense = getExpense(transactionsAmounts)
        
    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent =  `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}
 
/*
Inicializa a aplicação.Limpa a lista de transações do DOM
Atualiza os valores do saldo, receitas e despesas 
*/
const init = () => {
    transactionsUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
}

init()

//Atualiza os dados armazenados na localStorage(API do navegador)
const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}
//Gerar um ID aleatório para as transações
const generateID = () => Math.round(Math.random() * 1000)

//Adiciona uma nova transação ao array de transações
const addToTransactionArray = (transactionName, transactionsAmount) => {
    transactions.push({
        id: generateID(),
        name: transactionName,
        amount: Number(transactionsAmount)
    })
}

//Limpa os valores dos campos de entrada de dados na página
const cleanInputs = () => {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

/*
Obtém o nome e o valor da transação dos campos do formulário;
Verifica se algum dos campos está vazio;
Se algum campo estiver vazio, exibe um alerta solicitando ao usuário que preencha ambos os campos;
*/
const handleformSubmit = event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionsAmount = inputTransactionAmount.value.trim()
    const isSomeInputEmpty = transactionName === '' || transactionsAmount === ''

    if (isSomeInputEmpty) {
        alert('Por favor, preencha tanto o nome quanto o valor da transação')
        return
    }

    addToTransactionArray(transactionName, transactionsAmount)
    init()
    updateLocalStorage()
   cleanInputs()    
}

form.addEventListener('submit', handleformSubmit)