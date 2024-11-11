export type Account = {
  id: number,
  name: string,
  account_type: string,
  opened: Date,
  balance: number,
}

export type Category = {
  id: number,
  name: string,
}

export type Transaction = {
  id: number,
  account_id: number,
  category_id: number,
  description: string,
  transaction_date: Date,
  amount: number
}

export type TransactionFormLabel = {
  id: number,
  name: string
}