package Middleware

import (
	"gin-practice/Utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func JWTAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.Request.Header.Get("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusForbidden, gin.H{
				"message": "need token",
			})
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusForbidden, gin.H{
				"message": "the format is not correct",
			})
			c.Abort()
			return
		}

		claims, err := Utils.ParseToken(parts[1])
		if err != nil {
			c.JSON(http.StatusForbidden, gin.H{
				"message": "invalid token",
			})
			c.Abort()
			return
		}

		c.Set("user", claims.User)
		c.Next()
	}
}
