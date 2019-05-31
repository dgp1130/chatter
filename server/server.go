package main

import (
	"github.com/dgp1130/chatter/server/api"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	s := gin.Default()

	// Serve static files.
	s.Use(static.Serve("/", static.LocalFile("./client/build", false)))
	s.Use(static.Serve("/assets", static.LocalFile("./client/assets", false)))

	// Bind API handlers.
	a := api.Init()
	a.Bind(s)

	// Start server.
	s.Run(":8080")
}
