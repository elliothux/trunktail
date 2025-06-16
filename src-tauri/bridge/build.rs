use swift_rs::SwiftLinker;

fn main() {
    // Ensure this matches the versions set in your `Package.swift` file.
    SwiftLinker::new("15.0")
//         .with_ios("16")
//         .with_visionos("1")
        .with_package("container-bridge", "../../swift-lib/")
        .link();
}
