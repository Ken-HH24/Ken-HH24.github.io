package Route

import (
	"gin-practice/Handler"
	"gin-practice/Middleware"

	"github.com/gin-gonic/gin"
)

func TodoRegister(r *gin.Engine) {
	todoRouter := r.Group("/todo")
	todoRouter.Use(Middleware.JWTAuthMiddleware())
	{
		todoRouter.GET("/:id", Handler.GetTodosHandler)
		todoRouter.POST("/:id", Handler.CreateTodoHandler)
		todoRouter.DELETE("/:id", Handler.DeleteTodoHandler)
	}
}
