export type Transaction = {
  id: string;
  amount: number;
  date: string;
  note?: string;
  category?: string;
};

export type Debt = {
  id: string;
  amount: number;
  date: string;
  note?: string;
  category?: string;
};

export type Debtor = {
  id: string;
  name: string;
  debts: Debt[];
};
