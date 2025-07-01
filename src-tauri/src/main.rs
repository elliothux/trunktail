#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{command, Builder};

macro_rules! tauri_command_async {
    // No parameters
    ($fn_name:ident) => {
        #[command]
        async fn $fn_name() -> String {
            container_bridge::$fn_name().await
        }
    };
    // One parameter
    ($fn_name:ident, $param:ident) => {
        #[command]
        async fn $fn_name($param: String) -> String {
            container_bridge::$fn_name($param).await
        }
    };
}

#[command]
fn ping() -> String {
    container_bridge::ping()
}

tauri_command_async!(ping_async);
tauri_command_async!(list_images);
tauri_command_async!(list_containers);
tauri_command_async!(start_container, params);
tauri_command_async!(stop_container, params);
tauri_command_async!(kill_container, params);
tauri_command_async!(delete_container, params);
tauri_command_async!(save_image, params);
tauri_command_async!(load_image, params);
tauri_command_async!(prune_images);
tauri_command_async!(tag_image, params);
tauri_command_async!(delete_images, params);

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
            delete_images,
            save_image,
            load_image,
            prune_images,
            tag_image,
        ])
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
