async function incomeApp(containerId, params) {
    const IDS = {
        "blocks": ["budget", "expences", "balance"],
        "txTable": "txTable",
        "sumInput": "sumInput",
        "addTxPopup": "addTxPopup"

    }
    const CLASSES = {
        "app": "app",
        "block": "block",
        "select": "select",
        "input": "input",
        "transactions": "transactions",
        "popupOpen": "open"
    }
    const LOCAL_STORAGE_KEYS = {
        "transactions": "transactions"
    }

    class App {
        langCache = null

        async getLang() {
            if (!this.langCache) {
                this.langCache = await fetch(params.langPath).then(res => res.json())
            }
            return this.langCache
        }

        async _createBlock(num) {
            const lang = await this.getLang()
            const block = document.createElement('div')
            const sum = document.createElement('span')
            block.innerHTML = lang.blocks[num]
            sum.id = IDS.blocks[num]
            sum.textContent = '0 ₽'
            block.appendChild(sum)
            block.classList.add('block')
            return block
        }

        updateStats() {
            const txData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.transactions)) || [];
            const budget = txData.filter(tx => tx.type === 'доход').reduce((acc, tx) => acc + tx.sum, 0);
            const expences = txData.filter(tx => tx.type === 'расход').reduce((acc, tx) => acc + tx.sum, 0);
            const balance = budget - expences;
            console.log(budget, expences, balance)
            document.getElementById(IDS.blocks[0]).textContent = budget || 0;
            document.getElementById(IDS.blocks[1]).textContent = expences || 0;
            document.getElementById(IDS.blocks[2]).textContent = balance || 0;
        }

        async _createHeader() {
            const header = document.createElement('header')
            const block1 = await this._createBlock(0);
            const block2 = await this._createBlock(1);
            const block3 = await this._createBlock(2);
            header.appendChild(block1)
            header.appendChild(block2)
            header.appendChild(block3)
            return header
        }

        async _createTable() {
            const lang = await this.getLang()
            const table = document.createElement('table');
            table.id = IDS.txTable;
            const headerRow = document.createElement('tr');
            const headers = lang.tableColsHeaders;

            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });
            table.appendChild(headerRow);
            const txData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.transactions)) || [];
            txData.forEach(tx => {
                console.log(tx)
                const row = this._createTableRow(tx);
                table.appendChild(row);
            });
            return table
        }

        async _createTableTitle() {
            const lang = await this.getLang()
            const title = document.createElement('h2')
            title.textContent = lang.tableTitle
            return title
        }

        _createTableRow({category, sum, date}) {
            const row = document.createElement('tr');
            const categoryEntry = document.createElement('td');
            const sumEntry = document.createElement('td');
            const dateEntry = document.createElement('td');
            categoryEntry.innerText = category;
            sumEntry.innerText = sum;
            dateEntry.innerText = date;
            row.appendChild(categoryEntry);
            row.appendChild(sumEntry);
            row.appendChild(dateEntry);
            return row
        }

        _updateTable(newTx) {
            const table = document.getElementById(IDS.txTable);
            const newRow = this._createTableRow(newTx);
            table.appendChild(newRow);
        }

        async _createAddButton() {
            const lang = await this.getLang()
            const button = document.createElement('button')
            button.textContent = lang.addButtonText
            return button
        }

        _createSelect(id, options) {
            const select = document.createElement('select');
            select.id = id;

            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.toLowerCase();
                optionElement.textContent = option;
                select.appendChild(optionElement);
            });

            return select;
        }

        async _pushToLocalStorage(key, data) {
            const lsData = JSON.parse(localStorage.getItem(key)) || [];
            lsData.push(data);
            localStorage.setItem(key, JSON.stringify(lsData));
        }

        async _createPopup() {
            const lang = await this.getLang()
            const popup = document.createElement('div');

            const categorySelect = this._createSelect('category', lang.categories);
            const typeSelect = this._createSelect('type', lang.types);

            const sumInput = document.createElement('input');
            sumInput.type = 'number';
            sumInput.id = IDS.sumInput;
            sumInput.placeholder = 'Enter amount';

            const addButton = document.createElement('button');
            addButton.textContent = lang.addTxText;
            addButton.addEventListener('click', () => {
                const category = categorySelect.value;
                const type = typeSelect.value;
                const sum = sumInput.value;

                if (category && type && sum) {
                    const entry = {
                        category,
                        type: type.toLowerCase(),
                        sum: parseFloat(sum),
                        date: new Date().toLocaleDateString()
                    };
                    this._pushToLocalStorage(LOCAL_STORAGE_KEYS.transactions, entry);
                    this._updateTable(entry);
                    this._updateStats();
                } else {
                    alert(lang.fillInAllFieldsAlert);
                }
                sumInput.value = '';
            });

            const closeButton = document.createElement('button');
            closeButton.innerText = lang.closeButtonText;
            closeButton.addEventListener('click', () => {
                this._closePopup(popup);
            });

            popup.appendChild(closeButton);
            popup.appendChild(categorySelect);
            popup.appendChild(typeSelect);
            popup.appendChild(sumInput);
            popup.appendChild(addButton);

            return popup
        }

        async _closePopup(popup) {
            popup.classList.remove(CLASSES.popupOpen);
        }

        async _openPopup() {
            let popup = document.getElementById(IDS.addTxPopup);
            if (!popup) {
                popup = await this._createPopup();
                document.body.appendChild(popup);
            }
            popup.classList.add(CLASSES.popupOpen);
        }

        async _createTransactionsHistoryBlock() {
            const txHistoryBlock = document.createElement('div')
            const tableHeaderBlock = document.createElement('div')
            const title = await this._createTableTitle()
            const table = await this._createTable()
            const addButton = await this._createAddButton()
            addButton.addEventListener('click', () => {
                this._openPopup();
            })

            tableHeaderBlock.appendChild(title)
            tableHeaderBlock.appendChild(addButton)
            txHistoryBlock.appendChild(tableHeaderBlock)
            txHistoryBlock.appendChild(table)
            return txHistoryBlock
        }

        createWrapper() {
            const wrapper = document.createElement('div')
            wrapper.classList.add(CLASSES.app)
            return wrapper
        }

        async init() {
            const wrapper = this.createWrapper()
            const nodePromises = [this._createHeader(), this._createTransactionsHistoryBlock()]
            for await (const node of nodePromises) {
                wrapper.appendChild(node)
            }
            return wrapper
        }
    }

    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found.`);
        return;
    }

    const app = new App()
    const appElements = await app.init();
    container.appendChild(appElements);
    app.updateStats()
}
