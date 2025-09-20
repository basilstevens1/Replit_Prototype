import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

export default function DonationForm() {
  const [amount, setAmount] = useState('');
  const [charity, setCharity] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Donation submitted:', { amount, charity, date });
    // todo: remove mock functionality - handle actual form submission
    setAmount('');
    setCharity('');
    setDate('');
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
          
          <Button type="submit" className="w-full" data-testid="button-submit-donation">
            Add Donation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}