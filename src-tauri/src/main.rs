#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{command, Builder};

#[command]
fn ping() -> String {
    container_bridge::ping()
}

#[command]
async fn ping_async() -> String {
    container_bridge::ping_async().await
}

#[command]
async fn list_images() -> String {
    container_bridge::list_images().await
}

fn main() {
    Builder::default()
        .invoke_handler(tauri::generate_handler![ping, ping_async, list_images,])
        .plugin(tauri_plugin_clipboard_manager::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
