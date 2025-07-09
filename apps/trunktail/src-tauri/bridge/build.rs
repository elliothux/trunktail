use swift_rs::SwiftLinker;

fn main() {
    // Ensure this matches the versions set in your `Package.swift` file.
    SwiftLinker::new("15.0")
//         .with_ios("16")
//         .with_visionos("1")
        .with_package("container-bridge", "../../swift-lib/")
        .link();
    
    // Link required system libraries for containerization framework
    println!("cargo:rustc-link-lib=archive");
    println!("cargo:rustc-link-lib=c++");
    println!("cargo:rustc-link-lib=c++abi");
    
    // Add library search paths (libarchive is keg-only in Homebrew)
    println!("cargo:rustc-link-search=/opt/homebrew/opt/libarchive/lib");
    println!("cargo:rustc-link-search=/opt/homebrew/lib");
    println!("cargo:rustc-link-search=/usr/lib");
    
    // Include paths for libarchive headers
    println!("cargo:rustc-env=CPPFLAGS=-I/opt/homebrew/opt/libarchive/include");
}
