package services

import (
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/17sTomy/pizza-shop/constants"
	"github.com/17sTomy/pizza-shop/logger"
	"github.com/rabbitmq/amqp091-go"
)

type IMessageProcessor interface {
	ProcessMessage(message any) error
}

type MessageProcessor struct {
	publisher  IMessagePublisher
	connection *map[string]IWebsocketConnection
	mutex      sync.RWMutex
}

func (mp *MessageProcessor) ProcessMessage(message any) error {
	msg := message.(amqp091.Delivery)
	var event map[string]any
	var err error
	if err = json.Unmarshal(msg.Body, &event); err != nil {
		logger.Log(fmt.Sprintf("Failed to unmarshal message : %v", err))
		msg.Nack(false, true)
		return err
	}

	logger.Log(fmt.Sprintf("processing message: %v", event))

	if val, ok := event["order_status"]; ok {
		switch val {
		case constants.ORDER_ORDERED:
			{
				err = mp.handleOrderOrdered(event)
			}
		case constants.ORDER_PREPARING:
			{
				err = mp.handleOrderPreparing(event)
			}
		case constants.ORDER_PREPARED:
			{
				err = mp.handleOrderPrepared(event)
			}
		default:
			{
				logger.Log("No order to be processed!")
			}
		}
		if err != nil {
			logger.Log(fmt.Sprintf("Error Processing Message: %v", err))
			msg.Nack(false, true)
			return err
		}
	}

	msg.Ack(false)
	return nil
}

func (mp *MessageProcessor) sendWS(payload map[string]any) error {
	if mp.connection == nil {
		return nil
	}
	bytes, _ := json.Marshal(payload)
	mp.mutex.Lock()
	defer mp.mutex.Unlock()
	conn := (*mp.connection)["pizza"]
	if conn != nil {
		return conn.SendMessage(bytes)
	}
	return nil
}

func (mp *MessageProcessor) handleOrderOrdered(event map[string]any) error {
	var err error
	logger.Log(fmt.Sprintf("order %v accepted", event))
	_ = mp.sendWS(map[string]any{
		"type": "new_order",
		"data": map[string]any{
			"pizzaId":  event["pizza_id"],
			"quantity": event["quantity"],
		},
	})
	event["order_status"] = constants.ORDER_PREPARING
	err = mp.publisher.PublishEvent(constants.KITCHEN_ORDER_QUEUE, event)
	if err != nil {
		logger.Log(fmt.Sprintf("error: %v, event: %v", err, event))
		message := map[string]string{
			"message": constants.ORDER_CANCELLED,
			"error":   err.Error(),
		}
		messagesBytes, _ := json.Marshal(message)
		if mp.connection != nil {
			mp.mutex.Lock()
			defer mp.mutex.Unlock()
			pizza := (*mp.connection)["pizza"]
			if pizza != nil {
				err = (*mp.connection)["pizza"].SendMessage(messagesBytes)
			}
		}
	}
	return err
}

func (mp *MessageProcessor) handleOrderPreparing(event map[string]any) error {
	var err error
	logger.Log(fmt.Sprintf("order %v accepted", event))

	event["order_status"] = constants.ORDER_PREPARED
	pizzaID := event["pizza_id"]
	for p := 5; p <= 95; p += 5 {
		_ = mp.sendWS(map[string]any{
			"type": "pizza_status_update",
			"data": map[string]any{
				"pizzaId":  pizzaID,
				"progress": p,
			},
		})
		time.Sleep(300 * time.Millisecond)
	}

	err = mp.publisher.PublishEvent(constants.KITCHEN_ORDER_QUEUE, event)
	if err != nil {
		logger.Log(fmt.Sprintf("error: %v, event: %v", err, event))
		message := map[string]string{
			"message": constants.ORDER_CANCELLED,
			"error":   err.Error(),
		}

		messagesBytes, _ := json.Marshal(message)

		if mp.connection != nil {
			mp.mutex.Lock()
			defer mp.mutex.Unlock()

			pizza := (*mp.connection)["pizza"]
			if pizza != nil {
				err = (*mp.connection)["pizza"].SendMessage(messagesBytes)
			}
		}
	}

	return err
}

func (mp *MessageProcessor) handleOrderPrepared(event map[string]any) error {
	var err error

	logger.Log(fmt.Sprintf("order %v prepared successfully", event["order_no"]))
	event["order_status"] = constants.ORDER_DELIVERED
	logger.Log(fmt.Sprintf("error: %v, event: %v", err, event))

	message := map[string]any{
		"type": "pizza_ready",
		"data": map[string]any{
			"pizzaId": event["pizza_id"],
		},
	}

	messagesBytes, _ := json.Marshal(message)

	if mp.connection != nil {
		mp.mutex.Lock()
		defer mp.mutex.Unlock()
		pizza := (*mp.connection)["pizza"]
		if pizza != nil {
			err = (*mp.connection)["pizza"].SendMessage(messagesBytes)
		}
	}

	return err
}

func GetMessageProcessorService(
	publisher IMessagePublisher,
	connection *map[string]IWebsocketConnection,
) *MessageProcessor {
	return &MessageProcessor{
		publisher:  publisher,
		connection: connection,
	}
}
