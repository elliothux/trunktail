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
  var references: [String]
  let schemaVersion: Int
  let mediaType: String
  let descriptors: [ImageDescriptorInfo]
  let annotations: [String: String]?
  let isInfra: Bool
}

func getImageInfo(img: ClientImage) async throws -> ImageFullInfo {
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
    references: [img.reference],
    schemaVersion: index.schemaVersion,
    mediaType: index.mediaType,
    descriptors: descriptors,
    annotations: index.annotations,
    isInfra: Utility.isInfraImage(name: img.reference)
  )
}

actor ImageMapActor {
  private var imageMap: [String: ImageFullInfo] = [:]
  func add(_ info: ImageFullInfo) {
    if var existing = imageMap[info.digest] {
      existing.references.append(contentsOf: info.references)
      imageMap[info.digest] = existing
    } else {
      imageMap[info.digest] = info
    }
  }
  func getAll() -> [ImageFullInfo] {
    Array(imageMap.values)
  }
}

@_cdecl("ffi_list_images")
public func listImages(context: FFIContext, completion: FFICompletion) {
  Task {
    do {
      let clientImages = try await ClientImage.list()
      let imageMapActor = ImageMapActor()
      try await withThrowingTaskGroup(of: Void.self) { group in
        for img in clientImages {
          group.addTask {
            let info = try await getImageInfo(img: img)
            await imageMapActor.add(info)
          }
        }
        for try await _ in group {}
      }
      let images = await imageMapActor.getAll()
      FFIResult.from(images)
        .returnBytes(context, completion)
    } catch {
      print("[listImages] error: \(error)")
      FFIErrorResult.from(error.localizedDescription)
        .returnBytes(context, completion)
    }
  }
}

@_cdecl("ffi_save_image")
public func saveImage(params: SRString, context: FFIContext, completion: FFICompletion) {
  let paramsJson = params.toString()
  Task {
    do {
      let params = try FFIParams.from(paramsJson)
      let reference: String = try params.get("reference")
      let output: String = try params.get("output")

      // Platform string in the form 'os/arch/variant'. Example 'linux/arm64/v8', 'linux/amd64'
      let platformString: String? = try params.getOptional("platform")
      var platform: Platform? = nil
      if platformString != nil {
        let platformComponents = platformString!.split(separator: "/")
        if platformComponents.count == 3 {
          platform = Platform.init(arch: String(platformComponents[1]), os: String(platformComponents[0]), variant: String(platformComponents[2]))
        }
        else if platformComponents.count == 2 {
          platform = Platform.init(arch: String(platformComponents[1]), os: String(platformComponents[0]), variant: nil)
        }
        else {
          throw NSError(
            domain: "FFIParams", code: 1,
            userInfo: [NSLocalizedDescriptionKey: "Invalid platform string"])
        }
      }

      let clientImage = try await ClientImage.get(reference: reference)
      let image = try await getImageInfo(img: clientImage)
      try await clientImage.save(out: output, platform: platform)
      FFIResult.from(image).returnBytes(context, completion)
    }
    catch {
      print("[saveImage] error: \(error)")
      FFIErrorResult.from(error.localizedDescription)
        .returnBytes(context, completion)
    }
  }
}

@_cdecl("ffi_load_image")
public func loadImage(params: SRString, context: FFIContext, completion: FFICompletion) {
  let paramsJson = params.toString()
  Task {
    do {
      let params = try FFIParams.from(paramsJson)
      let input: String = try params.get("input")
      let clientImages = try await ClientImage.load(from: input)
      let image = try await getImageInfo(img: clientImages[0])
      FFIResult.from(image).returnBytes(context, completion)
    }
    catch {
      print("[loadImage] error: \(error)")
      FFIErrorResult.from(error.localizedDescription)
        .returnBytes(context, completion)
    }
  }
}

@_cdecl("ffi_prune_images")
public func pruneImages(context: FFIContext, completion: FFICompletion) {
  Task {
    do {
      let clientImages = try await ClientImage.list()
      let (digests, _) = try await ClientImage.pruneImages()
      let prunedImages = clientImages.filter { digests.contains($0.digest) }
      var images: [ImageFullInfo] = []
      try await withThrowingTaskGroup(of: ImageFullInfo.self) { group in
        for img in prunedImages {
          group.addTask {
            try await getImageInfo(img: img)
          }
        }
        for try await info in group {
          images.append(info)
        }
      }
      FFIResult.from(images).returnBytes(context, completion)
    }
    catch {
      print("[pullImage] error: \(error)")
      FFIErrorResult.from(error.localizedDescription)
        .returnBytes(context, completion)
    }
  }
}

@_cdecl("ffi_tag_image")
public func tagImage(params: SRString, context: FFIContext, completion: FFICompletion) {
  let paramsJson = params.toString()
  Task {
    do {
      let params = try FFIParams.from(paramsJson)
      // SOURCE_IMAGE[:TAG]
      let source: String = try params.get("source")
      // TARGET_IMAGE[:TAG]
      let target: String = try params.get("target")
      let image = try await ClientImage.get(reference: source)
      let reference = try ClientImage.normalizeReference(target)
      try await image.tag(new: reference)
      FFIResult.from(try await getImageInfo(img: image)).returnBytes(context, completion)
    }
    catch {
      print("[tagImage] error: \(error)")
      FFIErrorResult.from(error.localizedDescription)
        .returnBytes(context, completion)
    }
  }
}

@_cdecl("ffi_delete_images")
public func deleteImages(params: SRString, context: FFIContext, completion: FFICompletion) {
  let paramsJson = params.toString()
  Task {
    do {
      let params = try FFIParams.from(paramsJson)
      let references: [String] = try params.get("references")
      let (clientImages, _) = try await ClientImage.get(names: references)

      var images: [ImageFullInfo] = []
      try await withThrowingTaskGroup(of: ImageFullInfo.self) { group in
        for image in clientImages {
          group.addTask {
            try await getImageInfo(img: image)
          }
        }
        for try await info in group {
          images.append(info)
        }
      }

      await withThrowingTaskGroup(of: Void.self) { group in
        for image in clientImages {
          group.addTask {
            try await ClientImage.delete(reference: image.reference, garbageCollect: false)
          }
        }
      }
      let _ = try await ClientImage.pruneImages()
      FFIResult.from(images).returnBytes(context, completion)
    } catch {
      print("[deleteImages] error: \(error)")
      FFIErrorResult.from(error.localizedDescription)
        .returnBytes(context, completion)
    }
  }
}
