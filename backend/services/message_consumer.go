package services

import (
	"fmt"

	"github.com/17sTomy/pizza-shop/config"
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
