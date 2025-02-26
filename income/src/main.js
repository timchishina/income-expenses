const ids = {
  "budget": "Budget",
  "expences": "Расходы",
  "balance": "Баланс",
  "tranzaction": "Транзакции",
  "rent": "Аренда",
  "food": "Еда",
  "clothes": "Одежда",
  "income": "Доход",
  "expence": "Расход",
  "sum": "Сумма"
}
const classes = {
  "block": "block",
  "select": "selectsome",
  "input": "inputsome"
}

class App{
  constructor(langPath1, containerId1) {
    this.containerId = containerId1
    this._langPath = langPath1 
  }

  function fetchLang(path) {
    return fetch(path).then(res => res.json())
  }

  const lang = await fetchLang()

  function createBlock(num) {
    const block = document.createElement('div')
    switch (num) {
      case 1:
        block.innerHTML = lang.block1
        break
      case 2:
        block.innerHTML = lang.block2
        break
      case 3:
        block1.innerHTML = lang.block3
    }
    block.classList.add('block')
    return block
  }

  function createHeader() {
    const header = document.createElement('header')
    const block1 = createBlock(1);
    const block2 = createBlock(2);
    const block3 =createBlock(3);
    header.appendChild(block1)
    header.appendChild(block2)
    header.appendChild(block3)
    wrapper.appendChild(header)
  }

  function getLang() {
    if (this._langPath) {
      this.langCache = fetch(this._langPath)
    }
    return this.langCache
  }
}



async function appExampleApp(containerId, params) {
  // container where to mount our app, placed in index.html
  const container = document.getElementById(containerId);
  if (!container) {
      console.error(`Container with id "${containerId}" not found.`);
      return;
  }

  //app wrapper
  const wrapper = document.createElement('div');
  wrapper.classList.add('app');
  container.appendChild(wrapper);

 // elem creating
  const header = document.createElement('header')
  const block1 = document.createElement('div')
  block1.innerHTML = lang.block1
  block1.classList.add('block')
  header.appendChild(block1)
  wrapper.appendChild(header)

  // localstorage
  localStorage.setItem('hui', 0)
  
  const title = document.createElement('h1');
  title.textContent = params.title || 'Default App Title';
  wrapper.appendChild(title);
  
  const dataContainer = document.createElement('div');
  dataContainer.classList.add('data-container');
  wrapper.appendChild(dataContainer);
  
  function loadData(jsonPath) {
      fetch(jsonPath)
          .then(response => response.json())
          .then(data => {
              localStorage.setItem('appData', JSON.stringify(data));
              renderData(data);
          })
          .catch(error => console.error('Error loading data:', error));
  }
  
  function renderData(data) {
      dataContainer.innerHTML = '';
      data.forEach(item => {
          const itemElement = document.createElement('p');
          itemElement.textContent = item.name;
          dataContainer.appendChild(itemElement);
      });
  }
  
  if (params.cssPath) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = params.cssPath;
      document.head.appendChild(link);
  }
  
  if (params.jsonPath) {
      loadData(params.jsonPath);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const budgetEl = document.getElementById("budget");
  const expensesEl = document.getElementById("expenses");
  const balanceEl = document.getElementById("balance");
  const addTransactionBtn = document.getElementById("addTransactionBtn");

  let budget = 0;
  let expenses = 0;
  let balance = 0;

  function addTransaction() {
    const category = document.getElementById("category").value;
    const type = document.getElementById("type").value;
    const amount = parseInt(document.getElementById("amount").value, 10);

    if (!amount || amount <= 0) return;

    if (type === "income") {
      budget += amount;
      balance += amount;
    } else if (type === "expense") {
      expenses += amount;
      balance -= amount;
    }

    budgetEl.textContent = budget;
    expensesEl.textContent = expenses;
    balanceEl.textContent = balance;

    const history = document.getElementById("history");
    const entry = document.createElement("li");
    entry.textContent = `${type === "income" ? "Доход" : "Расход"} - ${category}: ${amount} ₽`;
    history.appendChild(entry);
  }

  addTransactionBtn.addEventListener("click", addTransaction);
});
