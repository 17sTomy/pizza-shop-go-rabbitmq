package services

import "sync"

type IMessageProcessor interface {
	ProcessMessage(message interface{}) error
}

type MessageProcessor struct {
	publisher  IMessagePublisher
	connection *map[string]IWebsocketConnection
	mutex      sync.RWMutex
}

func GetMessageProcessorService(publisher IMessagePublisher, connection *map[string]IWebsocketConnection) *MessageProcessor {
	return &MessageProcessor{
		publisher:  publisher,
		connection: connection,
	}
}
