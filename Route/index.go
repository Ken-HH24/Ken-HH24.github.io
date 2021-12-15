package Route

import "github.com/gin-gonic/gin"

var R *gin.Engine

func InitRoute() {
	R = gin.Default()
	UserRegister(R)
	R.Run()
}
