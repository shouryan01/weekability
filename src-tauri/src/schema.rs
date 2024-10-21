use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use time::Date;

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct Account {
    pub id: i32,
    pub name: String,
    pub account_type: String,
    pub balance: Decimal, 
    pub opened: Date,
}