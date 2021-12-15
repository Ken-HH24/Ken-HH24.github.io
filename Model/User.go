package Model

import (
	"github.com/dgrijalva/jwt-go"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string
	Password string
}

type UserStdClaims struct {
	*User
	jwt.StandardClaims
}
