Added

- MASQUE is a protocol in the manual node form. It asks for the carrier (`h2`, or `h3` for the QUIC one, kept selectable even where the build dials only h2), the device private and public keys, the tunnel IPv4 and IPv6, the MTU, remote DNS resolution, the DNS list and the TLS server name, and writes them into the `masque://` link the form shows.
- Every protocol's manual form now has a **chain front** picker: any node or group the page knows, written as `dialer-proxy`, so a node can leave through a front without editing the configuration by hand.
