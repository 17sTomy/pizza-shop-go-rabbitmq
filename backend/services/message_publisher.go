package services

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/17sTomy/pizza-shop/config"
	"github.com/17sTomy/pizza-shop/logger"
	"github.com/rabbitmq/amqp091-go"
)

type IMessagePublisher interface {
	DeclareQueue(queueName string) error
	PublishEvent(queueName string, body interface{}) error
}

type MessagePublisher struct {
	conf  *config.RabbitMqConnection
	mutex sync.Mutex
}

func (mp *MessagePublisher) DeclareQueue(queueName string) error {
	channel, errCh := mp.conf.GetChannel()
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

func (mp *MessagePublisher) PublishEvent(queueName string, body interface{}) error {
	data, err := json.Marshal(body)
	if err != nil {
		return err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	if queueName == "" {
		queueName = config.GetEnvProperty("rabbitMqDefaultQueue")
	}

	channel, err2 := mp.conf.GetChannel()
	if err2 != nil {
		log.Printf("error while getting channel...%v", err2)
		return err2
	}
	if channel == nil {
		panic("messaging channel is nil, retry")
	}
	if channel.IsClosed() {
		panic("could not publish event, channel closed")
	}

	logger.Log(fmt.Sprintf("created new channel....%v", &channel))

	err = channel.PublishWithContext(ctx,
		"",
		queueName,
		false,
		false,
		amqp091.Publishing{
			ContentType:  "application/json",
			Body:         data,
			DeliveryMode: amqp091.Persistent,
		},
	)

	if err != nil {
		return err
	}

	logger.Log(fmt.Sprintf("Event published: %v", body))
	errC := channel.Close()
	if errC != nil {
		return errC
	}

	logger.Log(fmt.Sprintf("channel closed: %v", &channel))
	return nil
}
