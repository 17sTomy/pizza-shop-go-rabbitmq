package main

import (
	"fmt"

	"github.com/17sTomy/pizza-shop/config"
	"github.com/17sTomy/pizza-shop/constants"
	"github.com/17sTomy/pizza-shop/handlers"
	"github.com/17sTomy/pizza-shop/logger"
	"github.com/17sTomy/pizza-shop/middlewares"
	"github.com/17sTomy/pizza-shop/routes"
	"github.com/17sTomy/pizza-shop/services"
	"github.com/gin-gonic/gin"
)

func main() {
	app := gin.Default() 

  app.Use(gin.Recovery())

  app.Use(middlewares.CorsMiddleware)

  app.GET("/health", func(ctx *gin.Context) {
    ctx.JSON(200, gin.H{
      "status": "ok",
    })
  })

  messagePublisher := services.GetMessagePublisherService()
	messageConsumer := services.GetMessageConsumerService()

	websocketHandler := handlers.GetNewWebSocketHandler()
	messageProcessor := services.GetMessageProcessorService(messagePublisher, websocketHandler.GetConnectionMap())

	go func() {
		err := messageConsumer.ConsumeEventAndProcess(constants.KITCHEN_ORDER_QUEUE, messageProcessor)
		if err != nil {
			logger.Log(fmt.Sprintf("failed to consume events : %v", err))
		}
	}()

	routes.RegisterRoutes(app, messagePublisher, websocketHandler)

	port := config.GetEnvProperty("port")
	logger.Log(fmt.Sprintf("Pizza shop started successfully on port : %s", port))

	app.Run(fmt.Sprintf(":%s", port))
}