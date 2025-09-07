package logger

import (
	"log"
	"os"
)

func Log(message any) {
	isLogEnabled := os.Getenv("log")
	if isLogEnabled != "" {
		log.Println(message)
	}
}
