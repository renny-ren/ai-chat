class AddTotalAvailableToOpenaiAccounts < ActiveRecord::Migration[7.0]
  def change
    add_column :openai_accounts, :total_available, :decimal, precision: 6, scale: 2
  end
end
