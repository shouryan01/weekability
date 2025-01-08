// use crate::db::schema::Category;
// use sqlx::{Pool, Postgres};
// use tauri::State;
// 
// #[tauri::command]
// pub async fn get_categories(pool: State<'_, Pool<Postgres>>) -> Result<Vec<Category>, String> {
//     let rows: Vec<Category> = sqlx::query_as!(Category, "SELECT * FROM categories")
//         .fetch_all(pool.inner())
//         .await
//         .map_err(|err| err.to_string())?;
//     Ok(rows)
// }
// 
// #[tauri::command]
// pub async fn create_category(
//     pool: State<'_, Pool<Postgres>>,
//     name: String
// ) -> Result<String, String> {
//     let result = sqlx::query!(
//         "INSERT INTO categories (name) VALUES ($1)",
//         name
//     )
//     .execute(pool.inner())
//     .await
//     .map_err(|err| err.to_string())?;
// 
//     if result.rows_affected() == 1 {
//         Ok("Category successfully inserted".to_string())
//     } else {
//         Err("Failed to insert account".to_string())
//     }
// }
// 
// #[tauri::command]
// pub async fn delete_category(pool: State<'_, Pool<Postgres>>, id: i32) -> Result<String, String> {
//     sqlx::query!("DELETE FROM categories WHERE id = $1", id)
//         .execute(pool.inner())
//         .await
//         .map_err(|err| err.to_string ())?;
//     Ok("Category successfully deleted".to_string())
// }