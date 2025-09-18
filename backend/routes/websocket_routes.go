package routes

import (
	"github.com/17sTomy/pizza-shop/handlers"
	"github.com/gin-gonic/gin"
)

func RegisterWebSocketRoutes(
	router *gin.RouterGroup,
	websocketHandler handlers.IWebSocketHandler,
) {
	router.GET("/", websocketHandler.HandleConnection)
}
