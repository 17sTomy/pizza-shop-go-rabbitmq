package routes

import (
	"github.com/17sTomy/pizza-shop/handlers"
	"github.com/17sTomy/pizza-shop/services"
	"github.com/gin-gonic/gin"
)

func RegisterOrderRoutes(
	router *gin.RouterGroup,
	messagePublisher services.IMessagePublisher,
) {
	oh := handlers.GetOrderHandler(messagePublisher)

  router.POST("/", oh.CreateOrder)
}
