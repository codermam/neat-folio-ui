import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';

interface SummaryCardsProps {
  income: number;
  expenses: number;
  balance: number;
}

export function SummaryCards({ income, expenses, balance }: SummaryCardsProps) {
  const savingsRate = income > 0 ? ((balance / income) * 100) : 0;

  const cards = [
    {
      title: 'Total Income',
      value: income,
      icon: TrendingUp,
      gradient: 'gradient-success',
      textColor: 'text-success-foreground',
      iconBg: 'bg-success-light',
      iconColor: 'text-success',
    },
    {
      title: 'Total Expenses',
      value: expenses,
      icon: TrendingDown,
      gradient: 'bg-card',
      textColor: 'text-foreground',
      iconBg: 'bg-warning-light',
      iconColor: 'text-warning',
    },
    {
      title: 'Net Balance',
      value: balance,
      icon: Wallet,
      gradient: balance >= 0 ? 'gradient-success' : 'bg-card',
      textColor: balance >= 0 ? 'text-success-foreground' : 'text-destructive',
      iconBg: balance >= 0 ? 'bg-success-light' : 'bg-red-50',
      iconColor: balance >= 0 ? 'text-success' : 'text-destructive',
    },
    {
      title: 'Savings Rate',
      value: savingsRate,
      icon: Target,
      gradient: 'gradient-card',
      textColor: 'text-foreground',
      iconBg: 'bg-accent',
      iconColor: 'text-accent-foreground',
      isPercentage: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card 
          key={card.title} 
          className={`${card.gradient} transition-smooth hover:shadow-lg hover:scale-105 transform`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className={`text-sm font-medium ${card.textColor}`}>
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.iconBg}`}>
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.textColor}`}>
              {card.isPercentage ? (
                `${card.value.toFixed(1)}%`
              ) : (
                `$${Math.abs(card.value).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              )}
            </div>
            {!card.isPercentage && (
              <p className={`text-xs mt-1 ${
                card.textColor.includes('success') ? 'text-success-foreground/70' : 
                card.textColor.includes('destructive') ? 'text-destructive/70' : 
                'text-muted-foreground'
              }`}>
                {card.title === 'Net Balance' && balance < 0 && 'Deficit this month'}
                {card.title === 'Net Balance' && balance >= 0 && 'Surplus this month'}
                {card.title !== 'Net Balance' && 'This month'}
              </p>
            )}
            {card.isPercentage && (
              <p className="text-xs text-muted-foreground mt-1">
                {savingsRate >= 20 ? 'Excellent savings!' : 
                 savingsRate >= 10 ? 'Good progress' : 
                 savingsRate > 0 ? 'Keep saving' : 'Focus on budgeting'}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}