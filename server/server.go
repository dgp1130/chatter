package main

import (
	"fmt"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Println("Hello World!")

	s := gin.Default()
	s.Use(static.Serve("/", static.LocalFile("./client/build", false)))
	s.Use(static.Serve("/assets", static.LocalFile("./client/assets", false)))

	s.Run(":8080")
}
