package Utils

import (
	"errors"
	"gin-practice/Model"
	"time"

	"github.com/dgrijalva/jwt-go"
)

const TokenExpireDuration = time.Hour * 24

var screet = []byte("jwt-screet")

func GenToken(user Model.User) (string, error) {
	c := Model.UserStdClaims{
		User: &user,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(TokenExpireDuration).Unix(),
			Issuer:    "Ken",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, c)
	return token.SignedString(screet)
}

func ParseToken(tokenString string) (*Model.UserStdClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Model.UserStdClaims{}, func(t *jwt.Token) (interface{}, error) {
		return screet, nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*Model.UserStdClaims)
	if ok && token.Valid {
		return claims, nil
	}
	return nil, errors.New("invalid token")
}
