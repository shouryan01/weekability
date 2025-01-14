export type Account = {
  id: number,
  name: string,
  account_type: string,
  opened: string,
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
  transaction_date: string,
  amount: number
}

export type TransactionFormLabel = {
  id: number,
  name: string
}

export const TransactionColumns = [
    {
      name: "Description",
      key: "description",
      required: true,
      description: "The description of the transaction",
      suggested_mappings: ["name", "description"],
    },
    {
        name: "Category",
        key: "category",
        required: true,
        description: "The category of the transaction",
        suggested_mappings: ["category", "type"],
    },
    {
        name: "Account",
        key: "account",
        required: true,
        description: "The account relating to the transaction",
        suggested_mappings: ["account"],
    },
    {
        name: "Date",
        key: "date",
        required: true,
        description: "The date of the transaction",
        suggested_mappings: ["date"],
    },
    {
        name: "Amount",
        key: "amount",
        required: true,
        description: "The amount of the transaction",
        suggested_mappings: ["amount"],
    },
];

export const CustomStyles={
      "color-primary": "black",
      "color-primary-hover": "#262626",

      "color-secondary": "black",
      "color-secondary-hover": "#262626",

      "color-tertiary": "black",
      "color-tertiary-hover": "#262626",
}
