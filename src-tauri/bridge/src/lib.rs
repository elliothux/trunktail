use swift_rs::{swift, SRString};

// test function
swift!(fn ffi_ping() -> SRString);

pub fn ping() -> String {
    unsafe {    
        ffi_ping().to_string()
    }
}
