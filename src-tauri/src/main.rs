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

#[command]
async fn list_containers() -> String {
    container_bridge::list_containers().await
}

#[command]
async fn start_container(params: String) -> String {
    container_bridge::start_container(params).await
}

#[command]
async fn stop_container(params: String) -> String {
    container_bridge::stop_container(params).await
}

#[command]
async fn kill_container(params: String) -> String {
    container_bridge::kill_container(params).await
}

#[command]
async fn delete_container(params: String) -> String {
    container_bridge::delete_container(params).await
}

fn main() {
    Builder::default()
        .invoke_handler(tauri::generate_handler![
            ping,
            ping_async,
            list_images,
            list_containers,
            start_container,
            stop_container,
            kill_container,
            delete_container,
        ])
        .plugin(tauri_plugin_clipboard_manager::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
