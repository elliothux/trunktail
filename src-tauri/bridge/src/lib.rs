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
