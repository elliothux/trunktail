import ContainerClient
import ContainerPlugin
import ContainerizationOCI
import Foundation
import SwiftRs

enum SystemStatus: String {
    case running = "running"
    case notRunning = "not_running"
    case notRegistered = "not_registered"
}

@_cdecl("ffi_system_status")
public func systemStatus(context: FFIContext, completion: FFICompletion) {
    Task {
        do {
            let isRegistered = try ServiceManager.isRegistered(fullServiceLabel: "com.apple.container.apiserver")
            let status: SystemStatus
            if !isRegistered {
                status = .notRegistered
            } else {
                do {
                    try await ClientHealthCheck.ping(timeout: .seconds(5))
                    status = .running
                } catch {
                    status = .notRunning
                }
            }
            FFIResult.from(status.rawValue)
                .returnBytes(context, completion)
        } catch {
            FFIErrorResult.from("\(error)")
                .returnBytes(context, completion)
        }
    }
}
