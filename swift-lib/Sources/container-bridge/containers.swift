import ContainerClient
import ContainerizationOCI
import Foundation
import SwiftRs

@_cdecl("ffi_list_containers")
public func listContainers(context: FFIContext, completion: FFICompletion) {
  Task {
    do {
      let containers = try await ClientContainer.list()
      FFIResult.from(containers)
        .returnBytes(context, completion)
    } catch {
      print("[listContainers] error: \(error)")
      FFIErrorResult.from(error.localizedDescription)
        .returnBytes(context, completion)
    }
  }
}
