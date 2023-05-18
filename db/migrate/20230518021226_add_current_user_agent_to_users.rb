class AddCurrentUserAgentToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :user_agent, :string
  end
end
