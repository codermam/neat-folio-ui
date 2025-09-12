import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { useBudget } from '@/hooks/useBudget';
import { SummaryCards } from '@/components/SummaryCards';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { CategoryChart } from '@/components/CategoryChart';

const Index = () => {
  const { 
    transactions, 
    addTransaction, 
    deleteTransaction, 
    getMonthlyTotals, 
    getCategorySummaries 
  } = useBudget();

  const monthlyTotals = getMonthlyTotals();
  const categorySummaries = getCategorySummaries();

  const currentMonth = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-card border-b border-border/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg gradient-primary shadow-glow">
                <Wallet className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Budget Tracker</h1>
                <p className="text-sm text-muted-foreground">{currentMonth}</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
              <span>{transactions.length} transactions</span>
              <span>•</span>
              <span>Track your finances</span>
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

        {/* Transaction List */}
        <section>
          <TransactionList 
            transactions={transactions}
            onDelete={deleteTransaction}
          />
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
