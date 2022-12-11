<x-app-layout>
    <div class="p-2">
        <div class="flex gap-x-2">
            <div class="flex-grow">
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
                                <i class="fa-solid fa-cogs"></i>
                                Manage Subscriptions
                            </button>
                            <button class="btn btn-secondary">
                                <i class="fa-solid fa-cogs"></i>
                                Manage Accounts
                            </button>
                        </div>

                    </div>

                    <div class="flex gap-x-2 mb-4">
                        <div class="form-group basis-1/4">
                            <div class="prepend">
                                <i class="fa-solid fa-magnifying-glass"></i>
                            </div>
                            <input type="text" class="form-field" placeholder="Search keywords">
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
            <div class="w-80">
                <x-card>
                </x-card>
            </div>
        </div>
    </div>

    <x-slot name="scripts">
        <script>
            "use strict";

            let btnNewTransaction = document.querySelector('.btn-new-transaction');
            btnNewTransaction.onclick = async e => budgettransaction_ds.insert();

            let budgetaccount_ds = new Dataset({
                model: 'BudgetAccount',
                records: JSON.parse(`{!! $accountJson->toJson() !!}`),
            });

            let budgettransaction_ds = new Dataset({
                model: 'BudgetTransaction',
                records: JSON.parse(`{!! $transactionJson->toJson() !!}`),
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
                    }
                }
            });

            let transaction_dg = new DataGrid({
                dataset: budgettransaction_ds,
                containerElement: document.querySelector('.transaction_dg_container'),
                isPrepend: true,
                structure: {
                    theadClass: 'text-white bg-gradient-to-br from-emerald-500 to-emerald-700',
                    columns: [
                        {
                            cellClass: 'content-width',
                            title: 'Date',
                            field: 'created_at',
                            format: 'cuteDateTime'
                        },
                        {
                            title: 'Title',
                            field: 'title'
                        },
                        {
                            title: 'Amount',
                            field: 'amount',
                            format: 'money'
                        },
                        {
                            title: 'Account',
                            field: 'fromAccount.title'
                        },
                        {
                            title: 'Type',
                            display: (td, record, dataset) => {
                                let fromAccount = record.get('fromAccount');
                                let toAccount = record.get('toAccount');

                                if (fromAccount && toAccount) {
                                    td.innerHTML = 'Transfer';
                                    return;
                                }

                                if (fromAccount) {
                                    td.innerHTML = 'Withdraw';
                                    return;
                                }

                                td.innerHTML = 'Deposit';
                            }
                        },
                        {
                            cellClass: 'content-width',
                            display: (td, record, dataset) => {
                                let flexDiv = document.createElement('div');
                                flexDiv.className = 'flex gap-x-1';

                                let deleteBtn = document.createElement('button');
                                deleteBtn.className = 'btn btn-danger';
                                deleteBtn.innerHTML += '<i class="fa-solid fa-trash-alt"></i>';

                                deleteBtn.onclick = async e => await dataset.delete(record.get('id'));

                                let editBtn = document.createElement('button');
                                editBtn.className = 'btn btn-primary';
                                editBtn.innerHTML += '<i class="fa-solid fa-pencil-alt"></i>';

                                editBtn.onclick = async e => {
                                    if (editBtn.classList.contains('btn-primary')) {
                                        // Set to save btn.
                                        transaction_dg.setRowEditable();
                                        editBtn.classList.remove('btn-primary');
                                        editBtn.classList.add('btn-emerald');
                                        editBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                                        return;
                                    }

                                    // Save + Set to edit btn.
                                    dataset.save();
                                    editBtn.classList.remove('btn-emerald');
                                    editBtn.classList.add('btn-primary');
                                    editBtn.innerHTML = '<i class="fa-solid fa-pencil-alt"></i>';
                                }

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
