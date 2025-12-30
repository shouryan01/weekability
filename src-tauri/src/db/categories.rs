use crate::db::schema::Category;
use sqlx::{Pool, Sqlite};
use tauri::State;

#[tauri::command]
pub async fn create_category(
    pool: State<'_, Pool<Sqlite>>,
    name: String
) -> Result<String, String> {
    let result = sqlx::query!(
        "INSERT INTO categories (name) VALUES ($1)",
        name
    )
        .execute(pool.inner())
        .await
        .map_err(|err| err.to_string())?;

    if result.rows_affected() == 1 {
        Ok("Category successfully inserted".to_string())
    } else {
        Err("Failed to insert account".to_string())
    }
}

#[tauri::command]
pub async fn get_categories(pool: State<'_, Pool<Sqlite>>) -> Result<Vec<Category>, String> {
    let rows: Vec<Category> = sqlx::query_as!(Category, "SELECT * FROM categories ")
        .fetch_all(pool.inner())
        .await
        .map_err(|err| err.to_string())?;
    Ok(rows)
}

#[tauri::command]
pub async fn update_category(
    pool: State<'_, Pool<Sqlite>>,
    id: i64,
    name: String,
) -> Result<String, String> {
    let result = sqlx::query!(
        "UPDATE categories SET name = $1 WHERE id = $2",
        name,
        id
    )
        .execute(pool.inner())
        .await
        .map_err(|err| err.to_string())?;

    if result.rows_affected() == 1 {
        Ok("Category successfully updated".to_string())
    } else {
        Err("Failed to update category".to_string())
    }
}

#[tauri::command]
pub async fn delete_category(pool: State<'_, Pool<Sqlite>>, id: i64) -> Result<String, String> {
    sqlx::query!("DELETE FROM categories WHERE id = $1", id)
        .execute(pool.inner())
        .await
        .map_err(|err| err.to_string ())?;
    Ok("Category successfully deleted".to_string())
}

pub async fn seed_categories(pool: &Pool<Sqlite>) -> Result<(), sqlx::Error> {
    let count: (i32,) = sqlx::query_as("SELECT COUNT(*) FROM categories")
        .fetch_one(pool)
        .await?;

    if count.0 == 0 {
        let categories = vec![
            "Groceries",
            "Dining",
            "Transport",
            "Housing",
            "Amazon",
            "Entertainment",
            "Shopping",
            "Misc",
        ];

        for category in categories {
            sqlx::query("INSERT INTO categories (name) VALUES (?)")
                .bind(category)
                .execute(pool)
                .await?;
        }
    }

    Ok(())
}
