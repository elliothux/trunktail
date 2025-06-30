import Testing
@testable import container_bridge
import Foundation
import SwiftRs

// Helper to bridge C-style callbacks with Swift's async/await
private func ffiCall(
_ ffiFunction: (FFIContext, FFICompletion) -> Void,
) async throws -> String {
  typealias Continuation = CheckedContinuation<String, Error>

  return try await withCheckedThrowingContinuation { (continuation: Continuation) in
    let unmanagedContinuation = Unmanaged.passRetained(continuation as AnyObject)
    let pointerAsInt = Int(bitPattern: unmanagedContinuation.toOpaque())
    let context = UInt64(pointerAsInt)

    let completion: @Sendable @convention(c) (UnsafePointer<UInt8>, Int, UInt64) -> Void = {
      bytes, len, ctx in
      let int_ptr = Int(bitPattern: UInt(ctx))
      guard let pointer = UnsafeMutableRawPointer(bitPattern: int_ptr) else {
        return
      }
      let unmanaged = Unmanaged<AnyObject>.fromOpaque(pointer)
      let callbackContinuation = unmanaged.takeRetainedValue() as! Continuation

      let data = Data(bytes: bytes, count: len)
      let str = String(data: data, encoding: .utf8)!
      callbackContinuation.resume(returning: str)
    }

    ffiFunction(context, completion)
  }
}

private func ffiCallWithParams(
_ ffiFunction: (SRString, FFIContext, FFICompletion) -> Void,
_ params: SRString,
) async throws -> String {
  typealias Continuation = CheckedContinuation<String, Error>

  return try await withCheckedThrowingContinuation { (continuation: Continuation) in
    let unmanagedContinuation = Unmanaged.passRetained(continuation as AnyObject)
    let pointerAsInt = Int(bitPattern: unmanagedContinuation.toOpaque())
    let context = UInt64(pointerAsInt)

    let completion: @Sendable @convention(c) (UnsafePointer<UInt8>, Int, UInt64) -> Void = {
      bytes, len, ctx in
      let int_ptr = Int(bitPattern: UInt(ctx))
      guard let pointer = UnsafeMutableRawPointer(bitPattern: int_ptr) else {
        return
      }
      let unmanaged = Unmanaged<AnyObject>.fromOpaque(pointer)
      let callbackContinuation = unmanaged.takeRetainedValue() as! Continuation

      let data = Data(bytes: bytes, count: len)
      let str = String(data: data, encoding: .utf8)!
      callbackContinuation.resume(returning: str)
    }

    ffiFunction(params, context, completion)
  }
}

struct DecodableContainer: Codable {}
struct DecodableImage: Codable {}

@Test func testListContainers() async throws {
  let jsonString = try await ffiCall(listContainers)
  let jsonData = try #require(jsonString.data(using: .utf8))
  print(jsonString)
  let response = try #require(
    try? JSONDecoder().decode(FFIResult<[DecodableContainer]>.self, from: jsonData))
  #expect(response.code == 0)
  #expect(response.data != nil)
}

@Test func testListImages() async throws {
  let jsonString = try await ffiCall(listImages)
  let jsonData = try #require(jsonString.data(using: .utf8))
  print(jsonString)
  let response = try #require(
    try? JSONDecoder().decode(FFIResult<[DecodableImage]>.self, from: jsonData))
  #expect(response.code == 0)
  #expect(response.data != nil)
}

@Test func testStartContainer() async throws {
  let params = SRString("{\"id\":\"my-nginx\"}")
  let jsonString = try await ffiCallWithParams(startContainer, params)
  let jsonData = try #require(jsonString.data(using: .utf8))
  print(jsonString)
  let response = try #require(
    try? JSONDecoder().decode(FFIResult<DecodableContainer>.self, from: jsonData))
  #expect(response.code == 0)
  #expect(response.data != nil)
}

@Test func testStopContainer() async throws {
  let params = SRString("{\"id\":\"my-nginx\", \"signal\":\"SIGTERM\", \"timeout\":5000}")
  let jsonString = try await ffiCallWithParams(stopContainer, params)
  let jsonData = try #require(jsonString.data(using: .utf8))
  print(jsonString)
  let response = try #require(
    try? JSONDecoder().decode(FFIResult<DecodableContainer>.self, from: jsonData))
  #expect(response.code == 0)
  #expect(response.data != nil)
}

@Test func testKillContainer() async throws {
  let params = SRString("{\"id\":\"my-nginx\", \"signal\":\"SIGTERM\"}")
  let jsonString = try await ffiCallWithParams(killContainer, params)
  let jsonData = try #require(jsonString.data(using: .utf8))
  print(jsonString)
  let response = try #require(
    try? JSONDecoder().decode(FFIResult<DecodableContainer>.self, from: jsonData))
  #expect(response.code == 0)
  #expect(response.data != nil)
}

@Test func testDeleteContainer() async throws {
  let params = SRString("{\"id\":\"my-nginx\"}")
  let jsonString = try await ffiCallWithParams(deleteContainer, params)
  let jsonData = try #require(jsonString.data(using: .utf8))
  print(jsonString)
  let response = try #require(
    try? JSONDecoder().decode(FFIResult<DecodableContainer>.self, from: jsonData))
  #expect(response.code == 0)
  #expect(response.data != nil)
}

@Test func testDeleteImage() async throws {
  let params = SRString("{\"reference\":\"docker.io/library/node:alpine\"}")
  let jsonString = try await ffiCallWithParams(deleteImage, params)
  let jsonData = try #require(jsonString.data(using: .utf8))
  print(jsonString)
  let response = try #require(
    try? JSONDecoder().decode(FFIResult<DecodableImage>.self, from: jsonData))
  #expect(response.code == 0)
  #expect(response.data != nil)
}
