// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{command, Builder};

#[command]
fn ping() -> String {
    container_bridge::ping()
}

fn main() {
    Builder::default()
        .invoke_handler(tauri::generate_handler![
            ping,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
