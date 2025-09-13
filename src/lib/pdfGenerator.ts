import jsPDF from 'jspdf';
import { Transaction, CategorySummary } from '@/types/budget';

export interface ReportData {
  monthlyTotals: {
    income: number;
    expenses: number;
    balance: number;
  };
  categorySummaries: CategorySummary[];
  transactions: Transaction[];
  currentMonth: string;
}

export function generatePDFReport(data: ReportData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = margin;

  // Title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Budget Tracker Report', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(data.currentMonth, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 30;

  // Monthly Summary
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Monthly Summary', margin, yPosition);
  yPosition += 15;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Income: $${data.monthlyTotals.income.toFixed(2)}`, margin, yPosition);
  yPosition += 10;
  doc.text(`Expenses: $${data.monthlyTotals.expenses.toFixed(2)}`, margin, yPosition);
  yPosition += 10;
  doc.text(`Balance: $${data.monthlyTotals.balance.toFixed(2)}`, margin, yPosition);
  yPosition += 25;

  // Category Breakdown
  if (data.categorySummaries.length > 0) {
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Expense Categories', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    data.categorySummaries.forEach((category) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(
        `${category.category}: $${category.amount.toFixed(2)} (${category.percentage.toFixed(1)}%)`,
        margin,
        yPosition
      );
      yPosition += 10;
    });
    yPosition += 15;
  }

  // Recent Transactions
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  
  if (yPosition > 220) {
    doc.addPage();
    yPosition = margin;
  }
  
  doc.text('Recent Transactions', margin, yPosition);
  yPosition += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const recentTransactions = data.transactions.slice(0, 20); // Show last 20 transactions
  
  recentTransactions.forEach((transaction) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = margin;
    }
    
    const type = transaction.type === 'income' ? '+' : '-';
    const amount = `${type}$${transaction.amount.toFixed(2)}`;
    const date = new Date(transaction.date).toLocaleDateString();
    
    doc.text(`${date}`, margin, yPosition);
    doc.text(`${transaction.description}`, margin + 40, yPosition);
    doc.text(`${transaction.category}`, margin + 120, yPosition);
    doc.text(amount, margin + 160, yPosition);
    yPosition += 8;
  });

  // Footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Generated on ${new Date().toLocaleDateString()} - Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Download the PDF
  const fileName = `budget-report-${data.currentMonth.replace(' ', '-').toLowerCase()}.pdf`;
  doc.save(fileName);
}