# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

robot_user = User.create(
  nickname: "GPT机器人",
  username: "gpt",
  password: Rails.application.credentials.gpt_user_password,
  password_confirmation: password: Rails.application.credentials.gpt_user_password
)
