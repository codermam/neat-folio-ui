import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Repeat, Calendar, DollarSign, Plus } from 'lucide-react';
import { Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types/budget';

interface RecurringListProps {
  transactions: Transaction[];
  onAddRecurring: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'recurring' | 'frequency'>) => void;
}

export function RecurringList({ transactions, onAddRecurring }: RecurringListProps) {
  const recurringTransactions = transactions.filter(t => t.recurring);

  const getCategoryInfo = (type: 'income' | 'expense', categoryId: string) => {
    const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    return categories.find(cat => cat.id === categoryId) || { name: categoryId, color: 'category-other' };
  };

  const getNextDueDate = (lastDate: string, frequency: 'weekly' | 'monthly') => {
    const date = new Date(lastDate);
    if (frequency === 'weekly') {
      date.setDate(date.getDate() + 7);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    return date;
  };

  const isOverdue = (nextDue: Date) => {
    return nextDue < new Date();
  };

  if (recurringTransactions.length === 0) {
    return (
      <Card className="transition-smooth">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Repeat className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No recurring transactions</h3>
          <p className="text-muted-foreground text-center">Set up recurring transactions to automate your budget tracking.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-spring hover-lift border-0 shadow-xl overflow-hidden animate-fade-in-up stagger-3">
      <CardHeader className="gradient-hero relative overflow-hidden">
        <CardTitle className="flex items-center gap-3 text-primary-foreground text-lg font-bold relative z-10">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Repeat className="h-5 w-5 drop-shadow-sm" />
          </div>
          🔄 Recurring Transactions
          <span className="text-sm font-normal text-primary-foreground/80 ml-auto bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            {recurringTransactions.length} active
          </span>
        </CardTitle>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-float" style={{ animationDelay: '2s' }}></div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {recurringTransactions.map((transaction, index) => {
            const categoryInfo = getCategoryInfo(transaction.type, transaction.category);
            const nextDue = getNextDueDate(transaction.date, transaction.frequency || 'monthly');
            const overdue = isOverdue(nextDue);
            
            return (
              <div 
                key={transaction.id} 
                className={`p-5 border-b border-border/30 last:border-b-0 hover-glow transition-spring group animate-fade-in-up ${
                  index % 2 === 0 ? 'bg-gradient-to-r from-background/80 to-muted/20' : 'bg-gradient-to-r from-muted/10 to-background/50'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Recurring Icon */}
                    <div className="p-3 rounded-xl gradient-accent shadow-glow transition-spring group-hover:scale-110 group-hover:rotate-12">
                      <Repeat className="h-5 w-5 text-accent-foreground drop-shadow-sm" />
                    </div>
                    
                    {/* Transaction Info */}
                    <div className="space-y-1 group-hover:translate-x-1 transition-transform">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                          {transaction.description}
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full shadow-sm ${categoryInfo.color} animate-pulse-subtle`}></div>
                          <Badge variant="outline" className="text-xs font-medium glass-card">
                            {categoryInfo.name}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className="capitalize">{transaction.frequency || 'monthly'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Next due:</span>
                          <span className={overdue ? 'text-destructive font-medium' : 'text-foreground'}>
                            {nextDue.toLocaleDateString()}
                          </span>
                          {overdue && <Badge variant="destructive" className="text-xs">Overdue</Badge>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Amount */}
                    <div className="text-right group-hover:scale-105 transition-transform">
                      <span className={`font-bold text-2xl tracking-tight ${
                        transaction.type === 'income' ? 'text-success drop-shadow-sm' : 'text-foreground'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        <span className="text-lg opacity-70">$</span>
                        {Math.floor(transaction.amount).toLocaleString()}
                        <span className="text-lg opacity-70">.{(transaction.amount % 1).toFixed(2).slice(2)}</span>
                      </span>
                    </div>

                    {/* Add Transaction Button */}
                    <Button
                      size="sm"
                      onClick={() => onAddRecurring({
                        type: transaction.type,
                        amount: transaction.amount,
                        category: transaction.category,
                        description: transaction.description,
                        date: new Date().toISOString().slice(0, 10),
                      })}
                      className={`h-9 px-4 transition-spring hover:scale-105 ${
                        overdue 
                          ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground animate-pulse' 
                          : 'bg-primary hover:bg-primary/90'
                      }`}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {overdue ? 'Add Now' : 'Add'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}