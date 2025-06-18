import SwiftRs

@_cdecl("ffi_ping")
public func ffi_ping() -> SRString {
    return SRString("pong")
}

@_cdecl("ffi_ping_async")
public func pingAsync(completion: FFICompletion) {
    Task {
        // try? await Task.sleep(nanoseconds: 100_000_000)
        completion(SRString("pong"))
    }
}
