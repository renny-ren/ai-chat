class CreateModels < ActiveRecord::Migration[7.0]
  def change
    create_table :models do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title
      t.string :description
      t.string :introduction
      t.string :permalink
      t.string :system_instruction
      t.boolean :is_public, null: false, default: true
      t.json :openai_params, default: {}

      t.timestamps
    end
  end
end
