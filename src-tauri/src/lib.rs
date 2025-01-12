use std::env;
use tauri::Manager;
use tokio::runtime::Runtime;

mod db_conn;
pub mod db {
    pub mod accounts;
    pub mod categories;
    pub mod transactions;

    pub mod schema;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let runtime = Runtime::new().expect("Failed to create runtime");

    tauri::Builder::default()
        .setup(move |app| {
            let app_handle = app.handle();
            let handle_clone = app_handle.clone();

            let database = runtime.block_on(async move {
                db_conn::Database::new(handle_clone)
                    .await
                    .expect("Failed to initialize database")
            });

            app.manage(database.pool);
            Ok(())
        })
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            db::accounts::create_account,
            db::accounts::get_accounts,
            db::accounts::update_account,
            db::accounts::delete_account,

            db::categories::create_category,
            db::categories::get_categories,
            db::categories::update_category,
            db::categories::delete_category,

            db::transactions::create_transaction,
            db::transactions::get_transactions,
            db::transactions::update_transaction,
            db::transactions::delete_transaction
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
