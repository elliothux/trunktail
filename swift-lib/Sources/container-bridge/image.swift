import ContainerClient
import ContainerizationOCI
import Foundation
import SwiftRs

struct ImageFullInfo: Codable {
  let digest: String
  let reference: String
  let index: Index
}

@_cdecl("ffi_list_images")
public func listImages(context: FFIContext, completion: FFICompletion) {
  Task {
    do {
      let clientImages = try await ClientImage.list()
      var items: [ImageFullInfo] = []
      try await withThrowingTaskGroup(of: ImageFullInfo.self) { group in
        for img in clientImages {
          group.addTask {
              let index = try await img.index()
              return ImageFullInfo(
                digest: img.digest,
                reference: img.reference,
                index: index)
          }
        }
        for try await info in group {
          items.append(info)
        }
      }
      FFIResult.from(items)
        .returnBytes(context, completion)
    } catch {
      print("[listImages] error: \(error)")
      FFIErrorResult.from(error.localizedDescription)
        .returnBytes(context, completion)
    }
  }
}
