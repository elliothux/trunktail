import Foundation
import SwiftRs

@_cdecl("ffi_ping")
public func ffi_ping() -> SRString {
  return SRString("pong")
}

@_cdecl("ffi_ping_async")
public func pingAsync(context: FFIContext, completion: FFICompletion) {
  Task {
    let str = "pong async: " + String(Date().timeIntervalSince1970)
    FFIResult.from(str).returnBytes(context, completion)
  }
}
