package Service

import (
	"gin-practice/Database"
	"gin-practice/Model"
)

func GetTodosByUserId(id string) ([]Model.Todo, error) {
	var todos []Model.Todo
	result := Database.DB.Where("user_id = ?", id).Find(&todos)
	return todos, result.Error
}

func CreateTodo(todo Model.Todo) (Model.Todo, error) {
	result := Database.DB.Create(&todo)
	return todo, result.Error
}

func DeleteTodoByTodoId(id string) error {
	result := Database.DB.Delete(&Model.Todo{}, id)
	return result.Error
}
