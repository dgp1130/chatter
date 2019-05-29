package api

import (
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestListNoRooms(t *testing.T) {
	s := gin.Default()
	a := Init()
	a.Bind(s)

	h := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/rooms/list", nil)
	s.ServeHTTP(h, req)

	assert.Equal(t, http.StatusOK, h.Code)
	assert.JSONEq(t, `[]`, h.Body.String())
}

func TestCreateAndList(t *testing.T) {
	s := gin.Default()
	a := Init()
	a.Bind(s)

	// Create first room.
	createRec1 := httptest.NewRecorder()
	createReq1, _ := http.NewRequest("POST", "/api/rooms/create", strings.NewReader(`{
		"name": "Froom"
	}`))
	s.ServeHTTP(createRec1, createReq1)

	// Assert room created correctly.
	assert.Equal(t, http.StatusCreated, createRec1.Code)
	assert.JSONEq(t, `{
		"id": 0,
		"name": "Froom"
	}`, createRec1.Body.String())

	// Create second room.
	createRec2 := httptest.NewRecorder()
	createReq2, _ := http.NewRequest("POST", "/api/rooms/create", strings.NewReader(`{
		"name": "Baroom"
	}`))
	s.ServeHTTP(createRec2, createReq2)

	// Assert room created correctly.
	assert.Equal(t, http.StatusCreated, createRec2.Code)
	assert.JSONEq(t, `{
		"id": 1,
		"name": "Baroom"
	}`, createRec2.Body.String())

	// List all rooms.
	listRec := httptest.NewRecorder()
	listReq, _ := http.NewRequest("GET", "/api/rooms/list", nil)
	s.ServeHTTP(listRec, listReq)

	// Assert both created rooms are returned correctly.
	assert.Equal(t, http.StatusOK, listRec.Code)
	assert.JSONEq(t, `[
		{
			"id": 0,
			"name": "Froom"
		},
		{
			"id": 1,
			"name": "Baroom"
		}
	]`, listRec.Body.String())
}
