# mev-boost-relay security finding

A low-severity bug found by source review of [flashbots/mev-boost-relay](https://github.com/flashbots/mev-boost-relay)
(commit `fddb05e`, `main`), reported to security@flashbots.net.

## The bug

Integer overflow → out-of-bounds slice panic in `getSlotFromBuilderSSZPayload`
(`services/api/utils.go`, introduced in PR #745 "Add Fusaka support").

The SSZ offset bounds check is computed in `uint32`, so a crafted offset wraps
past the check and the following slice goes out of range. Reachable pre-auth
(before `checkBuilderEntry`) when a submission arrives as
`application/octet-stream` with no `Eth-Consensus-Version` header.

**Severity: low.** The `net/http` server recovers the panic per connection, so
only the attacker's own request fails — no process crash, no cross-request or
consensus impact. A hardening fix, not a protocol break.

## Files

| File | What it is |
|---|---|
| `DISCLOSURE.md` | Full write-up (root cause, reachability, impact, fix) |
| `fix_getSlotFromBuilderSSZPayload.patch` | The verified one-line-logic fix (git patch) |
| `fuzz_api_test.go` | Go fuzz harness for the slot-extraction functions |
| `fuzz_common_test.go` | Go fuzz harness for the SSZ/JSON submission + blinded-block decoders |
| `poc_panic_input.bin` | A 64-byte input that triggers the panic |

## Reproduce

Minimal unit test against the function (package `api`):

```go
input := make([]byte, 64)
binary.LittleEndian.PutUint32(input[4:8], 0xFFFFFFFF)
getSlotFromBuilderSSZPayload(input) // panic: slice bounds out of range [4294967295:7]
```

Verified: the existing `TestGetSlotFromBuilderSSZPayload` vectors
(Capella/Deneb/Electra/Fulu) still pass with the fix applied, and a post-fix
fuzz run produces no panics.
