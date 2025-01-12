use crate::db::schema::Account;
use sqlx::{Pool, Sqlite};
use tauri::State;

#[tauri::command]
pub async fn create_account(
    pool: State<'_, Pool<Sqlite>>,
    name: String,
    account_type: String,
    balance: i64,
    opened: String,
) -> Result<String, String> {
    let result = sqlx::query!(
        "INSERT INTO accounts (name, account_type, balance, opened) VALUES ($1, $2, $3, $4)",
        name,
        account_type,
        balance,
        opened
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
pub async fn get_accounts(pool: State<'_, Pool<Sqlite>>) -> Result<Vec<Account>, String> {
    let rows: Vec<Account> = sqlx::query_as!(Account, "SELECT * FROM accounts")
        .fetch_all(pool.inner())
        .await
        .map_err(|err| err.to_string())?;
    Ok(rows)
}

#[tauri::command]
pub async fn get_account_names(pool: State<'_, Pool<Sqlite>>) -> Result<Vec<String>, String> {
    let rows: Vec<String> = sqlx::query_scalar!("SELECT name FROM accounts")
        .fetch_all(pool.inner())
        .await
        .map_err(|err| err.to_string())?;
    Ok(rows)
}

#[tauri::command]
pub async fn update_account(
    pool: State<'_, Pool<Sqlite>>,
    id: i64,
    name: String,
    account_type: String,
    balance: i64,
    opened: String,
) -> Result<String, String> {
    let result = sqlx::query!(
        "UPDATE accounts SET name = $2, account_type = $3, balance = $4, opened = $5 WHERE id = $1",
        id,
        name,
        account_type,
        balance,
        opened
    )
    .execute(pool.inner())
    .await
    .map_err(|err| err.to_string())?;

    if result.rows_affected() == 1 {
        Ok("Account successfully updated".to_string())
    } else {
        Err("Failed to update account".to_string())
    }
}

#[tauri::command]
pub async fn delete_account(pool: State<'_, Pool<Sqlite>>, id: i64) -> Result<String, String> {
    sqlx::query!("DELETE FROM accounts WHERE id = $1", id)
        .execute(pool.inner())
        .await
        .map_err(|err| err.to_string())?;
    Ok("Account successfully deleted".to_string())
}
