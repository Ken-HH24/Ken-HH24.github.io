package Handler

import (
	"encoding/json"
	"gin-practice/Model"
	"gin-practice/Service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetTodosHandler(c *gin.Context) {
	id, _ := c.Params.Get("id")
	todos, err := Service.GetTodosByUserId(id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error happend when searching todo",
		})
	} else {
		todos, _ := json.Marshal(todos)
		c.JSON(http.StatusOK, gin.H{
			"todos": string(todos),
		})
	}
}

func CreateTodoHandler(c *gin.Context) {
	body, _ := c.GetRawData()
	var form map[string]interface{}
	_ = json.Unmarshal(body, &form)

	content := form["content"].(string)
	id, _ := c.Params.Get("id")

	userID, _ := strconv.Atoi(id)
	todo, err := Service.CreateTodo(Model.Todo{
		Content: content,
		UserID:  uint(userID),
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "fail to create Todo",
		})
	} else {
		todo, _ := json.Marshal(todo)
		c.JSON(http.StatusOK, gin.H{
			"todo": string(todo),
		})
	}
}

func DeleteTodoHandler(c *gin.Context) {
	id, _ := c.Params.Get("id")
	err := Service.DeleteTodoByTodoId(id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "fail to delete Todo",
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"id": id,
		})
	}
}
