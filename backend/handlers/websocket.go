package handlers

import (
	"net/http"
	"sync"

	"github.com/17sTomy/pizza-shop/logger"
	"github.com/17sTomy/pizza-shop/services"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type IWebSocketHandler interface {
	HandleConnection(ctx *gin.Context)
	GetConnectionMap() *map[string]services.IWebsocketConnection
}

type WebSocketHandler struct {
	upgrader   websocket.Upgrader
	connection *map[string]services.IWebsocketConnection
	mutex      sync.Mutex
}

func (h *WebSocketHandler) HandleConnection(ctx *gin.Context) {
	conn, err := h.upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		logger.Log("Failed to upgrade connection")
		return
	}
	defer conn.Close()

	conn.WriteMessage(websocket.TextMessage, []byte("{\"type\":\"connected\"}"))

	connection := services.NewWebSocketConnection(conn)
	h.addConnection("pizza", connection)

	for {
		logger.Log("no message is coming from client")
	}
}

func (h *WebSocketHandler) addConnection(clientId string, connection services.IWebsocketConnection) {
	h.mutex.Lock()
	defer h.mutex.Unlock()

	(*h.connection)[clientId] = connection
}

func (h *WebSocketHandler) GetConnectionMap() *map[string]services.IWebsocketConnection {
	return h.connection
}

func GetNewWebSocketHandler() *WebSocketHandler {
	connection := make(map[string]services.IWebsocketConnection)
	return &WebSocketHandler{
		connection: &connection,
		upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool { return true },
		},
	}
}
