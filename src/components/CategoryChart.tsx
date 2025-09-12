import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { CategorySummary, EXPENSE_CATEGORIES } from '@/types/budget';

interface CategoryChartProps {
  data: CategorySummary[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <Card className="transition-smooth">
        <CardHeader className="gradient-card">
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-primary" />
            Expense Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <PieChartIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No expense data</h3>
          <p className="text-muted-foreground text-center">Add some expense transactions to see category breakdown.</p>
        </CardContent>
      </Card>
    );
  }

  const getCategoryColor = (categoryId: string) => {
    const category = EXPENSE_CATEGORIES.find(cat => cat.id === categoryId);
    return category?.color || 'category-other';
  };

  const getHSLFromCategory = (categoryId: string) => {
    const colorMap: Record<string, string> = {
      food: 'hsl(25, 95%, 53%)',
      transport: 'hsl(217, 91%, 60%)',
      entertainment: 'hsl(271, 81%, 56%)',
      shopping: 'hsl(330, 81%, 60%)',
      utilities: 'hsl(142, 76%, 36%)',
      healthcare: 'hsl(0, 84%, 60%)',
      education: 'hsl(38, 92%, 50%)',
      other: 'hsl(215, 16%, 47%)',
    };
    return colorMap[categoryId] || colorMap.other;
  };

  const chartData = data.map(item => ({
    name: EXPENSE_CATEGORIES.find(cat => cat.id === item.category)?.name || item.category,
    value: item.amount,
    percentage: item.percentage,
    count: item.count,
    fill: getHSLFromCategory(item.category),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            ${data.value.toFixed(2)} ({data.percentage.toFixed(1)}%)
          </p>
          <p className="text-xs text-muted-foreground">
            {data.count} transaction{data.count !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-foreground font-medium">{entry.value}</span>
            <span className="text-muted-foreground">
              ${chartData[index]?.value.toFixed(0)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="transition-smooth hover:shadow-lg">
      <CardHeader className="gradient-card">
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-primary" />
          Expense Categories
          <span className="text-sm font-normal text-muted-foreground ml-auto">
            This Month
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.fill}
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Category List */}
        <div className="mt-6 space-y-3">
          {data.map((item, index) => {
            const categoryInfo = EXPENSE_CATEGORIES.find(cat => cat.id === item.category);
            return (
              <div key={item.category} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getHSLFromCategory(item.category) }}
                  />
                  <span className="font-medium text-foreground">
                    {categoryInfo?.name || item.category}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">${item.amount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.percentage.toFixed(1)}% • {item.count} transactions
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}