import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit2, Trash2, Receipt, TrendingUp, TrendingDown, List } from 'lucide-react';
import { Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types/budget';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getCategoryInfo = (type: 'income' | 'expense', categoryId: string) => {
    const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    return categories.find(cat => cat.id === categoryId) || { name: categoryId, color: 'category-other' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (transactions.length === 0) {
    return (
      <Card className="transition-smooth">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No transactions yet</h3>
          <p className="text-muted-foreground text-center">Start by adding your first income or expense transaction above.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-spring hover-lift border-0 shadow-xl overflow-hidden animate-fade-in-up stagger-4">
      <CardHeader className="gradient-hero relative overflow-hidden">
        <CardTitle className="flex items-center gap-3 text-primary-foreground text-lg font-bold relative z-10">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <List className="h-5 w-5 drop-shadow-sm" />
          </div>
          📝 Recent Transactions
          {transactions.length > 0 && (
            <span className="text-sm font-normal text-primary-foreground/80 ml-auto bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              {transactions.length} total
            </span>
          )}
        </CardTitle>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-float" style={{ animationDelay: '3s' }}></div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {sortedTransactions.map((transaction, index) => {
            const categoryInfo = getCategoryInfo(transaction.type, transaction.category);
            
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
                    {/* Type Indicator */}
                    <div className={`p-3 rounded-xl shadow-lg transition-spring group-hover:scale-110 group-hover:rotate-12 ${
                      transaction.type === 'income' ? 'gradient-success shadow-glow-success' : 'gradient-warning shadow-glow-warning'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="h-5 w-5 text-success-foreground drop-shadow-sm" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-warning-foreground drop-shadow-sm" />
                      )}
                    </div>
                    
                    {/* Transaction Info */}
                    <div className="space-y-1 group-hover:translate-x-1 transition-transform">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">{transaction.description}</h4>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full shadow-sm ${categoryInfo.color} animate-pulse-subtle`}></div>
                          <Badge variant="outline" className="text-xs font-medium glass-card">
                            {categoryInfo.name}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">{formatDate(transaction.date)}</p>
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

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {onEdit && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(transaction)}
                          className="h-9 w-9 p-0 hover-bounce glass-card transition-spring hover:shadow-glow"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-9 w-9 p-0 hover:bg-destructive/20 hover:text-destructive transition-spring hover:scale-110 glass-card"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this transaction? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => onDelete(transaction.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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