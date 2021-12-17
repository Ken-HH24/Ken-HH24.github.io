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

	user, err := Service.FindUserByName(username)

	if err != nil || !Utils.PasswordVerify(password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "username or password is not correct",
		})
	} else {
		tokenString, _ := Utils.GenToken(user)
		user, _ := json.Marshal(user)
		c.JSON(http.StatusOK, gin.H{
			"user":  string(user),
			"token": tokenString,
		})
	}
}

func SignUpHandler(c *gin.Context) {
	body, _ := c.GetRawData()
	var form map[string]interface{}
	_ = json.Unmarshal(body, &form)

	username := form["username"].(string)
	password := form["password"].(string)

	_, err := Service.FindUserByName(username)

	if err == nil {
		c.JSON(http.StatusForbidden, gin.H{
			"message": "username has been used",
		})
		return
	}

	hashPassword, _ := Utils.PasswordHash(password)
	user, err := Service.CreateUser(Model.User{
		Username: username,
		Password: hashPassword,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "fail to create the user",
		})
	} else {
		user, _ := json.Marshal(user)
		c.JSON(http.StatusOK, gin.H{
			"message": "create successfully",
			"user":    string(user),
		})
	}
}

func GetUserInfoHandler(c *gin.Context) {
	user, exist := c.Get("user")
	if !exist {
		c.JSON(http.StatusForbidden, gin.H{
			"message": "didn't login",
		})
	} else {
		user, _ := json.Marshal(user)
		c.JSON(http.StatusOK, gin.H{
			"user": string(user),
		})
	}
}
