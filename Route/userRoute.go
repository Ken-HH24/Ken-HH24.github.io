package Route

import (
	"gin-practice/Handler"
	"gin-practice/Middleware"

	"github.com/gin-gonic/gin"
)

func UserRegister(r *gin.Engine) {
	userRoute := r.Group("user")
	{
		userRoute.POST("/login", Handler.LoginHandler)
		userRoute.POST("/signup", Handler.SignUpHandler)
		userRoute.GET("/info", Middleware.JWTAuthMiddleware(), Handler.GetUserInfoHandler)
	}
}
