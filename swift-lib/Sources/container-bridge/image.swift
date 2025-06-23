import ContainerClient
import ContainerizationOCI
import Foundation
import SwiftRs

struct ImageDescriptorInfo: Codable {
  let descriptor: Descriptor
  let config: ContainerizationOCI.Image
  let manifest: ContainerizationOCI.Manifest
}

struct ImageFullInfo: Codable {
  let digest: String
  let reference: String
  let schemaVersion: Int
  let mediaType: String
  let descriptors: [ImageDescriptorInfo]
  let annotations: [String: String]?
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
            var descriptors: [ImageDescriptorInfo] = []
            for descriptor in index.manifests {
              // Don't list attestation manifests
              if let referenceType = descriptor.annotations?["vnd.docker.reference.type"],
                referenceType == "attestation-manifest"
              {
                continue
              }

              guard let platform = descriptor.platform else {
                continue
              }

              do {
                let config = try await img.config(for: platform)
                let manifest = try await img.manifest(for: platform)
                descriptors.append(
                  ImageDescriptorInfo(
                    descriptor: descriptor,
                    config: config,
                    manifest: manifest
                  ))
              } catch {
                continue
              }
            }
            return ImageFullInfo(
              digest: img.digest,
              reference: img.reference,
              schemaVersion: index.schemaVersion,
              mediaType: index.mediaType,
              descriptors: descriptors,
              annotations: index.annotations
            )
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
