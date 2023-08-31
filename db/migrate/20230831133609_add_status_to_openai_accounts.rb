class AddStatusToOpenaiAccounts < ActiveRecord::Migration[7.0]
  def change
    add_column :openai_accounts, :status, :integer, default: 0
  end
end
