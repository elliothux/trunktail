import Foundation
import SwiftRs

public typealias FFIContext = UInt64

public typealias FFICompletion = @Sendable @convention(c) (UnsafePointer<UInt8>, Int, UInt64) ->
  Void

public class FFIResult<T: Codable>: Codable {
  public let t: Int64
  public let code: Int
  public let msg: String?
  public let data: T?

  public init(
    t: Int64 = Int64(Date().timeIntervalSince1970 * 1000), code: Int, msg: String? = nil,
    data: T? = nil
  ) {
    self.t = t
    self.code = code
    self.msg = msg
    self.data = data
  }

  public static func from(_ data: T) -> FFIResult<T> {
    return FFIResult<T>(code: 0, msg: nil, data: data)
  }

  public func toJSON() -> String {
    if let str = data as? String {
      return str
    }
    let encoder = JSONEncoder()
    encoder.outputFormatting = .prettyPrinted
    encoder.dateEncodingStrategy = .millisecondsSince1970
    do {
      let data = try encoder.encode(self)
      return String(data: data, encoding: .utf8) ?? FFIErrorResult.encodeErrorString
    } catch {
      print("FFIResult JSON encode error: \(error)")
      return FFIErrorResult.encodeErrorString
    }
  }

  public func returnBytes(_ context: FFIContext, _ completion: FFICompletion) {
    let json = toJSON()
    let data = [UInt8](json.utf8)
    data.withUnsafeBufferPointer { buffer in
      completion(buffer.baseAddress!, buffer.count, context)
    }
  }
}

public struct FFINone: Codable {}

public typealias FFIErrorResult = FFIResult<FFINone>

extension FFIResult where T == FFINone {
  public static var encodeErrorString: String {
    return "{\"t\":0,\"code\":1,\"msg\":\"JSON encode error\"}"
  }

  public static func from(_ msg: String, _ code: Int = 1) -> FFIErrorResult {
    return FFIErrorResult(code: code, msg: msg, data: nil)
  }
}

class FFIParams {
  private let dict: [String: Any]?

  init(dict: [String: Any]) {
    self.dict = dict
  }

  func get<T>(_ key: String) throws -> T {
    if dict == nil {
      throw NSError(
        domain: "FFIParams", code: 1, userInfo: [NSLocalizedDescriptionKey: "Params is nil"])
    }
    guard let value = dict![key] else {
      throw NSError(
        domain: "FFIParams", code: 1,
        userInfo: [NSLocalizedDescriptionKey: "Key \"\(key)\" not found in FFIParams"])
    }
    return value as! T
  }

  func getOptional<T>(_ key: String) throws -> T? {
    if dict == nil {
      return nil
    }
    return dict![key] as? T
  }

  static func from(_ json: String) throws -> FFIParams {
    let data = json.data(using: .utf8)
    let dict = try JSONSerialization.jsonObject(with: data!) as! [String: Any]
    return FFIParams(dict: dict)
  }
}
