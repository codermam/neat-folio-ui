import { useState } from 'react';
import { Wallet, Download } from 'lucide-react';
import { useBudget } from '@/hooks/useBudget';
import { SummaryCards } from '@/components/SummaryCards';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { CategoryChart } from '@/components/CategoryChart';
import { FiltersBar } from '@/components/FiltersBar';
import { RecurringList } from '@/components/RecurringList';
import { BudgetGoals } from '@/components/BudgetGoals';
import { Button } from '@/components/ui/button';
import { generatePDFReport } from '@/lib/pdfGenerator';

const Index = () => {
  const { 
    transactions, 
    filteredTransactions,
    filters,
    budgetGoals,
    addTransaction, 
    deleteTransaction, 
    getMonthlyTotals, 
    getCategorySummaries,
    addBudgetGoal,
    updateBudgetGoal,
    deleteBudgetGoal,
    setFilters,
    clearFilters,
  } = useBudget();

  const monthlyTotals = getMonthlyTotals();
  const categorySummaries = getCategorySummaries();

  const currentMonth = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const handleDownloadReport = () => {
    generatePDFReport({
      monthlyTotals,
      categorySummaries,
      transactions,
      currentMonth
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero border-b border-border/30 sticky top-0 z-10 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 animate-fade-in-up">
              <div className="p-3 rounded-xl gradient-glass shadow-glow animate-float">
                <Wallet className="h-7 w-7 text-primary-foreground drop-shadow-sm" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary-foreground drop-shadow-sm">
                  Budget Tracker
                </h1>
                <p className="text-primary-foreground/80 font-medium">{currentMonth}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-6 text-sm text-primary-foreground/90 animate-fade-in-up stagger-1">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse-subtle"></div>
                  <span className="font-medium">{transactions.length} transactions</span>
                </div>
                <span className="hidden md:block font-medium">💰 Track your finances</span>
              </div>
              <Button
                onClick={handleDownloadReport}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20 backdrop-blur-sm animate-fade-in-up stagger-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download Report</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Summary Cards */}
        <section>
          <SummaryCards
            income={monthlyTotals.income}
            expenses={monthlyTotals.expenses}
            balance={monthlyTotals.balance}
          />
        </section>

        {/* Filters Bar */}
        <section>
          <FiltersBar
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
          />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Transaction Form */}
          <div className="lg:col-span-1">
            <TransactionForm onSubmit={addTransaction} />
          </div>

          {/* Category Chart */}
          <div className="lg:col-span-2">
            <CategoryChart data={categorySummaries} />
          </div>
        </div>

        {/* Budget Goals & Recurring Transactions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Budget Goals */}
          <div>
            <BudgetGoals
              budgetGoals={budgetGoals}
              categorySummaries={categorySummaries}
              onAddGoal={addBudgetGoal}
              onUpdateGoal={updateBudgetGoal}
              onDeleteGoal={deleteBudgetGoal}
            />
          </div>

          {/* Recurring Transactions */}
          <div>
            <RecurringList
              transactions={transactions}
              onAddRecurring={addTransaction}
            />
          </div>
        </div>

        {/* Transaction List */}
        <section>
          <TransactionList 
            transactions={filteredTransactions}
            onDelete={deleteTransaction}
          />
          {filteredTransactions.length !== transactions.length && (
            <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-primary font-medium text-center">
                📊 Showing {filteredTransactions.length} of {transactions.length} transactions
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Personal Budget & Expense Tracker
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Built with React & TypeScript</span>
              <span>•</span>
              <span>Data stored locally</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
