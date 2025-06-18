import Foundation
import SwiftRs

public typealias FFICompletion = @Sendable @convention(c) (SRString) -> ()

public class FFIResult<T: Codable>: Codable {
    public let t: Int64
    public let code: Int
    public let msg: String?
    public let data: T?

    public init(t: Int64 = Int64(Date().timeIntervalSince1970 * 1000), code: Int, msg: String? = nil, data: T? = nil) {
        self.t = t
        self.code = code
        self.msg = msg
        self.data = data
    }

    public static func from(data: T) -> FFIResult<T> {
        return FFIResult<T>(code: 0, msg: nil, data: data)
    }

    public func toJSON() -> SRString {
        let encoder = JSONEncoder()
        encoder.outputFormatting = .prettyPrinted
        encoder.dateEncodingStrategy = .millisecondsSince1970
        do {
            let data = try encoder.encode(self)
            return SRString(String(data: data, encoding: .utf8) ?? FFIErrorResult.encodeErrorString)
        } catch {
            print("FFIResult JSON encode error: \(error)")
            return SRString(FFIErrorResult.encodeErrorString)
        }
    }
}

public struct FFINone: Codable {}

public typealias FFIErrorResult = FFIResult<FFINone>

public extension FFIResult where T == FFINone {
    static var encodeErrorString: String {
        return "{\"t\":0,\"code\":1,\"msg\":\"JSON encode error\"}"
    }

    static func from(msg: String, code: Int = 1) -> FFIErrorResult{
        return FFIErrorResult(code: code, msg: msg, data: nil)
    }
}
