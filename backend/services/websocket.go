package services

import (
	"sync"

	"github.com/gorilla/websocket"
)

type IWebsocketConnection interface {
	SendMessage(message []byte) error
	ReceiveMessage() ([]byte, error)
	Close() error
}

type WebSocketConnection struct {
	conn  *websocket.Conn
	mutex sync.Mutex
}
