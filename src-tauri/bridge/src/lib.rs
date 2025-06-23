use swift_rs::{swift, SRString};

mod ffi_utils;
use ffi_utils::*;

// sync apis
swift!(fn ffi_ping() -> SRString);

pub fn ping() -> String {
    unsafe {
        ffi_ping().to_string()
    }
}

// async apis
unsafe extern "C" {
    pub fn ffi_ping_async(context: u64, completion: FFICompletion);
    pub fn ffi_list_images(context: u64, completion: FFICompletion);
    pub fn ffi_list_containers(context: u64, completion: FFICompletion);
    pub fn ffi_start_container(params: SRString, context: u64, completion: FFICompletion);
    pub fn ffi_stop_container(params: SRString, context: u64, completion: FFICompletion);
    pub fn ffi_kill_container(params: SRString, context: u64, completion: FFICompletion);
    pub fn ffi_delete_container(params: SRString, context: u64, completion: FFICompletion);
}

pub async fn ping_async() -> String {
    call_async_ffi(ffi_ping_async).await
}

pub async fn list_images() -> String {
    call_async_ffi(ffi_list_images).await
}

pub async fn list_containers() -> String {
    call_async_ffi(ffi_list_containers).await
}

pub async fn start_container(params: String) -> String {
    call_async_ffi_with_params(ffi_start_container, params).await
}

pub async fn stop_container(params: String) -> String {
    call_async_ffi_with_params(ffi_stop_container, params).await
}

pub async fn kill_container(params: String) -> String {
    call_async_ffi_with_params(ffi_kill_container, params).await
}

pub async fn delete_container(params: String) -> String {
    call_async_ffi_with_params(ffi_delete_container, params).await
}
