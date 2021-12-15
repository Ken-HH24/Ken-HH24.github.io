package Route

import (
	"gin-practice/Handler"
	"gin-practice/Middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

func UserRegister(r *gin.Engine) {
	userRoute := r.Group("user")
	{
		userRoute.POST("/login", Handler.LoginHandler)
		userRoute.POST("/signup", Handler.SignUpHandler)
		userRoute.GET("/info", Middleware.JWTAuthMiddleware(), func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "success",
			})
		})
	}
}
