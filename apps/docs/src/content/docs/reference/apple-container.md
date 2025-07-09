---
title: Apple Container
description: Reference guide for Apple Container - Apple's native containerization framework for macOS.
---

Apple Container is Apple's native containerization framework designed specifically for Apple Silicon Macs. It provides a Swift-based, high-performance alternative to traditional container platforms like Docker, optimized for macOS and Apple's M-series processors.

### Key Features

- **Native Performance**: Built specifically for Apple Silicon with no performance trade-offs
- **OCI Compliance**: Full compatibility with existing container ecosystems
- **Swift Native**: 100% Swift implementation for optimal macOS integration
- **Registry Support**: Pull from any standard container registry
- **Multi-Architecture**: Support for both ARM64 and AMD64 architectures
- **Lightweight**: Uses lightweight virtualization instead of heavy emulation

## System Requirements

- **Hardware**: Apple Silicon Mac (M1, M2, M3, or newer)
- **Operating System**: macOS 15 Sequoia or later
- **Development Tools**: Xcode 26 Beta (for development)

## Core Capabilities

### Container Management

- Create, run, stop, and manage containers
- Interactive shell sessions
- Resource limits and controls
- Network and volume management

### Image Operations

- Build images from Dockerfiles
- Pull and push to container registries
- Multi-architecture image support
- Local image management

### Registry Integration

- Authentication with container registries
- Support for public and private registries
- Default registry configuration

## Architecture

Apple Container uses the Containerization Swift package for low-level container, image, and process management. It leverages Apple's native virtualization framework for efficient resource utilization and security isolation.

## Links and Resources

- **Official Repository**: [https://github.com/apple/container](https://github.com/apple/container)
- **Releases**: [https://github.com/apple/container/releases](https://github.com/apple/container/releases)
- **Apple Developer Documentation**: [Apple Developer Portal](https://developer.apple.com/)
- **WWDC Sessions**: Check Apple's WWDC archives for containerization topics

---

_Note: Apple Container is currently in active development. Features and requirements may change between releases._
