package Service

import (
	"gin-practice/Database"
	"gin-practice/Model"
)

func FindUserByName(username string) (Model.User, error) {
	var user Model.User
	result := Database.DB.Where("username = ?", username).First(&user)
	return user, result.Error
}

func CreateUser(user Model.User) (Model.User, error) {
	result := Database.DB.Create(&user)
	return user, result.Error
}
