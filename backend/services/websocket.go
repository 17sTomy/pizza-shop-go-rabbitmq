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

func (ws *WebSocketConnection) SendMessage(message []byte) error {
	ws.mutex.Lock()
	defer ws.mutex.Unlock()
	return ws.conn.WriteMessage(websocket.TextMessage, message)
}

func (ws *WebSocketConnection) ReceiveMessage() ([]byte, error) {
	ws.mutex.Lock()
	defer ws.mutex.Unlock()
	_, message, err := ws.conn.ReadMessage()
	return message, err
}

func (ws *WebSocketConnection) Close() error {
	return ws.conn.Close()
}

func NewWebSocketConnection(conn *websocket.Conn) IWebsocketConnection {
	return &WebSocketConnection{conn: conn}
}
