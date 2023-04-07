class CreateAppMessages < ActiveRecord::Migration[7.0]
  def change
    create_table :app_messages do |t|
      t.string :title, null: false
      t.text :body, null: false
      t.integer :msg_type, null: false, default: 0
      t.integer :status, null: false, default: 0
      t.integer :creator_id
      t.integer :updater_id
      t.integer :user_ids, array: true, null: false, default: []
      t.boolean :is_important, default: false, null: false

      t.timestamps
    end
  end
end
