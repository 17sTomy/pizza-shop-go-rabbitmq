package routes

import (
	"github.com/17sTomy/pizza-shop/handlers"
	"github.com/17sTomy/pizza-shop/services"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(
	r *gin.Engine,
	messagePublisher services.IMessagePublisher,
	websocketHandler handlers.IWebSocketHandler,
) {
	router := r.Group("/api")

	wsr := router.Group("/ws")
	{
		RegisterWebSocketRoutes(wsr, websocketHandler)
	}

  or := router.Group("/orders")
  {
    RegisterOrderRoutes(or, messagePublisher)
  }
}
