class AddNicknameToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :nickname, :string, index: true
    add_index :users, [:username, :nickname], unique: true
  end
end
