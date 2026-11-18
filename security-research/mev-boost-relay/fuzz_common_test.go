package common

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"os"
	"path/filepath"
	"runtime/debug"
	"sync"
	"testing"
)

var (
	panicDir  = os.Getenv("FUZZ_PANIC_DIR")
	seenMu    sync.Mutex
	seenPanic = map[string]bool{}
)

// record a recovered panic once per distinct stack top; save the offending input.
func recordPanic(kind string, input []byte, r any, stack []byte) {
	key := fmt.Sprintf("%v", r)
	seenMu.Lock()
	defer seenMu.Unlock()
	if seenPanic[key] {
		return
	}
	seenPanic[key] = true
	if panicDir == "" {
		return
	}
	_ = os.MkdirAll(panicDir, 0o755)
	s := sha256.Sum256(input)
	sum := hex.EncodeToString(s[:])[:16]
	base := filepath.Join(panicDir, fmt.Sprintf("%s_%s", kind, sum))
	_ = os.WriteFile(base+".input", input, 0o644)
	_ = os.WriteFile(base+".panic", append([]byte(key+"\n\n"), stack...), 0o644)
}

func versionStr(b uint8) string {
	switch b % 7 {
	case 0:
		return EthConsensusVersionCapella
	case 1:
		return EthConsensusVersionDeneb
	case 2:
		return EthConsensusVersionElectra
	case 3:
		return EthConsensusVersionFulu
	case 4:
		return "bellatrix"
	case 5:
		return ""
	default:
		return "garbage-version"
	}
}

func ctStr(b uint8) string {
	if b%2 == 0 {
		return ApplicationOctetStream
	}
	return ApplicationJSON
}

func seed(f *testing.F, names ...string) {
	dir := os.Getenv("FUZZ_SEED_DIR")
	if dir == "" {
		return
	}
	for _, n := range names {
		data, err := os.ReadFile(filepath.Join(dir, n))
		if err != nil {
			continue
		}
		f.Add(data, uint8(2), uint8(0)) // electra, octet-stream
		f.Add(data, uint8(3), uint8(1)) // fulu, json
	}
}

func FuzzSubmitBlockUnmarshal(f *testing.F) {
	seed(f, "submitBlockPayloadElectra.ssz", "submitBlockPayloadFulu.ssz",
		"submitBlockPayloadElectra.json", "submitBlockPayloadFulu.json",
		"submitBlockPayloadDeneb_Goerli.ssz")
	f.Fuzz(func(t *testing.T, data []byte, ver, ct uint8) {
		defer func() {
			if r := recover(); r != nil {
				recordPanic("submitblock", data, r, debug.Stack())
			}
		}()
		p := new(VersionedSubmitBlockRequest)
		_ = p.UnmarshalWithVersion(data, ctStr(ct), versionStr(ver))
	})
}

func FuzzBlindedBlockUnmarshal(f *testing.F) {
	seed(f, "signedBlindedBeaconBlockDeneb_Goerli.json", "signedBlindedBeaconBlockCapella_Goerli.json")
	f.Fuzz(func(t *testing.T, data []byte, ver, ct uint8) {
		defer func() {
			if r := recover(); r != nil {
				recordPanic("blindedblock", data, r, debug.Stack())
			}
		}()
		p := new(VersionedSignedBlindedBeaconBlock)
		if err := p.Unmarshal(data, ctStr(ct), versionStr(ver)); err == nil {
			// exercise the accessors the getPayload handler calls on a decoded block
			_, _ = p.Slot()
		}
	})
}
