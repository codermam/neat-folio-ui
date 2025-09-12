import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit2, Trash2, Receipt, TrendingUp, TrendingDown } from 'lucide-react';
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
    <Card className="transition-smooth hover:shadow-md">
      <CardHeader className="gradient-card">
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" />
          Recent Transactions
          <Badge variant="secondary" className="ml-auto">
            {transactions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {sortedTransactions.map((transaction, index) => {
            const categoryInfo = getCategoryInfo(transaction.type, transaction.category);
            
            return (
              <div 
                key={transaction.id} 
                className={`p-4 border-b border-border last:border-b-0 hover:bg-accent/50 transition-smooth ${
                  index % 2 === 0 ? 'bg-background/50' : 'bg-muted/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Type Indicator */}
                    <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-success-light' : 'bg-warning-light'}`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-warning" />
                      )}
                    </div>
                    
                    {/* Transaction Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{transaction.description}</h4>
                        <span className={`w-2 h-2 rounded-full ${categoryInfo.color}`}></span>
                        <Badge variant="outline" className="text-xs">
                          {categoryInfo.name}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Amount */}
                    <span className={`font-semibold text-lg ${
                      transaction.type === 'income' ? 'text-success' : 'text-foreground'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {onEdit && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(transaction)}
                          className="h-8 w-8 p-0 hover:bg-accent transition-bounce"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      )}
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-bounce"
                          >
                            <Trash2 className="h-3 w-3" />
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