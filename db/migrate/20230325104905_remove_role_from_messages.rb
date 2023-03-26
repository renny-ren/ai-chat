class RemoveRoleFromMessages < ActiveRecord::Migration[7.0]
  def change
    remove_column :messages, :role, :integer
  end
end
