class AddReferrerIdToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :referrer_id, :integer
    add_index :users, :referrer_id, unique: true
  end
end
