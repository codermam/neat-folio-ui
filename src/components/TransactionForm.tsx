import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PlusCircle, DollarSign } from 'lucide-react';
import { Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types/budget';
import { useToast } from '@/hooks/use-toast';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive number.",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      type,
      amount: numericAmount,
      category,
      description,
      date,
    });

    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    
    toast({
      title: "Transaction Added",
      description: `${type === 'income' ? 'Income' : 'Expense'} of $${numericAmount.toFixed(2)} added successfully.`,
    });
  };

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <Card className="transition-spring hover-lift border-0 shadow-xl overflow-hidden animate-fade-in-up stagger-2">
      <CardHeader className="gradient-hero relative overflow-hidden">
        <CardTitle className="flex items-center gap-3 text-primary-foreground text-lg font-bold relative z-10">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <PlusCircle className="h-5 w-5 drop-shadow-sm" />
          </div>
          Add Transaction
        </CardTitle>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-float"></div>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Transaction Type</Label>
            <RadioGroup value={type} onValueChange={(value) => setType(value as 'income' | 'expense')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense" className="flex items-center gap-2 cursor-pointer">
                  <span className="w-3 h-3 rounded-full bg-warning"></span>
                  Expense
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income" className="flex items-center gap-2 cursor-pointer">
                  <span className="w-3 h-3 rounded-full bg-success"></span>
                  Income
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">Amount *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-9 transition-smooth focus:shadow-glow"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="transition-smooth focus:shadow-glow">
                <SelectValue placeholder={`Select ${type} category`} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${cat.color}`}></span>
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
            <Input
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="transition-smooth focus:shadow-glow"
              required
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="transition-smooth focus:shadow-glow"
            />
          </div>

          <Button type="submit" className="w-full gradient-primary transition-spring hover:shadow-glow hover:scale-105 text-lg font-semibold py-6 group">
            <PlusCircle className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
            <span className="group-hover:scale-105 transition-transform">
              Add {type === 'income' ? '💰 Income' : '💳 Expense'}
            </span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}