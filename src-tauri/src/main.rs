// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn add_via_swift(a: i32, b: i32) -> i32 {
    container_bridge::add_from_rust(a, b)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![add_via_swift])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
