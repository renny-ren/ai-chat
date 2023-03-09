class AddConfigsToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :config, :jsonb, default: {}
  end
end
