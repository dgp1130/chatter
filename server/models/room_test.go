package models

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRoomFields(t *testing.T) {
	r := Room{
		ID:   5,
		Name: "Froom",
	}

	assert.Equal(t, 5, r.ID)
	assert.Equal(t, "Froom", r.Name)
}

func TestRoomJSONSerialization(t *testing.T) {
	r := Room{
		ID:   5,
		Name: "Froom",
	}

	j, _ := json.Marshal(r)

	assert.JSONEq(t, `{
		"id": 5,
		"name": "Froom"
	}`, string(j))
}

func TestRoomJSONDeserialization(t *testing.T) {
	j := `{
		"id": 5,
		"name": "Froom"
	}`

	r := Room{}
	json.Unmarshal([]byte(j), &r)

	assert.Equal(t, Room{
		ID:   5,
		Name: "Froom",
	}, r)
}
