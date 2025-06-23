// swift-tools-version: 6.2
import PackageDescription

let package = Package(
    name: "container-bridge",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        // Products define the executables and libraries a package produces, making them visible to other packages.
        .library(
            name: "container-bridge",
            type: .static,
            targets: ["container-bridge"],
        ),
    ],
    dependencies: [
         .package(url: "https://github.com/apple/container.git", from: "0.1.0"),
         .package(url: "https://github.com/apple/containerization.git", from: "0.1.0"),
         .package(url: "https://github.com/Brendonovich/swift-rs.git", from: "1.0.5"),
    ],
    targets: [
        .target(
            name: "container-bridge",
            dependencies: [
                .product(name: "SwiftRs", package: "swift-rs"),
                .product(name: "ContainerClient", package: "container"),
                .product(name: "ContainerizationOS", package: "containerization"),
            ],
        ),
        .testTarget(
            name: "container-bridgeTests",
            dependencies: ["container-bridge"]
        ),
    ]
)
