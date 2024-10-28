use rust_decimal::Decimal;
use serde::{Deserialize, Serialize, Serializer};
use sqlx::prelude::FromRow;
use time::{format_description, Date};

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct Account {
    pub id: i32,
    pub name: String,
    pub account_type: String,
    pub balance: Decimal,
    #[serde(serialize_with = "serialize_date")]
    pub opened: Date,
}
#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct Category {
    pub id: i32,
    pub name: String,
}

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct Transaction {
    pub id: i32,
    pub account_id: i32,
    pub category_id: i32,
    pub description: String,
    #[serde(serialize_with = "serialize_date")]
    pub transaction_date: Date,
    pub amount: Decimal,
}

fn serialize_date<S>(date: &Date, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    let format =
        format_description::parse("[year]-[month]-[day]").map_err(serde::ser::Error::custom)?;

    let formatted = date.format(&format).map_err(serde::ser::Error::custom)?;

    serializer.serialize_str(&formatted)
}