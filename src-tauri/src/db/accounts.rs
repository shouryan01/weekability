use crate::db::schema::Account;
use rust_decimal::Decimal;
use sqlx::{Pool, Postgres};
use tauri::State;
use time::{format_description, Date};

#[tauri::command]
pub async fn create_account(
    pool: State<'_, Pool<Postgres>>,
    name: String,
    account_type: String,
    balance: Decimal,
    opened: String,
) -> Result<String, String> {
    let format = format_description::parse("[year]-[month]-[day]").map_err(|e| e.to_string())?;
    let opened_date = Date::parse(&opened, &format).map_err(|e| e.to_string())?;

    let result = sqlx::query!(
        "INSERT INTO accounts (name, account_type, balance, opened) VALUES ($1, $2, $3, $4)",
        name,
        account_type,
        balance,
        opened_date
    )
    .execute(pool.inner())
    .await
    .map_err(|err| err.to_string())?;

    if result.rows_affected() == 1 {
        Ok("Account successfully inserted".to_string())
    } else {
        Err("Failed to insert account".to_string())
    }
}

#[tauri::command]
pub async fn get_accounts(pool: State<'_, Pool<Postgres>>) -> Result<Vec<Account>, String> {
    let rows: Vec<Account> = sqlx::query_as!(Account, "SELECT * FROM accounts")
        .fetch_all(pool.inner())
        .await
        .map_err(|err| err.to_string())?;
    Ok(rows)
}

#[tauri::command]
pub async fn delete_account(pool: State<'_, Pool<Postgres>>, id: i32) -> Result<String, String> {
    sqlx::query!("DELETE FROM accounts WHERE id = $1", id)
        .execute(pool.inner())
        .await
        .map_err(|err| err.to_string())?;
    Ok("Account successfully deleted".to_string())
}
