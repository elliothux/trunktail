use tauri::async_runtime::channel;
use swift_rs::SRString;

pub type FFICompletion = extern "C" fn(*const u8, i32, u64);

extern "C" fn completion(ptr: *const u8, len: i32, context: u64) {
    let sender: Box<tauri::async_runtime::Sender<Vec<u8>>> =
        unsafe { Box::from_raw(context as *mut _) };
    let slice = unsafe { std::slice::from_raw_parts(ptr, len as usize) };
    let _ = sender.try_send(slice.to_vec());
}

pub async fn call_async_ffi(
    ffi_fn: unsafe extern "C" fn(context: u64, completion: FFICompletion),
) -> String {
    let (sender, mut receiver) = channel::<Vec<u8>>(1);
    let sender_ptr = Box::into_raw(Box::new(sender));

    unsafe {
        ffi_fn(sender_ptr as u64, completion);
    }

    let bytes = receiver.recv().await.unwrap_or_default();
    String::from_utf8(bytes).unwrap_or_else(|_| "error".to_string())
}

pub async fn call_async_ffi_with_params(
    ffi_fn: unsafe extern "C" fn(params: SRString, context: u64, completion: FFICompletion),
    params: String,
) -> String {
    let (sender, mut receiver) = channel::<Vec<u8>>(1);
    let sender_ptr = Box::into_raw(Box::new(sender));
    let params_str = SRString::from(params.as_str());

    unsafe {
        ffi_fn(params_str, sender_ptr as u64, completion);
    }

    let bytes = receiver.recv().await.unwrap_or_default();
    String::from_utf8(bytes).unwrap_or_else(|_| "error".to_string())
}
