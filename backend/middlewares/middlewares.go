package middlewares

import "github.com/gin-gonic/gin"

func CorsMiddleware(ctx *gin.Context) {
  ctx.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
  ctx.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
  ctx.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST")
  ctx.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept")
  
  if ctx.Request.Method == "OPTIONS" {
    ctx.AbortWithStatus(204)
    return
  }
  ctx.Next()
}