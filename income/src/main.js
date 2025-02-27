const ids = {
  "blocks": ["budget", "expences", "balance"],
  "category": "category",
  "type": "inout",
  "open" : "openTranz",
  "amount": "amount",
  "history": "history"
}
const classes = {
  "block": "block",
  "select": "select",
  "input": "input",
  "transactions": "transactions"
}
const values = {
  "in": "income",
  "out": "expense"
}
const types = {
  "num": "number"
}

class App{
  constructor(langPath1, containerId1) {
    this.containerId = containerId1
    this._langPath = langPath1 
  }

  function fetchLang(path) {
    return fetch(path).then(res => res.json())
  }

  function getLang() {
    if (this._langPath) {
      this.langCache = fetch(this._langPath)
    }
    return this.langCache
  }

  const lang = await fetchLang()

  function createBlock(num) {
    const block = document.createElement('div')
    const sum = document.createElement('span')
    block.innerHTML = lang.blocks[num]
    sum.id = ids.blocks[num]
    block.appendChild(sum)
    block.textContent += "₽"
    block.classList.add('block')
    return block
  }

  function createHeader() {
    const header = document.createElement('header')
    const block1 = createBlock(0);
    const block2 = createBlock(1);
    const block3 =createBlock(2);
    header.appendChild(block1)
    header.appendChild(block2)
    header.appendChild(block3)
    wrapper.appendChild(header)
  }
  
  function createHistory() {
    const tranz = document.createElement('div')
    const hh = document.createElement('h3')
    hh.innerHTML = lang.transactions
    const hist = document.createElement('ul')
    hist.id = ids.history
    const plus = document.createElement('button')
    plus.id = ids.open
    plus.innerHTML = lang.button
    tranz.appendChild(hh)
    tranz.appendChild(hist)
    tranz.appendChild(plus)
    tranz.classList.add(classes.transactions)
    wrapper.appendChild(tranz)
  }

  function createTransaction() {
    const tr = document.createElement('div')
    const tx = document.createElement('h3')
    tx.innerHTML = lang.addtr
    tr.appendChild(tx)
    const sel = document.createElement('select')
    sel.id = ids.category
    for (let i = 0; i < 3; i++) {
      const opt = document.createElement('option')
      opt.innerHTML = lang.options[i]
      sel.appendChild(opt)
    }
    tr.appendChild(sel)
    const typ = document.createElement('select')
    for (let i = 0; i < 2; i++) {
      const opt = document.createElement('option')
      opt.innerHTML = lang.types[i]
      opt.value = values[i]
      typ.appendChild(opt)
    }
    tr.appendChild(typ)
    const inp = document.createElement('input')
    inp.type = types.num
    inp.id = ids.amount
    inp.placeholder = lang.sum
    tr.appendChild(inp)
    const ad = document.createElement('button')
    ad.innerHTML = lang.add
    ad.onclick = addTransaction()
    tr.appendChild(ad)
    wrapper.appendChild(tr)
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
