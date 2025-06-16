import Foundation
import SwiftRs

@_cdecl("add")
public func add(_ a: Int32, _ b: Int32) -> Int32 {
    return a + b
}
