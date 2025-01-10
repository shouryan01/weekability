use sqlx::{Pool, Sqlite};
use tauri::State;
use crate::db::schema::Transaction;

#[tauri::command]
pub async fn create_transaction(
    pool: State<'_, Pool<Sqlite>>,
    account_id: i64,
    category_id: i64,
    description: String,
    transaction_date: String,
    amount: i64
) -> Result<String, String> {
    let result = sqlx::query!(
        "INSERT INTO transactions (account_id, category_id, description, transaction_date, amount) VALUES ($1, $2, $3, $4, $5)",
        account_id,
        category_id,
        description,
        transaction_date,
        amount
    )
    .execute(pool.inner())
    .await
    .map_err(|err| err.to_string())?;

    if result.rows_affected() == 1 {
        Ok("Transaction successfully created!".to_string())
    } else {
        Err("Failed to create transaction".to_string())
    }
}

#[tauri::command]
pub async fn get_transactions(pool: State<'_, Pool<Sqlite>>) -> Result<Vec<Transaction>, String> {
    let rows: Vec<Transaction> = sqlx::query_as!(Transaction, "SELECT * FROM transactions")
        .fetch_all(pool.inner())
        .await
        .map_err(|err| err.to_string())?;
    Ok(rows)
}

#[tauri::command]
pub async fn delete_transaction(pool: State<'_, Pool<Sqlite>>, id: i64) -> Result<String, String> {
    sqlx::query!("DELETE FROM transactions WHERE id = $1", id)
        .execute(pool.inner())
        .await
        .map_err(|err| err.to_string())?;
    Ok("Account successfully deleted".to_string())
}
