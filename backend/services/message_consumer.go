package services

import (
	"fmt"

	"github.com/17sTomy/pizza-shop/config"
	"github.com/17sTomy/pizza-shop/logger"
	"github.com/rabbitmq/amqp091-go"
)

type IMessageConsumer interface {
	DeclareQueue(queueName string) error
	ConsumeEventAndProcess(queueName string, processor IMessageProcessor) error
}

type MessageConsumer struct {
	conf *config.RabbitMqConnection
}

func (mcs *MessageConsumer) DeclareQueue(queueName string) error {
	channel, errCh := mcs.conf.GetChannel()
	if errCh != nil {
		return fmt.Errorf("failed to get channel: %v", errCh)
	}
	if channel == nil {
		return fmt.Errorf("message channel is nil, please retry")
	}

	_, err := channel.QueueDeclare(
		queueName,
		true,
		false,
		false,
		false,
		nil,
	)
	return err
}

func (mcs *MessageConsumer) ConsumeEventAndProcess(queueName string, processor IMessageProcessor) error {
	channel, errCh := mcs.conf.GetChannel()
	if errCh != nil {
		return fmt.Errorf("failed to get channel: %v", errCh)
	}
	if channel == nil {
		return fmt.Errorf("message channel is nil, please retry")
	}

	messages, errMsg := channel.Consume(
		queueName,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if errMsg != nil {
		return fmt.Errorf("failed to consume messages: %v", errMsg)
	}

	go func() {
		for msg := range messages {
			go func(msg amqp091.Delivery) {
				err := processor.ProcessMessage(msg.Body)
				if err != nil {
					logger.Log(fmt.Sprintf("Message processing failed: %v", err))
				}
			}(msg)
		}
	}()

	select {}
}

func GetMessageConsumerService() *MessageConsumer {
	rabbitMQConf := config.GetNewRabbitMqConnection()
	return &MessageConsumer{
		conf: rabbitMQConf,
	}
}
