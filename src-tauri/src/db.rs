use sqlx::{Pool, Postgres};
use tauri::State;

use crate::schema::Account;


#[tauri::command]
pub async fn get_all_accounts(pool: State<'_, Pool<Postgres>>) -> Result<Vec<Account>, String> {
    let rows: Vec<Account> = sqlx::query_as!(Account, "SELECT * FROM accounts")
        .fetch_all(pool.inner())
        .await
        .map_err(|err| err.to_string())?;
    Ok(rows)
}
