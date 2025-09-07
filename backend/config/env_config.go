package config

import (
	"fmt"
	"os"
	"reflect"

	"github.com/17sTomy/pizza-shop/logger"
	"github.com/joho/godotenv"
)

var env ConfigDto

type ConfigDto struct {
	port                 string
	rabbitMqHost         string
	rabbitMqUsername     string
	rabbitMqPassword     string
	rabbitMqPort         string
	rabbitMqDefaultQueue string
}

func ConfigEnv() {
	LoadEnvVariable()

	env = ConfigDto{
		port:                 os.Getenv("PORT"),
		rabbitMqHost:         os.Getenv("RABBIT_MQ_HOST"),
		rabbitMqUsername:     os.Getenv("RABBIT_MQ_USERNAME"),
		rabbitMqPassword:     os.Getenv("RABBIT_MQ_PASSWORD"),
		rabbitMqPort:         os.Getenv("RABBIT_MQ_PORT"),
		rabbitMqDefaultQueue: os.Getenv("RABBIT_MQ_DEFAULT_QUEUE"),
	}
}

func init() {
	if env.port == "" {
		ConfigEnv()
	}
}

func accessField(key string) (string, error) {
	v := reflect.ValueOf(env)
	t := v.Type()

	if t.Kind() != reflect.Struct {
		return "", fmt.Errorf("expected a struct, got %s", t.Kind())
	}

	_, ok := t.FieldByName(key)
	if !ok {
		return "", fmt.Errorf("no such field: %s in env config", key)
	}

	f := v.FieldByName(key)
	return f.String(), nil
}

func LoadEnvVariable() {
	if _, err := os.Stat(".env"); err == nil {
		err = godotenv.Load()
		if err != nil {
			panic("Error loading .env file")
		}
	} else {
		logger.Log(".env file not found, reading configuration from environment variables")
	}
}

func GetEnvProperty(propertyKey string) string {
	if env.port == "" {
		ConfigEnv()
	}

	val, err := accessField(propertyKey)
	if err != nil {
		logger.Log(fmt.Sprintf("error accesing field : %v", propertyKey))
	}

	return val
}
