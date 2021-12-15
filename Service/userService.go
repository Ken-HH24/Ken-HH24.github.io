package Service

import (
	"gin-practice/Database"
	"gin-practice/Model"

	"gorm.io/gorm"
)

func FindUserByName(username string) (Model.User, *gorm.DB) {
	var user Model.User
	result := Database.DB.Where("username = ?", username).Find(&user)
	return user, result
}

func CreateUser(user Model.User) (Model.User, *gorm.DB) {
	result := Database.DB.Create(&user)
	return user, result
}
