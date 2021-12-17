package Model

import "gorm.io/gorm"

type Todo struct {
	gorm.Model
	Content string `json:"content"`
	UserID  uint
}
