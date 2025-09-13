import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, AlertTriangle, TrendingUp, Edit2, Trash2 } from 'lucide-react';
import { BudgetGoal, CategorySummary, EXPENSE_CATEGORIES } from '@/types/budget';
import { useToast } from '@/hooks/use-toast';

interface BudgetGoalsProps {
  budgetGoals: BudgetGoal[];
  categorySummaries: CategorySummary[];
  onAddGoal: (goal: Omit<BudgetGoal, 'id'>) => void;
  onUpdateGoal: (id: string, updates: Partial<BudgetGoal>) => void;
  onDeleteGoal: (id: string) => void;
}

export function BudgetGoals({ 
  budgetGoals, 
  categorySummaries, 
  onAddGoal, 
  onUpdateGoal, 
  onDeleteGoal 
}: BudgetGoalsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ category: '', limit: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const currentMonth = new Date().toISOString().slice(0, 7);

  const handleAddGoal = () => {
    if (!newGoal.category || !newGoal.limit) {
      toast({
        title: "Missing Information",
        description: "Please select a category and enter a budget limit.",
        variant: "destructive",
      });
      return;
    }

    const limit = parseFloat(newGoal.limit);
    if (isNaN(limit) || limit <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive number.",
        variant: "destructive",
      });
      return;
    }

    onAddGoal({
      category: newGoal.category,
      limit: limit,
      month: currentMonth,
    });

    setNewGoal({ category: '', limit: '' });
    setShowAddForm(false);
    
    toast({
      title: "Budget Goal Added",
      description: `Budget limit of $${limit.toFixed(2)} set for ${newGoal.category}.`,
    });
  };

  const getSpentAmount = (category: string) => {
    const summary = categorySummaries.find(s => s.category === category);
    return summary ? summary.amount : 0;
  };

  const getProgressPercentage = (spent: number, limit: number) => {
    return limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'text-destructive';
    if (percentage >= 80) return 'text-warning';
    return 'text-success';
  };

  const getStatusBadge = (percentage: number) => {
    if (percentage >= 100) return { variant: 'destructive' as const, text: 'Over Budget' };
    if (percentage >= 80) return { variant: 'secondary' as const, text: 'Near Limit' };
    return { variant: 'default' as const, text: 'On Track' };
  };

  const getCategoryInfo = (categoryId: string) => {
    return EXPENSE_CATEGORIES.find(cat => cat.id === categoryId) || { name: categoryId, color: 'category-other' };
  };

  return (
    <Card className="transition-spring hover-lift border-0 shadow-xl overflow-hidden animate-fade-in-up stagger-4">
      <CardHeader className="gradient-hero relative overflow-hidden">
        <CardTitle className="flex items-center gap-3 text-primary-foreground text-lg font-bold relative z-10">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Target className="h-5 w-5 drop-shadow-sm" />
          </div>
          🎯 Budget Goals
          <span className="text-sm font-normal text-primary-foreground/80 ml-auto bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            {budgetGoals.length} goals
          </span>
        </CardTitle>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-float" style={{ animationDelay: '4s' }}></div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Add New Goal Button */}
        {!showAddForm && (
          <Button
            onClick={() => setShowAddForm(true)}
            variant="outline"
            className="w-full border-dashed border-2 h-12 hover:bg-primary/5 transition-spring"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Budget Goal
          </Button>
        )}

        {/* Add Goal Form */}
        {showAddForm && (
          <div className="p-4 border border-border/50 rounded-lg bg-muted/30 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Category</Label>
                <Select value={newGoal.category} onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((cat) => (
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
              <div className="space-y-2">
                <Label className="text-sm font-medium">Monthly Limit</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={newGoal.limit}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, limit: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddGoal} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Goal
              </Button>
              <Button 
                onClick={() => {
                  setShowAddForm(false);
                  setNewGoal({ category: '', limit: '' });
                }} 
                variant="outline" 
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Budget Goals List */}
        {budgetGoals.length === 0 && !showAddForm && (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No budget goals set</h3>
            <p className="text-muted-foreground">Create budget goals to track your spending limits.</p>
          </div>
        )}

        <div className="space-y-4">
          {budgetGoals.map((goal, index) => {
            const categoryInfo = getCategoryInfo(goal.category);
            const spentAmount = getSpentAmount(goal.category);
            const progressPercentage = getProgressPercentage(spentAmount, goal.limit);
            const statusBadge = getStatusBadge(progressPercentage);
            const remaining = Math.max(0, goal.limit - spentAmount);

            return (
              <div 
                key={goal.id} 
                className={`p-5 rounded-lg border transition-spring hover-glow animate-fade-in-up ${
                  progressPercentage >= 100 ? 'bg-destructive/5 border-destructive/20' :
                  progressPercentage >= 80 ? 'bg-warning/5 border-warning/20' :
                  'bg-success/5 border-success/20'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${categoryInfo.color}`}></div>
                    <div>
                      <h4 className="font-semibold text-foreground">{categoryInfo.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${spentAmount.toFixed(2)} of ${goal.limit.toFixed(2)} spent
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusBadge.variant} className="text-xs">
                      {statusBadge.text}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteGoal(goal.id)}
                      className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Progress</span>
                    <span className={`font-bold ${getStatusColor(progressPercentage)}`}>
                      {progressPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={progressPercentage} 
                    className="h-2"
                  />
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>
                      {progressPercentage >= 100 ? (
                        <span className="text-destructive font-medium flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Over by ${(spentAmount - goal.limit).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-success font-medium flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          ${remaining.toFixed(2)} remaining
                        </span>
                      )}
                    </span>
                    <span>{currentMonth}</span>
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