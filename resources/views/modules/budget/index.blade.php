<x-app-layout>
    <div class="p-2">
        <div class="accounts_galery_container"></div>
    </div>
    <div class="p-2">
        <div>
            <x-card>
                <div class="flex justify-between mb-4">
                    <div class="flex gap-x-2">
                        <button class="btn btn-emerald btn-new-transaction">
                            <i class="fa-solid fa-money-bill-trend-up"></i>
                            New Transaction
                        </button>
                    </div>
                    <div class="flex gap-x-2">
                        <button class="btn btn-secondary">
                            <i class="fa-solid fa-repeat"></i>
                            Subscriptions
                        </button>
                        <button class="btn btn-secondary">
                            <i class="fa-solid fa-chart-pie"></i>
                            Budgets
                        </button>
                        <button class="btn btn-secondary">
                            <i class="fa-solid fa-vault"></i>
                            Accounts
                        </button>
                    </div>

                </div>
                <div class="flex gap-x-2 mb-4">
                    <div class="form-group basis-1/4">
                        <div class="prepend">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </div>
                        <input type="text" class="form-field transaction-keywords-search" placeholder="Search keywords">
                    </div>

                    <div class="form-group basis-1/4">
                        <div class="prepend">
                            <i class="fa-solid fa-calendar"></i>
                        </div>
                        <input type="text" class="form-field" placeholder="Filter by dates">
                    </div>
                    <div class="form-group basis-1/4">
                        <div class="prepend">
                            <i class="fa-solid fa-filter"></i>
                        </div>
                        <select class="form-field" style="width: content-box;">
                            <option value="-1">Filter by account</option>
                            <option value="1">Deposits</option>
                            <option value="2">Withdrawals</option>
                            <option value="3">Transfers</option>
                            <option value="4">Subscriptions</option>
                        </select>
                    </div>

                    <div class="form-group basis-1/4">
                        <div class="prepend">
                            <i class="fa-solid fa-filter"></i>
                        </div>
                        <select class="form-field" style="width: content-box;">
                            <option value="-1">Filter by transaction type</option>
                            <option value="1">Deposits</option>
                            <option value="2">Withdrawals</option>
                            <option value="3">Transfers</option>
                            <option value="4">Subscriptions</option>
                        </select>
                    </div>
                </div>
                <div class="transaction_dg_container"></div>
            </x-card>
        </div>
    </div>

    <x-slot name="scripts">
        <script>
            "use strict";

            let btnNewTransaction = document.querySelector('.btn-new-transaction');
            btnNewTransaction.onclick = async e => {
                budgettransaction_ds.insert();
            };

            let transactionKeywordsSearch = document.querySelector('.transaction-keywords-search');
            transactionKeywordsSearch.addEventListener('input', e => budgettransaction_ds.addFilters({ keywords: e.target.value }));

            let budgetaccounttype_ds = new Dataset({
               model: 'BudgetAccountType',
               records: {!! $accountTypeJson->toJson() !!}
            });

            let budget_ds = new Dataset({
                model: 'Budget',
                records: JSON.parse(`{!! $budgetJson->toJson() !!}`),
            });

            let budgetaccount_ds = new Dataset({
                model: 'BudgetAccount',
                records: JSON.parse(`{!! $accountJson->toJson() !!}`),
            });

            let budgettransaction_ds = new Dataset({
                model: 'BudgetTransaction',
                records: JSON.parse(`{!! $transactionJson->toJson() !!}`),
                onSave: _ => {
                    budgetaccount_ds.refreshNofetch();
                },
                relation: {
                    fromAccount: {
                        localKey: 'from_account_id',
                        foreignKey: 'id',
                        dataset: budgetaccount_ds,
                    },
                    toAccount: {
                        localKey: 'to_account_id',
                        foreignKey: 'id',
                        dataset: budgetaccount_ds,
                    },
                    budget: {
                        localKey: 'budget_id',
                        foreignKey: 'id',
                        dataset: budget_ds
                    }
                }
            });

            budgetaccount_ds.relation = {
                deposits: {
                    localKey: 'id',
                    foreignKey: 'to_account_id',
                    dataset: budgettransaction_ds,
                    hasMany: true,
                },
                withdrawals: {
                    localKey: 'id',
                    foreignKey: 'from_account_id',
                    dataset: budgettransaction_ds,
                    hasMany: true,
                },
                type: {
                    localKey: 'budget_account_type_id',
                    foreignKey: 'id',
                    dataset: budgetaccounttype_ds,
                }
            }

            let accountsPreview = new (class AccountPreview extends DatasetComponent {
                constructor() {
                    super(budgetaccount_ds, document.querySelector('.accounts_galery_container'));
                    this.initialize();
                }

                render() {
                    let accounts = this.dataset.getAllRecords();

                    this.containerElement.innerHTML = '';
                    this.containerElement.className += ' flex gap-x-2 items-center';

                    for (let account of accounts) {
                        let accountElement = document.createElement('div');
                        accountElement.className = 'account-card';

                        let depositSum = account.get('deposits').reduce((total, d) => total + d.get('amount', 'toFloat'), 0);
                        let withdrawSum = account.get('withdrawals').reduce((total, w) => total + w.get('amount', 'toFloat') , 0);
                        let accountTransactionAmount = depositSum - withdrawSum;

                        accountElement.innerHTML = `
                            <div class="font-semibold flex items-center justify-between">
                                <div>${account.get('icon') ? `<i class="${account.get('icon')} mr-1"></i>` : ''} ${account.get('title')}</div>
                                <div ${accountTransactionAmount >= 0 ? '' : 'class="bg-red-500 rounded px-2"'}>
                                    ${accountTransactionAmount}$
                                </div>
                            </div>
                        `;

                        this.containerElement.append(accountElement);
                    }
                }
            })();

            let transaction_dg = new DataGrid({
                dataset: budgettransaction_ds,
                containerElement: document.querySelector('.transaction_dg_container'),
                isPrepend: true,
                structure: {
                    theadClass: 'text-white bg-gradient-to-br from-emerald-500 to-emerald-700',
                    columns: [
                        {
                            title: 'Date',
                            field: 'created_at',
                            format: 'cuteDateTime',
                            editable: {},
                        }, {
                            title: 'Amount',
                            field: 'amount',
                            format: 'money',
                            editable: {},
                        }, {
                            title: 'Transaction',
                            field: 'title',
                            editable: {},
                        }, {
                            title: 'Budget',
                            field: 'budget_id',
                            display: (td, record) => {
                                td.innerHTML = `<i class="${record.get('budget.icon')} mr-1"></i> ${record.get('budget.title')}`;
                            },
                            editable: {},
                        }, {
                            title: 'Account',
                            field: 'from_account_id|to_account_id',
                            display: (td, record) => {
                                let [fromAccount, toAccount] = [record.get('fromAccount'), record.get('toAccount')];

                                if (fromAccount && toAccount) {
                                    td.innerHTML =
                                        `${fromAccount.get('title')} <i class="fa-solid fa-arrow-right mx-1"></i>${toAccount.get('title')}`;
                                    return;
                                }

                                if (fromAccount)
                                    td.innerHTML =
                                        `<i class="fa-solid fa-right-from-bracket mr-2 rotate-180"></i>${fromAccount.get('title')}`;
                                else if (toAccount)
                                    td.innerHTML =
                                        `<i class="fa-solid fa-right-to-bracket mr-2"></i>${toAccount.get('title')}`;
                            },
                            editable: {},
                        },
                        {
                            cellClass: 'content-width',
                            display: (td, record, dataset, datagrid) => {
                                let flexDiv = document.createElement('div');
                                flexDiv.className = 'flex gap-x-1';

                                let deleteBtn = document.createElement('button');
                                deleteBtn.className = 'btn btn-danger btn-delete';
                                deleteBtn.innerHTML += '<i class="fa-solid fa-trash-alt"></i>';

                                deleteBtn.onclick = async e => await dataset.delete(record.get('id'));

                                let editBtn = document.createElement('button');
                                editBtn.className = 'btn btn-primary btn-edit';
                                editBtn.innerHTML += '<i class="fa-solid fa-pencil-alt"></i>';

                                editBtn.onclick = e => {
                                    let newRow = datagrid.setRowEdit(record.get('id'));
                                    let editBtn = newRow.querySelector('.btn-edit');
                                    editBtn.classList.remove('btn-primary');
                                    editBtn.classList.add('btn-emerald');
                                    editBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
                                    editBtn.onclick = e => {
                                        dataset.save();
                                        datagrid.updateRow(record.get('id'));
                                    };

                                    let deleteBtn = newRow.querySelector('.btn-delete');
                                    deleteBtn.classList.remove('btn-danger');
                                    deleteBtn.classList.add('btn-secondary');
                                    deleteBtn.innerHTML = '<i class="fa-solid fa-ban"></i>';
                                    deleteBtn.onclick = e => {
                                        dataset.cancel();
                                        datagrid.updateRow(record.get('id'));
                                    };
                                };

                                flexDiv.append(editBtn, deleteBtn);
                                td.append(flexDiv);
                            }
                        }
                    ]
                }
            })
        </script>
    </x-slot>
</x-app-layout>
