use sqlx::PgPool;
use tokio::runtime::Runtime;
mod db;
mod schema;

#[tauri::command]
fn greet(name: &str) -> String {
    return format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let runtime = Runtime::new().expect("Failed to create runtime");
    let pool: PgPool = runtime.block_on(async {
        PgPool::connect("postgres://postgres@localhost/weekability")
            .await
            .expect("Failed to create PostgreSQL pool")
    });

    tauri::Builder::default()
        .manage(pool)
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, db::get_all_accounts])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}