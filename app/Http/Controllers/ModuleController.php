<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\BudgetAccount;
use App\Models\BudgetAccountType;
use App\Models\BudgetTransaction;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    public function training() {
        return view('modules.training.index');
    }

    public function budget() {
        $accountTypeJson = BudgetAccountType::list();
        $budgetJson = Budget::list();
        $accountJson = BudgetAccount::list();
        $transactionJson = BudgetTransaction::list();

        return view('modules.budget.index', compact(
            'accountJson',
            'transactionJson',
            'budgetJson',
            'accountTypeJson'
        ));
    }

    public function documentation() {
        return view('modules.documentation.index');
    }

    public function modules() {
        return view('modules.modules.index');
    }
}
