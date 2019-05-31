package api

import (
	"net/http"

	"chatter/models"

	"github.com/gin-gonic/gin"
)

// RoomsAPI managed the state of the rooms API handlers.
type RoomsAPI struct {
	// Store rooms in memory. This should really use a database to scale better, but I just don't
	// feel like dealing with a SQL database atm.
	rooms      []models.Room
	currRoomID <-chan int
}

// Init initializes the API into an object to facilitate testing.
func Init() RoomsAPI {
	c := make(chan int)
	api := RoomsAPI{
		rooms:      []models.Room{},
		currRoomID: c,
	}

	// Perpetually send unique IDs on the channel.
	go func() {
		currID := 0
		for {
			c <- currID
			currID++
		}
	}()

	return api
}

// Bind rooms API to the server.
func (r *RoomsAPI) Bind(e *gin.Engine) {
	e.GET("/api/rooms/list", r.listRooms)
	e.POST("/api/rooms/create", r.createRoom)
}

// listRooms returns a JSON array of all rooms currently active with an HTTP 200 OK response.
func (r *RoomsAPI) listRooms(c *gin.Context) {
	c.JSON(http.StatusOK, r.rooms)
}

// createRoom creates a new room and adds it to the list of currently active rooms.
// Accepts inputs as JSON-encoded POST message body. Must have a "name" field set.
// Returns an HTTP 201 Created with the room encoded as JSON.
func (r *RoomsAPI) createRoom(c *gin.Context) {
	// Define request JSON type.
	type createRoomRequest struct {
		Name string `json:"name" binding:"required"`
	}

	// Parse and validate input.
	var json createRoomRequest
	if err := c.BindJSON(&json); err != nil {
		c.String(http.StatusBadRequest, "Must provide a \"name\" field.")
		return
	}

	// Create room and add it to the list.
	room := models.Room{
		ID:   <-r.currRoomID,
		Name: json.Name,
	}
	r.rooms = append(r.rooms, room)

	c.JSON(http.StatusCreated, room)
}
