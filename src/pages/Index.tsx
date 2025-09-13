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
            <div className="hidden sm:flex items-center gap-6 text-sm text-primary-foreground/90 animate-fade-in-up stagger-1">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse-subtle"></div>
                <span className="font-medium">{transactions.length} transactions</span>
              </div>
              <span className="hidden md:block font-medium">💰 Track your finances</span>
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
