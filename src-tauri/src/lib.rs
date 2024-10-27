use sqlx::PgPool;
use std::env;
use tokio::runtime::Runtime;
pub mod db {
    pub mod accounts;
    pub mod categories;
    
    pub mod schema;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    dotenv::dotenv().ok();

    let runtime = Runtime::new().expect("Failed to create runtime");
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set in .env file");
    let pool: PgPool = runtime.block_on(async {
        PgPool::connect(&database_url)
            .await
            .expect("Failed to create PostgreSQL pool")
    });

    tauri::Builder::default()
        .manage(pool)
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            db::accounts::get_accounts,
            db::accounts::create_account,
            db::accounts::update_account,
            db::accounts::delete_account,
            db::categories::get_categories,
            db::categories::create_category,
            db::categories::delete_category,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
