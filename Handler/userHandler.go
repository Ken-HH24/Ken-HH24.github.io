package Handler

import (
	"encoding/json"
	"gin-practice/Model"
	"gin-practice/Service"
	"gin-practice/Utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func LoginHandler(c *gin.Context) {
	// 前端通过json传输数据
	body, _ := c.GetRawData()
	var form map[string]interface{}
	_ = json.Unmarshal(body, &form)

	username := form["username"].(string)
	password := form["password"].(string)

	user, result := Service.FindUserByName(username)

	if result.Error != nil || !Utils.PasswordVerify(password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "username or password is not correct",
		})
	} else {
		tokenString, _ := Utils.GenToken(user)
		c.JSON(http.StatusOK, gin.H{
			"username": username,
			"password": password,
			"token":    tokenString,
		})
	}
}

func SignUpHandler(c *gin.Context) {
	body, _ := c.GetRawData()
	var form map[string]interface{}
	_ = json.Unmarshal(body, &form)

	username := form["username"].(string)
	password := form["password"].(string)

	_, result := Service.FindUserByName(username)

	if result.RowsAffected > 0 {
		c.JSON(http.StatusForbidden, gin.H{
			"message": "username has been used",
		})
		return
	}

	hashPassword, _ := Utils.PasswordHash(password)
	user, result := Service.CreateUser(Model.User{
		Username: username,
		Password: hashPassword,
	})

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "fail to create the user",
		})
	} else {
		data, _ := json.Marshal(user)
		c.JSON(http.StatusOK, gin.H{
			"message": "create successfully",
			"data":    data,
		})
	}
}
