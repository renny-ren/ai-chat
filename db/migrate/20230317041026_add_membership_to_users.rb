class AddMembershipToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :membership, :integer, default: 0, null: false
  end
end
