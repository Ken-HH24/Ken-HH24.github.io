package Model

import (
	"github.com/dgrijalva/jwt-go"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `json:"username"`
	Password string `json:"password"`
	Todos    []Todo `gorm:"foreignKey:UserID"`
}

type UserStdClaims struct {
	*User
	jwt.StandardClaims
}
