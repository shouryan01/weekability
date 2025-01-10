use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct Account {
    pub id: i64,
    pub name: String,
    pub account_type: String,
    pub balance: i64,
    pub opened: String,
}

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct Category {
    pub id: i64,
    pub name: String,
}

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct Transaction {
    pub id: i64,
    pub account_id: i64,
    pub category_id: i64,
    pub description: String,
    pub transaction_date: String,
    pub amount: i64,
}
