package Route

import (
	"gin-practice/Middleware"

	"github.com/gin-gonic/gin"
)

var R *gin.Engine

func InitRoute() {
	R = gin.Default()
	R.Use(Middleware.Cors())
	UserRegister(R)
	TodoRegister(R)
	R.Run()
}
