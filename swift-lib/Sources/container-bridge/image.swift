import ContainerClient
import ContainerizationOCI
import Foundation
import SwiftRs

struct ImageFullInfo: Codable {
  let description: ImageDescription
  let index: Index
  let manifest: Manifest
  let config: ContainerizationOCI.Image
}

@_cdecl("ffi_list_images")
public func listImages(context: FFIContext, completion: FFICompletion) {
  Task {
    do {
      let clientImages = try await ClientImage.list()
      var infos: [ImageFullInfo] = []
      try await withThrowingTaskGroup(of: ImageFullInfo.self) { group in
        for img in clientImages {
          group.addTask {
            let index = try await img.index()
            let desc = index.manifests.first
            let platform = desc?.platform ?? Platform(arch: "arm64", os: "darwin")
            let manifest = try await img.manifest(for: platform)
            let config = try await img.config(for: platform)
            return ImageFullInfo(
              description: img.description, index: index, manifest: manifest, config: config)
          }
        }
        for try await info in group {
          infos.append(info)
        }
      }
      FFIResult.from(infos)
        .returnBytes(context, completion)
    } catch {
      FFIErrorResult.from(error.localizedDescription)
        .returnBytes(context, completion)
    }
  }
}
