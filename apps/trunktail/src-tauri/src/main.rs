#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{command, Builder, Manager};
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

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

#[command]
fn is_apple_silicon() -> bool {
    #[cfg(target_arch = "aarch64")]
    {
        true
    }
    #[cfg(not(target_arch = "aarch64"))]
    {
        false
    }
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
tauri_command_async!(system_status);

fn main() {
    #[cfg(debug_assertions)]
    let devtools = tauri_plugin_devtools::init();
    let mut builder = Builder::default();
    #[cfg(debug_assertions)]
    {
        builder = builder.plugin(devtools);
    }

    builder
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
            system_status,
            is_apple_silicon,
        ])
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
