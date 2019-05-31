package models

// Room represents a chat room.
type Room struct {
	ID   int    `json:"id" binding:"required"`
	Name string `json:"name" binding:"required"`
}
