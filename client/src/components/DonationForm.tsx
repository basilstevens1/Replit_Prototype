import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useDonations } from "@/hooks/useDonations";
import type { InsertDonation } from "@shared/schema";

export default function DonationForm() {
  const [amount, setAmount] = useState('');
  const [charity, setCharity] = useState('');
  const [date, setDate] = useState('');
  const { createDonation, isCreating } = useDonations();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !charity || !date) {
      return;
    }

    const donationData: InsertDonation = {
      amount,
      charity,
      charityCategory: getCategoryForCharity(charity),
      donationDate: new Date(date),
      notes: null,
    };

    createDonation(donationData);
    
    // Reset form
    setAmount('');
    setCharity('');
    setDate('');
  };

  const getCategoryForCharity = (charityName: string): string => {
    const categoryMap: Record<string, string> = {
      'givewell': 'Global Health',
      'charity-water': 'Water & Sanitation',
      'malala-fund': 'Education',
      'partners-in-health': 'Healthcare',
      'against-malaria': 'Disease Prevention',
    };
    return categoryMap[charityName] || 'Other';
  };

  return (
    <Card data-testid="card-donation-form">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Donation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              data-testid="input-donation-amount"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="charity">Charity</Label>
            <Select value={charity} onValueChange={setCharity}>
              <SelectTrigger data-testid="select-charity">
                <SelectValue placeholder="Select charity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="givewell">GiveWell</SelectItem>
                <SelectItem value="charity-water">charity: water</SelectItem>
                <SelectItem value="malala-fund">Malala Fund</SelectItem>
                <SelectItem value="partners-in-health">Partners In Health</SelectItem>
                <SelectItem value="against-malaria">Against Malaria Foundation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              data-testid="input-donation-date"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isCreating || !amount || !charity || !date}
            data-testid="button-submit-donation"
          >
            {isCreating ? "Adding..." : "Add Donation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}