package api

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
	apiPanicDir = os.Getenv("FUZZ_PANIC_DIR")
	apiSeenMu   sync.Mutex
	apiSeen     = map[string]bool{}
)

func apiRecord(kind string, input []byte, r any, stack []byte) {
	key := fmt.Sprintf("%v", r)
	apiSeenMu.Lock()
	defer apiSeenMu.Unlock()
	if apiSeen[key] {
		return
	}
	apiSeen[key] = true
	if apiPanicDir == "" {
		return
	}
	_ = os.MkdirAll(apiPanicDir, 0o755)
	s := sha256.Sum256(input)
	base := filepath.Join(apiPanicDir, fmt.Sprintf("%s_%s", kind, hex.EncodeToString(s[:])[:16]))
	_ = os.WriteFile(base+".input", input, 0o644)
	_ = os.WriteFile(base+".panic", append([]byte(key+"\n\n"), stack...), 0o644)
}

func FuzzGetSlotSSZ(f *testing.F) {
	f.Add([]byte{0})
	f.Add(make([]byte, 64))
	f.Fuzz(func(t *testing.T, data []byte) {
		defer func() {
			if r := recover(); r != nil {
				apiRecord("getslotssz", data, r, debug.Stack())
			}
		}()
		_, _ = getSlotFromBuilderSSZPayload(data)
	})
}

func FuzzGetSlotJSON(f *testing.F) {
	f.Add([]byte(`{"message":{"slot":"1"}}`))
	f.Add([]byte(`{}`))
	f.Fuzz(func(t *testing.T, data []byte) {
		defer func() {
			if r := recover(); r != nil {
				apiRecord("getslotjson", data, r, debug.Stack())
			}
		}()
		_, _ = getSlotFromBuilderJSONPayload(data)
	})
}
