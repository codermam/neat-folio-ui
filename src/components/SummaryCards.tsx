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
          className={`${card.gradient} transition-spring hover-lift border-0 shadow-lg overflow-hidden animate-fade-in-up stagger-${index + 1} group`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
            <CardTitle className={`text-sm font-medium ${card.textColor} transition-smooth group-hover:scale-105`}>
              {card.title}
            </CardTitle>
            <div className={`p-3 rounded-xl ${card.iconBg} shadow-inner transition-spring group-hover:scale-110 group-hover:rotate-12`}>
              <card.icon className={`h-5 w-5 ${card.iconColor} drop-shadow-sm`} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </CardHeader>
          <CardContent className="relative">
            <div className={`text-3xl font-bold ${card.textColor} transition-smooth group-hover:scale-105 tracking-tight`}>
              {card.isPercentage ? (
                <>
                  <span className="text-4xl">{card.value.toFixed(1)}</span>
                  <span className="text-2xl opacity-80">%</span>
                </>
              ) : (
                <>
                  <span className="text-lg opacity-80">$</span>
                  <span className="text-3xl">{Math.abs(card.value).toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}</span>
                  <span className="text-lg opacity-60">.{(Math.abs(card.value) % 1).toFixed(2).slice(2)}</span>
                </>
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