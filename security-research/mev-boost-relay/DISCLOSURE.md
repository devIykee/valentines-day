# Out-of-bounds slice panic in `getSlotFromBuilderSSZPayload` (mev-boost-relay)

**To:** security@flashbots.net
**Component:** `mev-boost-relay`
**Affected code:** `services/api/utils.go`, `getSlotFromBuilderSSZPayload`
**Introduced in:** #745 ("Add Fusaka support for MEV-Boost relay")
**Reviewed commit:** `fddb05e` on `main`
**Network:** N/A — source-level finding, reproducible with a unit/fuzz test, no live deployment required.
**Reporter's own severity assessment:** **Low** (self-inflicted request failure; the Go HTTP server recovers the panic per-connection — no process crash, no cross-request or consensus impact). Reporting it as a hardening fix, not a protocol-security break.

## Summary

The SSZ slot-extraction helper used during block submission computes an SSZ "message offset" bounds check in `uint32` arithmetic that can wrap, allowing an out-of-bounds slice and a runtime panic on attacker-controlled bytes. The parsing happens before the builder is authenticated (`checkBuilderEntry`), so it is reachable by any client that can reach the public builder-submission endpoint.

## Root cause

```go
func getSlotFromBuilderSSZPayload(input []byte) (uint64, error) {
    if len(input) < 8 {
        return 0, ErrPayloadTooShortForMessageOffset
    }
    messageOffset := binary.LittleEndian.Uint32(input[4:8])
    if int(messageOffset+8) > len(input) {        // (A) uint32 add wraps
        return 0, errors.Wrapf(ErrPayloadTooShortForSlot, "offset %d", messageOffset)
    }
    slot := binary.LittleEndian.Uint64(input[messageOffset : messageOffset+8]) // (B) OOB slice
    return slot, nil
}
```

Two problems:

1. **Incorrect layout assumption.** In an SSZ `SubmitBlockRequest`, the first field is the fixed-size `BidTrace` container, which SSZ inlines at offset 0; its first field is the `slot` (`uint64`). The slot is therefore at `input[0:8]`. The function instead reads `input[4:8]` as an *offset to the message*. For any real slot (`< 2^32`) those upper 4 bytes are zero, so `messageOffset == 0` and `input[0:8]` is read — i.e. the function returns the correct slot only by accident. (Confirmed against the repo's own `submitBlockPayload{Electra,Fulu}.ssz` test vectors: slot bytes are at offset 0, `input[4:8] == 0`.)

2. **Integer-overflow bounds bypass.** At (A), `messageOffset + 8` is `uint32` arithmetic. With `messageOffset = 0xFFFFFFFF`, it wraps to `7`, passing the `> len(input)` guard; then (B) evaluates `input[0xFFFFFFFF:7]` → `runtime error: slice bounds out of range`.

## Reachability

`handleSubmitNewBlock` (`services/api/service.go`) calls this when the `Eth-Consensus-Version` header is absent **and** `Content-Type: application/octet-stream`:

```go
builderEthConsensusVersion := req.Header.Get(HeaderEthConsensusVersion)
if builderEthConsensusVersion == "" {
    if contentType == common.ApplicationOctetStream {
        slot, err := getSlotFromBuilderSSZPayload(requestPayloadBytes)   // panics here
        ...
```

This runs **before** `checkBuilderEntry`, i.e. before builder authorization.

## Reproduction

Minimal, deterministic unit test (package `api`):

```go
func TestOffsetOverflowPoC(t *testing.T) {
    input := make([]byte, 64)
    binary.LittleEndian.PutUint32(input[4:8], 0xFFFFFFFF) // slot's upper 4 bytes != 0
    _, _ = getSlotFromBuilderSSZPayload(input)            // panic: slice bounds out of range [4294967295:7]
}
```

Equivalent over the wire: `POST /relay/v1/builder/blocks` with `Content-Type: application/octet-stream`, **no** `Eth-Consensus-Version` header, and a body of ≥ 8 bytes whose bytes `[4:8]` are `0xFFFFFFFF` (any value `M` with `M > len(body)` but `(M+8) mod 2^32 <= len(body)` works). A `go test -fuzz` harness over this function produces the same single panic class across the full family of overflowing offsets.

## Impact

Low. The relay serves this handler via `gorilla/mux` on `net/http`, which has no custom panic middleware, so the panic is caught by `net/http`'s per-connection `recover`: the offending connection is dropped and a stack trace is logged, but the process does not crash and other builders'/proposers' requests are unaffected. The slot parse is only ever called inline in the request goroutine, never in a spawned goroutine (which would not be recovered). So the practical effect is a self-inflicted `500`/connection reset plus log noise. No MEV-theft, block-forgery, or consensus impact.

## Suggested fix

Read the slot directly from the inlined `BidTrace` at offset 0:

```go
func getSlotFromBuilderSSZPayload(input []byte) (uint64, error) {
    if len(input) < 8 {
        return 0, ErrPayloadTooShortForSlot
    }
    return binary.LittleEndian.Uint64(input[:8]), nil
}
```

Verified: the repo's existing `TestGetSlotFromBuilderSSZPayload` (Capella/Deneb/Electra/Fulu vectors) still passes, and a 120k-exec fuzz run of the patched function produces no panics. Patch file: `fix_getSlotFromBuilderSSZPayload.patch`.
