import ContainerClient
import ContainerizationOCI
import ContainerizationOS
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

@_cdecl("ffi_start_container")
public func startContainer(params: SRString, context: FFIContext, completion: FFICompletion) {
  let paramsJson = params.toString()
  var container: ClientContainer?
  Task {
    do {
      let params = try FFIParams.from(paramsJson)
      let id: String = try params.get("id")
      container = try await ClientContainer.get(id: id)
      if container == nil {
        throw NSError(
          domain: "container-bridge", code: 1,
          userInfo: [NSLocalizedDescriptionKey: "container not found"])
      }

      let process = try await container!.bootstrap()
      try await process.start([])
      FFIResult
        .from(try await ClientContainer.get(id: id))
        .returnBytes(context, completion)
    } catch {
      try? await container?.stop()
      print("[startContainer] error: \(error)")
      FFIErrorResult.from(error.localizedDescription).returnBytes(context, completion)
    }
  }
}

@_cdecl("ffi_stop_container")
public func stopContainer(params: SRString, context: FFIContext, completion: FFICompletion) {
  let paramsJson = params.toString()
  var container: ClientContainer?
  Task {
    do {
      let params = try FFIParams.from(paramsJson)
      let id: String = try params.get("id")
      let signal: String = try params.get("signal")
      let timeout: Int32 = try params.get("timeout")  // in milliseconds
      container = try await ClientContainer.get(id: id)
      if container == nil {
        throw NSError(
          domain: "container-bridge", code: 1,
          userInfo: [NSLocalizedDescriptionKey: "container not found"])
      }

      let opts = ContainerStopOptions(
        timeoutInSeconds: timeout / 1000,
        signal: try Signals.parseSignal(signal)
      )
      try await container!.stop(opts: opts)
      FFIResult
        .from(try await ClientContainer.get(id: id))
        .returnBytes(context, completion)
    } catch {
      try? await container?.stop()
      print("[stopContainer] error: \(error)")
      FFIErrorResult.from(error.localizedDescription).returnBytes(context, completion)
    }
  }
}

@_cdecl("ffi_kill_container")
public func killContainer(params: SRString, context: FFIContext, completion: FFICompletion) {
  let paramsJson = params.toString()
  var container: ClientContainer?
  Task {
    do {
      let params = try FFIParams.from(paramsJson)
      let id: String = try params.get("id")
      let signal: String = try params.get("signal")
      container = try await ClientContainer.get(id: id)
      if container == nil {
        throw NSError(
          domain: "container-bridge", code: 1,
          userInfo: [NSLocalizedDescriptionKey: "container not found"])
      }

      let signalNumber = try Signals.parseSignal(signal)
      try await container!.kill(signalNumber)
      FFIResult
        .from(try await ClientContainer.get(id: id))
        .returnBytes(context, completion)
    } catch {
      try? await container?.stop()
      print("[killContainer] error: \(error)")
      FFIErrorResult.from(error.localizedDescription).returnBytes(context, completion)
    }
  }
}

@_cdecl("ffi_delete_container")
public func deleteContainer(params: SRString, context: FFIContext, completion: FFICompletion) {
  let paramsJson = params.toString()
  var container: ClientContainer?
  Task {
    do {
      let params = try FFIParams.from(paramsJson)
      let id: String = try params.get("id")
      container = try await ClientContainer.get(id: id)
      if container == nil {
        throw NSError(
          domain: "container-bridge", code: 1,
          userInfo: [NSLocalizedDescriptionKey: "container not found"])
      }

      if container!.status == .running {
        let stopOpts = ContainerStopOptions(
          timeoutInSeconds: 5,
          signal: SIGKILL
        )
        try await container!.stop(opts: stopOpts)
      }
      try await container!.delete()
      FFIResult.from(container).returnBytes(context, completion)
    } catch {
      try? await container?.stop()
      print("[deleteContainer] error: \(error)")
      FFIErrorResult.from(error.localizedDescription).returnBytes(context, completion)
    }
  }
}

// // exec 方案（基础版，实际参数可扩展）
// @_cdecl("ffi_exec_container")
// public func execContainer(id: String, command: UnsafePointer<CChar>, context: FFIContext, completion: FFICompletion) {
//   Task {
//     do {
//       let container = try await ClientContainer.get(id: id)
//       let cmd = String(cString: command)
//       let result = try await container.exec(command: cmd)
//       FFIResult.from(result).returnBytes(context, completion)
//     } catch {
//       print("[execContainer] error: \(error)")
//       FFIErrorResult.from(error.localizedDescription).returnBytes(context, completion)
//     }
//   }
// }
