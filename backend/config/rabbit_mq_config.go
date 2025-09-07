package config

import (
	"fmt"
	"log"
	"strconv"

	"github.com/17sTomy/pizza-shop/logger"
	"github.com/rabbitmq/amqp091-go"
)

type RabbitMqConnection struct {
	conn  *amqp091.Connection
	queue string
}

func GetNewRabbitMqConnection() *RabbitMqConnection {
	host := GetEnvProperty("rabbitMqHost")
	port := GetEnvProperty("rabbitMqPort")
	username := GetEnvProperty("rabbitMqUsername")
	password := GetEnvProperty("rabbitMqPassword")
	queue := GetEnvProperty("rabbitMqDefaultQueue")

	PORT, err := strconv.Atoi(port)
	if err != nil {
		panic(fmt.Sprintf("invalid port : %v", err))
	}

	url := fmt.Sprintf("amqp://%s:%s@%s:%d/", username, password, host, PORT)
	fmt.Println(url)
	conn, err := amqp091.Dial(url)
	if err != nil {
		panic(fmt.Sprintf("failed to connect to RabbitMQ: %v", err))
	}

	log.Println("You're connected to RabbitMQ")

	return &RabbitMqConnection{
		conn:  conn,
		queue: queue,
	}
}

func (r *RabbitMqConnection) Connect() *amqp091.Connection {
	host := GetEnvProperty("rabbitMqHost")
	port := GetEnvProperty("rabbitMqPort")
	username := GetEnvProperty("rabbitMqUsername")
	password := GetEnvProperty("rabbitMqPassword")

	PORT, err := strconv.Atoi(port)
	if err != nil {
		panic(fmt.Sprintf("invalid port : %v", err))
	}

	url := fmt.Sprintf("amqp://%s:%s@%s:%d/", username, password, host, PORT)

	conn, err := amqp091.Dial(url)
	if err != nil {
		panic(fmt.Sprintf("failed to connect to RabbitMQ : %v", err))
	}

	log.Println("RabbitMq has been reconnected")

	return conn
}

func (r *RabbitMqConnection) DeclareQueue(queueName string) error {
	var err error
	channel, err := r.conn.Channel()
	if err != nil {
		return err
	}

	defer func() {
		_ = channel.Close()
	}()

	_, err = channel.QueueDeclare(
		queueName,
		true,
		false,
		false,
		false,
		nil,
	)
	return err
}

func (r *RabbitMqConnection) GetConnection() *amqp091.Connection {
	if r.conn == nil {
		r.conn = r.Connect()
	}
	return r.conn
}

func (r *RabbitMqConnection) GetChannel() (*amqp091.Channel, error) {
	if r.conn == nil {
		r.conn = r.Connect()
	}

	channel, err := r.conn.Channel()
	if err != nil {
		logger.Log("error creating channel: " + err.Error())
		return nil, err
	}

	if channel.IsClosed() {
		channel, err = r.conn.Channel()
		if err != nil {
			logger.Log("error recreating closed channel: " + err.Error())
			return nil, err
		}
	}

	return channel, nil
}

func (r *RabbitMqConnection) GetQueue() string {
	return r.queue
}

func (r *RabbitMqConnection) Close() {
	if r.conn != nil {
		err := r.conn.Close()
		if err != nil {
			logger.Log("error closing RabbitMQ connection: " + err.Error())
		} else {
			logger.Log("RabbitMQ connection closed")
		}
	}
}
