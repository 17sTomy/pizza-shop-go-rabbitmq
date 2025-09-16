package handlers

import (
	"github.com/17sTomy/pizza-shop/constants"
	"github.com/17sTomy/pizza-shop/services"
	"github.com/gin-gonic/gin"
)

type OrderHandler struct {
  messagePublisher services.IMessagePublisher
}

func (oh *OrderHandler) CreateOrder(ctx *gin.Context) {
  var payload map[string]interface{}
  if err := ctx.ShouldBindJSON(&payload); err != nil {
    ctx.JSON(400, gin.H{
      "message": "Bad Request",
      "statusCode": 400,
    })
  }
  payload["order_status"] = constants.ORDER_ORDERED
  oh.messagePublisher.PublishEvent(constants.KITCHEN_ORDER_QUEUE, payload)

  ctx.JSON(200, gin.H{
		"data":       payload,
		"statusCode": 200,
		"message":    "order accepted successfully",
	})
}

func GetOrderHandler(messagePublisher services.IMessagePublisher) *OrderHandler {
	return &OrderHandler{
		messagePublisher: messagePublisher,
	}
}